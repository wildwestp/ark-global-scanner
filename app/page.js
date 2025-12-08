// ARK V5.0 - Optimized Search API Route
// Features: Groq API (150x cheaper), Supabase caching, smart persistence

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Simple hash function for cache keys
function hashQuery(query, category) {
  return `${category}_${query}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

export async function POST(request) {
  try {
    const { prompt, category, searchQuery } = await request.json();
    const startTime = Date.now();

    // Create cache key
    const cacheKey = hashQuery(searchQuery || 'default', category || 'general');

    // ==========================================
    // STEP 1: CHECK CACHE (FREE & INSTANT!)
    // ==========================================
    console.log('🔍 Checking cache for:', cacheKey);
    
    const { data: cachedResult, error: cacheError } = await supabase
      .from('product_cache')
      .select('*')
      .eq('cache_key', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (cachedResult && !cacheError) {
      console.log('✅ Cache HIT! Returning cached data (FREE, instant)');
      
      // Update search count for analytics
      await supabase
        .from('product_cache')
        .update({ search_count: cachedResult.search_count + 1 })
        .eq('id', cachedResult.id);

      return NextResponse.json({
        success: true,
        data: cachedResult.products_data,
        cached: true,
        cacheAge: Math.floor((Date.now() - new Date(cachedResult.created_at).getTime()) / 1000 / 60), // minutes
        responseTime: Date.now() - startTime
      });
    }

    console.log('❌ Cache MISS. Calling Groq API...');

    // ==========================================
    // STEP 2: CALL GROQ API (CHEAP & FAST!)
    // ==========================================
    
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile', // Fast & accurate
        messages: [
          {
            role: 'system',
            content: 'You are a product research AI for Amazon FBA. Return ONLY valid JSON arrays of products. No markdown, no explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        stream: false
      })
    });

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.status} ${groqResponse.statusText}`);
    }

    const groqData = await groqResponse.json();
    let responseText = groqData.choices[0]?.message?.content || '[]';

    // Clean response (remove markdown if present)
    responseText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    console.log('✅ Groq API response received');

    // ==========================================
    // STEP 3: SAVE TO CACHE
    // ==========================================
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Cache for 24 hours

    const { error: saveError } = await supabase
      .from('product_cache')
      .insert({
        cache_key: cacheKey,
        search_query: searchQuery || 'default',
        category: category || 'general',
        products_data: responseText,
        expires_at: expiresAt.toISOString(),
        search_count: 1
      });

    if (saveError) {
      console.error('⚠️ Failed to cache result:', saveError);
      // Continue anyway - search still worked
    } else {
      console.log('💾 Cached for 24 hours');
    }

    // ==========================================
    // STEP 4: RETURN RESPONSE
    // ==========================================

    return NextResponse.json({
      success: true,
      data: responseText,
      cached: false,
      apiCost: 0.0002, // Approximate cost in USD
      responseTime: Date.now() - startTime
    });

  } catch (error) {
    console.error('❌ API Error:', error);

    // Friendly error messages
    let errorMessage = 'Search failed. Please try again.';
    let errorType = 'unknown';

    if (error.message.includes('Groq')) {
      errorMessage = 'AI service temporarily unavailable. Try again in a moment.';
      errorType = 'api_error';
    } else if (error.message.includes('rate limit')) {
      errorMessage = 'Too many searches. Please wait 30 seconds.';
      errorType = 'rate_limit';
    } else if (error.message.includes('Supabase')) {
      errorMessage = 'Database connection issue. Your search will still work!';
      errorType = 'db_warning';
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

// ==========================================
// USER DATA ENDPOINTS
// ==========================================

// Save user bundle
export async function PUT(request) {
  try {
    const { userId, bundleName, products } = await request.json();

    const { data, error } = await supabase
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

// Get user bundles
export async function GET(request) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const { data: bundles, error: bundlesError } = await supabase
      .from('user_bundles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const { data: saved, error: savedError } = await supabase
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
