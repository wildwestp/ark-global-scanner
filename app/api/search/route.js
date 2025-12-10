// ARK V5.1 - Correct Model (Version 3)
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    console.log('🔍 ARK V3: Testing with correct model...');

    if (!process.env.PERPLEXITY_API_KEY) {
      return NextResponse.json(
        { error: 'API key missing' },
        { status: 500 }
      );
    }

    const cleanKey = process.env.PERPLEXITY_API_KEY.trim();

    // Use the correct free tier model name
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',  // Free tier model
        messages: [
          {
            role: 'system',
            content: 'You are a product research AI. Return ONLY valid JSON arrays with no markdown or explanations.'
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
    console.log('📝 Response preview:', responseText.substring(0, 300));

    if (!response.ok) {
      console.error('❌ Error:', responseText);
      return NextResponse.json(
        {
          error: `Perplexity Error (${response.status})`,
          details: responseText,
          model: 'llama-3.1-sonar-small-128k-online'
        },
        { status: 500 }
      );
    }

    const data = JSON.parse(responseText);
    let content = data.choices[0]?.message?.content || '[]';
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    console.log('✅ Success with small model!');

    return NextResponse.json({
      success: true,
      data: content,
      cached: false,
      model: 'llama-3.1-sonar-small-128k-online',
      version: 3
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
