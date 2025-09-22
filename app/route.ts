import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_CONTEXT = `You are an expert homiletics consultant with deep knowledge of sermon analysis, biblical hermeneutics, and preaching effectiveness. You provide constructive, encouraging feedback to help preachers improve their craft.

BACKGROUND KNOWLEDGE:
- Classical sermon structure: Introduction, Main Points (usually 2-4), Illustration/Application, Conclusion
- Key elements: Clear thesis, biblical foundation, practical application, engaging delivery
- Common sermon types: Expository, Topical, Textual, Narrative
- Evaluation criteria: Biblical accuracy, clarity of message, practical relevance, rhetorical effectiveness
- Cultural sensitivity and pastoral care considerations

ANALYSIS FRAMEWORK:
1. Biblical Foundation - How well grounded in Scripture
2. Structure & Flow - Logical organization and transitions  
3. Clarity of Message - Main point and supporting arguments
4. Practical Application - Real-world relevance and actionability
5. Engagement - Use of illustrations, stories, rhetorical devices
6. Pastoral Sensitivity - Tone, empathy, cultural awareness`;

const ANALYSIS_PROMPT = `Please analyze the following sermon text and provide constructive feedback. Focus on:

1. **Biblical Foundation**: How well does the sermon engage with and interpret the biblical text?
2. **Structure & Clarity**: Is the main message clear? How effective is the organization?
3. **Practical Application**: How well does it connect biblical truth to daily life?
4. **Engagement**: What works well for keeping the audience engaged?
5. **Areas for Growth**: What specific suggestions do you have for improvement?

Be encouraging while providing specific, actionable feedback. Assume this is from a sincere preacher seeking to improve their craft.

SERMON TEXT TO ANALYZE:
`;

export async function POST(request: NextRequest) {
  try {
    const { sermonText } = await request.json();
    
    if (!sermonText) {
      return NextResponse.json(
        { error: 'Sermon text is required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: SYSTEM_CONTEXT + '\n\n' + ANALYSIS_PROMPT + sermonText
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.content[0].text;

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error in sermon analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze sermon' },
      { status: 500 }
    );
  }
}