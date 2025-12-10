import { NextResponse } from 'next/server';

let supabase = null;

function getSupabase() {
  if (!supabase && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }
  return supabase;
}

function hashQuery(query, category) {
  return `${category}_${query}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

export async function POST(request) {
  try {
    const { prompt, category, searchQuery } = await request.json();
    const startTime = Date.now();
    const cacheKey = hashQuery(searchQuery || 'default', category || 'general');
    const db = getSupabase();

    console.log('🔍 Search:', cacheKey);

    if (db) {
      const { data: cached, error: cacheError } = await db
        .from('product_cache')
        .select('*')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (cached && !cacheError) {
        console.log('✅ Cache HIT');
        await db
          .from('product_cache')
          .update({ search_count: cached.search_count + 1 })
          .eq('id', cached.id);

        return NextResponse.json({
          success: true,
          data: cached.products_data,
          cached: true,
          responseTime: Date.now() - startTime
        });
      }
    }

    console.log('❌ Cache MISS - Calling Perplexity...');

    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a product research AI. Return ONLY valid JSON arrays. No markdown, no explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 0.9,
        search_domain_filter: ['amazon.com', 'tiktok.com'],
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        stream: false
      })
    });

    if (!perplexityResponse.ok) {
      const errorData = await perplexityResponse.json().catch(() => ({}));
      console.error('❌ Perplexity Error:', perplexityResponse.status, errorData);
      
      return NextResponse.json(
        {
          error: `Perplexity API error (${perplexityResponse.status}): ${errorData.error?.message || 'Check API key'}`,
          type: 'api_error'
        },
        { status: 500 }
      );
    }

    const perplexityData = await perplexityResponse.json();
    let responseText = perplexityData.choices[0]?.message?.content || '[]';

    responseText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    console.log('✅ Perplexity success');

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

      console.log('💾 Cached');
    }

    return NextResponse.json({
      success: true,
      data: responseText,
      cached: false,
      apiCost: 0.001,
      responseTime: Date.now() - startTime,
      searchEnabled: true
    });

  } catch (error) {
    console.error('❌ Error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Search failed',
        type: 'unknown',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

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
