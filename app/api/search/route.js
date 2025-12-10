// ARK V5.1 - WORKING MODEL (Version 4)
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    console.log('🔍 ARK V4: Using correct 2024 model name...');

    if (!process.env.PERPLEXITY_API_KEY) {
      return NextResponse.json(
        { error: 'API key missing' },
        { status: 500 }
      );
    }

    const cleanKey = process.env.PERPLEXITY_API_KEY.trim();

    // CORRECT MODEL NAME (as of Dec 2024)
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar',  // Simple, correct model name
        messages: [
          {
            role: 'system',
            content: 'You are a product research AI. Return ONLY valid JSON arrays with no markdown.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const responseText = await response.text();
    console.log('📊 Status:', response.status);
    console.log('📝 Response:', responseText.substring(0, 300));

    if (!response.ok) {
      console.error('❌ Error:', responseText);
      return NextResponse.json(
        {
          error: `Perplexity Error (${response.status})`,
          details: responseText,
          model: 'sonar'
        },
        { status: 500 }
      );
    }

    const data = JSON.parse(responseText);
    let content = data.choices[0]?.message?.content || '[]';
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    console.log('✅ SUCCESS with sonar model!');

    return NextResponse.json({
      success: true,
      data: content,
      cached: false,
      model: 'sonar',
      searchEnabled: true,
      version: 4
    });

  } catch (error) {
    console.error('❌ Exception:', error);
    return NextResponse.json(
      {
        error: error.message,
        type: 'exception'
      },
      { status: 500 }
    );
  }
}
