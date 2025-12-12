import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

// ============================================================================
// POST HANDLER - Main search
// ============================================================================
export async function POST(request) {
  const startTime = Date.now();
  console.log('🔍 V6 Ultimate - Request received');

  try {
    const body = await request.json();
    const { category, keyword, filters, action, asin, product, operation, alertType, threshold, email, products: bundleProducts } = body;

    // Handle different actions
    if (action === 'save') return await handleSave(product);
    if (action === 'competitor') return await handleCompetitor(asin, operation);
    if (action === 'alert') return await handleAlert({ asin, alertType, threshold, email });
    if (action === 'bundle-ai') return await handleBundleAI(bundleProducts, category);
    if (action === 'history') return await handleHistory(body.asins);

    // Default: Search
    console.log('📊 Search:', { category, keyword });

    const cacheKey = `${keyword || category}_${JSON.stringify(filters || {})}`.toLowerCase().replace(/\s+/g, '_');

    // Check cache
    const { data: cached } = await supabase
      .from('product_cache')
      .select('*')
      .eq('cache_key', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (cached) {
      console.log('⚡ Cache hit!');
      return Response.json({
        products: cached.products,
        cached: true,
        processingTime: Date.now() - startTime
      });
    }

    console.log('🌐 Fetching from Perplexity...');
    const products = await fetchFromPerplexity(keyword || category);
    const validated = validateProducts(products);

    // Store in cache
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await supabase.from('product_cache').insert({
      cache_key: cacheKey,
      products: validated,
      category: category || null,
      keyword: keyword || null,
      expires_at: expiresAt.toISOString()
    });

    // Track history
    await supabase.from('product_history').insert(
      validated.map(p => ({
        asin: p.asin,
        price: parseFloat(p.price),
        bsr: parseInt(p.bsr),
        rating: parseFloat(p.rating),
        reviews: parseInt(p.reviews),
        timestamp: new Date().toISOString()
      }))
    ).then(() => console.log('📊 History tracked'), () => {});

    console.log('✅ Complete');
    return Response.json({ products: validated, cached: false, processingTime: Date.now() - startTime });

  } catch (error) {
    console.error('💥 Error:', error);
    return Response.json({ products: generateFallback(8), fallback: true });
  }
}

// ============================================================================
// GET HANDLER - Retrieve saved/competitors
// ============================================================================
export async function GET(request) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'saved') {
    const { data } = await supabase.from('user_saved').select('*').order('saved_at', { ascending: false });
    return Response.json({ products: data || [] });
  }

  if (action === 'competitors') {
    const { data } = await supabase.from('competitors').select('*').order('added_at', { ascending: false });
    return Response.json({ competitors: data || [] });
  }

  return Response.json({ error: 'Invalid action' }, { status: 400 });
}

// ============================================================================
// HANDLERS
// ============================================================================
async function handleSave(product) {
  const { data } = await supabase.from('user_saved').insert({
    asin: product.asin,
    title: product.title,
    price: parseFloat(product.price),
    supplier_price: parseFloat(product.supplier_price),
    bsr: parseInt(product.bsr),
    rating: parseFloat(product.rating),
    reviews: parseInt(product.reviews),
    image_url: product.image_url,
    amazon_url: product.amazon_url,
    supplier_url: product.supplier_url,
    saved_at: new Date().toISOString()
  }).select().single();
  
  return Response.json({ success: true, product: data });
}

async function handleCompetitor(asin, operation) {
  if (operation === 'add') {
    const { data } = await supabase.from('competitors').insert({
      asin,
      added_at: new Date().toISOString()
    }).select().single();
    return Response.json({ success: true, competitor: data });
  }
  
  if (operation === 'remove') {
    await supabase.from('competitors').delete().eq('asin', asin);
    return Response.json({ success: true });
  }
  
  return Response.json({ error: 'Invalid operation' }, { status: 400 });
}

async function handleAlert({ asin, alertType, threshold, email }) {
  const { data } = await supabase.from('price_alerts').insert({
    asin,
    alert_type: alertType,
    threshold,
    email,
    active: true,
    created_at: new Date().toISOString()
  }).select().single();
  
  return Response.json({ success: true, alert: data });
}

