// ARK V5.0 - Perplexity API Route
// Features: Perplexity API with web search, Supabase caching, 3x cheaper than Anthropic

import { NextResponse } from 'next/server';

// Lazy load Supabase to avoid build issues
let supabaseInstance = null;

function getSupabase() {
  if (!supabaseInstance && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    const { createClient } = require('@supabase/supabase-js');
    supabaseInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }
  return supabaseInstance;
}

// Simple hash function for cache keys
function hashQuery(query, category) {
  return `${category}_${query}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

export async function POST(request) {
  try {
    const { prompt, category, searchQuery } = await request.json();
    const startTime = Date.now();
    const cacheKey = hashQuery(searchQuery || 'default', category || 'general');
    const db = getSupabase();

    // ==========================================
    // STEP 1: CHECK CACHE (FREE & INSTANT!)
    // ==========================================
    if (db) {
      console.log('🔍 Checking cache for:', cacheKey);
      
      const { data: cachedResult, error: cacheError } = await db
        .from('product_cache')
        .select('*')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (cachedResult && !cacheError) {
        console.log('✅ Cache HIT! Returning cached data (FREE, instant)');
        
        // Update search count
        await db
          .from('product_cache')
          .update({ search_count: cachedResult.search_count + 1 })
          .eq('id', cachedResult.id);

        return NextResponse.json({
          success: true,
          data: cachedResult.products_data,
          cached: true,
          cacheAge: Math.floor((Date.now() - new Date(cachedResult.created_at).getTime()) / 1000 / 60),
          responseTime: Date.now() - startTime
        });
      }
    }

    console.log('❌ Cache MISS. Calling Perplexity API with web search...');

    // ==========================================
    // STEP 2: CALL PERPLEXITY API (WITH WEB SEARCH!)
    // ==========================================
    
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online', // Has web search!
        messages: [
          {
            role: 'system',
            content: 'You are a product research AI for Amazon FBA sellers. Search the web for current trending products and return ONLY valid JSON arrays. No markdown, no explanations, just the JSON array.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 0.9,
        search_domain_filter: ['amazon.com', 'tiktok.com', 'instagram.com'],
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month', // Only recent results
        stream: false
      })
    });

    if (!perplexityResponse.ok) {
      const errorData = await perplexityResponse.json().catch(() => ({}));
      console.error('Perplexity API Error:', {
        status: perplexityResponse.status,
        statusText: perplexityResponse.statusText,
        error: errorData
      });
      throw new Error(`Perplexity API error: ${perplexityResponse.status} - ${errorData.error?.message || perplexityResponse.statusText}`);
    }

    const perplexityData = await perplexityResponse.json();
    let responseText = perplexityData.choices[0]?.message?.content || '[]';

    // Clean response (remove markdown if present)
    responseText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    console.log('✅ Perplexity API response received with web search results');

    // ==========================================
    // STEP 3: SAVE TO CACHE
    // ==========================================
    
    if (db) {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await db
        .from('product_cache')
        .insert({
          cache_key: cacheKey,
          search_query: searchQuery || 'default',
          category: category || 'general',
          products_data: responseText,
          expires_at: expiresAt.toISOString(),
          search_count: 1
        });

      console.log('💾 Cached for 24 hours');
    }

    return NextResponse.json({
      success: true,
      data: responseText,
      cached: false,
      apiCost: 0.001, // Approximate cost per search
      responseTime: Date.now() - startTime,
      searchEnabled: true
    });

  } catch (error) {
    console.error('❌ API Error:', error);

    let errorMessage = 'Search failed. Please try again.';
    let errorType = 'unknown';

    if (error.message.includes('Perplexity')) {
      errorMessage = 'AI service temporarily unavailable. Try again in a moment.';
      errorType = 'api_error';
    } else if (error.message.includes('rate limit')) {
      errorMessage = 'Too many searches. Please wait 30 seconds.';
      errorType = 'rate_limit';
    }

    return NextResponse.json(
      {
        error: errorMessage,
        type: errorType,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Save user bundle
export async function PUT(request) {
  try {
    const { userId, bundleName, products } = await request.json();
    const db = getSupabase();
    
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { data, error } = await db
      .from('user_bundles')
      .insert({
        user_id: userId,
        bundle_name: bundleName,
        products: products
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, bundle: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save bundle', details: error.message },
      { status: 500 }
    );
  }
}

// Get user data
export async function GET(request) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const db = getSupabase();
    
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { data: bundles } = await db
      .from('user_bundles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const { data: saved } = await db
      .from('user_saved')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      success: true,
      bundles: bundles || [],
      saved: saved || []
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load user data', details: error.message },
      { status: 500 }
    );
  }
}