async function handleHistory(asins) {
  const { data: priceData } = await supabase
    .from('product_history')
    .select('asin, price, timestamp')
    .in('asin', asins)
    .order('timestamp', { ascending: true });

  const { data: bsrData } = await supabase
    .from('product_history')
    .select('asin, bsr, timestamp')
    .in('asin', asins)
    .order('timestamp', { ascending: true });

  const priceHistory = {};
  const bsrHistory = {};

  priceData?.forEach(r => {
    if (!priceHistory[r.asin]) priceHistory[r.asin] = [];
    priceHistory[r.asin].push({ price: r.price, timestamp: r.timestamp });
  });

  bsrData?.forEach(r => {
    if (!bsrHistory[r.asin]) bsrHistory[r.asin] = [];
    bsrHistory[r.asin].push({ bsr: r.bsr, timestamp: r.timestamp });
  });

  return Response.json({ priceHistory, bsrHistory });
}

async function handleBundleAI(products, category) {
  const context = products.slice(0, 5).map((p, i) => `${i + 1}. ${p.title} - $${p.price}`).join('\n');
  
  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: 'You are an Amazon FBA bundle expert.' },
          { role: 'user', content: `Create a bundle strategy for:\n${context}\n\nProvide: Bundle name, products to include, pricing, target audience, selling points.` }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    const data = await response.json();
    return Response.json({ suggestion: data.choices[0].message.content });
  } catch {
    return Response.json({ suggestion: 'Bundle these products with 15% discount. Great for gift buyers!' });
  }
}

// ============================================================================
// PERPLEXITY API
// ============================================================================
async function fetchFromPerplexity(query) {
  const prompt = `Find 8 REAL Amazon products for: "${query}"

Return ONLY JSON array (no markdown):
[{"title":"Product name","asin":"B0XXXXXXXX","price":"29.99","bsr":"15234","rating":"4.5","reviews":"1234","image_url":"https://m.media-amazon.com/...","amazon_url":"https://www.amazon.com/dp/ASIN","supplier_url":"https://www.aliexpress.com/w/wholesale-name.html","supplier_price":"12.50"}]

Requirements: Real products, valid ASINs, realistic prices, AliExpress suppliers`;

  const response = await fetch(PERPLEXITY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [
        { role: 'system', content: 'You are an Amazon FBA researcher. Return only valid JSON arrays.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 4000
    })
  });

  if (!response.ok) throw new Error('API error');

  const data = await response.json();
  let content = data.choices[0].message.content.trim();
  content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (jsonMatch) content = jsonMatch[0];

  try {
    return JSON.parse(content);
  } catch {
    return generateFallback(8);
  }
}

// ============================================================================
// VALIDATION
// ============================================================================
function validateProducts(products) {
  return products.map(p => ({
    title: p.title || 'Product',
    asin: (p.asin && p.asin.length === 10) ? p.asin : 'B0XXXXXXXX',
    price: validatePrice(p.price),
    supplier_price: validatePrice(p.supplier_price),
    bsr: p.bsr || '50000',
    rating: p.rating || '4.5',
    reviews: p.reviews || '500',
    image_url: p.image_url || 'https://m.media-amazon.com/images/I/placeholder.jpg',
    amazon_url: p.amazon_url || `https://www.amazon.com/dp/${p.asin}`,
    supplier_url: p.supplier_url || `https://www.aliexpress.com/w/wholesale-${(p.title || 'product').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-')}.html?sortType=total_tranpro_desc`
  })).filter(p => p.title && p.asin);
}

function validatePrice(price) {
  const num = parseFloat(price);
  if (isNaN(num) || num < 0 || num > 10000) return '19.99';
  return num.toFixed(2);
}

// ============================================================================
// FALLBACK
// ============================================================================
function generateFallback(count) {
  const categories = ['Fitness', 'Tech', 'Kitchen', 'Pet', 'Office', 'Outdoor', 'Beauty', 'Gaming'];
  return Array(count).fill(0).map((_, i) => {
    const basePrice = 15 + Math.random() * 35;
    const cat = categories[i % categories.length];
    return {
      title: `Premium ${cat} Bundle - Professional Quality`,
      asin: `B0${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      price: basePrice.toFixed(2),
      supplier_price: (basePrice * 0.4).toFixed(2),
      bsr: Math.floor(10000 + Math.random() * 40000).toString(),
      rating: (4.0 + Math.random()).toFixed(1),
      reviews: Math.floor(500 + Math.random() * 2000).toString(),
      image_url: 'https://m.media-amazon.com/images/I/placeholder.jpg',
      amazon_url: `https://www.amazon.com/dp/B0PLACEHOLDER${i}`,
      supplier_url: `https://www.aliexpress.com/w/wholesale-${cat.toLowerCase()}.html?sortType=total_tranpro_desc`
    };
  });
}
