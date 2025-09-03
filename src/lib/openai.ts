import OpenAI from 'openai'

// Initialize OpenAI client with error handling
let openai: OpenAI | null = null

try {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === 'sk-your-openai-api-key-here' || apiKey === 'your-openai-api-key') {
    console.warn('⚠️ OpenAI API key not configured. AI features will use fallback content.')
    console.warn('To enable AI features, set OPENAI_API_KEY in your .env.local file')
    openai = null
  } else {
    openai = new OpenAI({
      apiKey: apiKey,
    })
  }
} catch (error) {
  console.error('❌ Error initializing OpenAI client:', error)
  openai = null
}

export { openai }

export async function generateAdCreative(prompt: string, businessType: string) {
  // Check if OpenAI client is available
  if (!openai) {
    console.warn('🔄 OpenAI not configured, using fallback content')
    return {
      headline: `${businessType} Ultimate Experience`,
      description: 'Discover something extraordinary today!',
      cta: 'Experience Now',
      logoConcept: `${businessType} themed logo with modern, clean design`,
      animationSuggestion: 'Smooth fade transitions with subtle animations',
      colorScheme: 'Orange and white with complementary accents',
      visualElements: 'Professional imagery with motion graphics and effects'
    }
  }

  try {
    // Additional safety check
    if (!openai) {
      throw new Error('OpenAI client not initialized')
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a creative advertising genius specializing in eye-catching outdoor advertising for taxi-top digital billboards. Create compelling, professional ad content that includes:

1. A powerful headline (5-8 words max)
2. An engaging description (15-20 words max)
3. A strong call-to-action
4. A suggested logo concept (describe what the logo should look like)
5. Animation suggestions (how the ad should move/animate)
6. Color scheme recommendations
7. Visual elements that would make it stand out

Make it creative, memorable, and optimized for quick viewing on moving taxi-tops. Use emotional triggers, urgency, exclusivity, or social proof where appropriate.`
        },
        {
          role: "user",
          content: `Create a complete, creative ad concept for a ${businessType} business. Requirements: ${prompt}.

Return your response in this exact JSON format:
{
  "headline": "Your catchy headline here",
  "description": "Your engaging description here",
  "cta": "Your compelling call-to-action",
  "logoConcept": "Describe the logo design concept",
  "animationSuggestion": "How the ad should animate",
  "colorScheme": "Primary and secondary colors",
  "visualElements": "Additional visual elements"
}`
        }
      ],
      max_tokens: 300,
      temperature: 0.8,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) throw new Error('No response from OpenAI')

    // Try to parse as JSON first
    try {
      const parsedResponse = JSON.parse(response)
      return {
        headline: parsedResponse.headline || 'Amazing Offer!',
        description: parsedResponse.description || 'Visit us today!',
        cta: parsedResponse.cta || 'Visit Now',
        logoConcept: parsedResponse.logoConcept || `${businessType} themed logo`,
        animationSuggestion: parsedResponse.animationSuggestion || 'Smooth fade transitions',
        colorScheme: parsedResponse.colorScheme || 'Orange and white',
        visualElements: parsedResponse.visualElements || 'Professional imagery'
      }
    } catch (parseError) {
      // Fallback to text parsing if JSON parsing fails
      const lines = response.split('\n').filter(line => line.trim())
      const headline = lines.find(line => line.toLowerCase().includes('headline'))?.split(':')[1]?.trim() ||
                      lines.find(line => line.toLowerCase().includes('"headline"'))?.split(':')[1]?.replace(/"/g, '')?.trim() ||
                      lines[0]?.replace(/"/g, '')?.trim()
      const description = lines.find(line => line.toLowerCase().includes('description'))?.split(':')[1]?.trim() ||
                         lines.find(line => line.toLowerCase().includes('"description"'))?.split(':')[1]?.replace(/"/g, '')?.trim() ||
                         lines[1]?.replace(/"/g, '')?.trim()
      const cta = lines.find(line => line.toLowerCase().includes('cta') || line.toLowerCase().includes('call to action'))?.split(':')[1]?.trim() ||
                  lines.find(line => line.toLowerCase().includes('"cta"'))?.split(':')[1]?.replace(/"/g, '')?.trim() ||
                  lines[2]?.replace(/"/g, '')?.trim()

      return {
        headline: headline || 'Amazing Offer!',
        description: description || 'Visit us today for great deals!',
        cta: cta || 'Visit Now',
        logoConcept: `${businessType} themed logo with modern design`,
        animationSuggestion: 'Smooth slide-in animations with pulsing CTA',
        colorScheme: 'Orange and white with accent colors',
        visualElements: 'Professional imagery with motion graphics'
      }
    }
  } catch (error) {
    console.error('Error generating ad creative:', error)
    return {
      headline: `${businessType} Ultimate Experience`,
      description: 'Discover something extraordinary today!',
      cta: 'Experience Now',
      logoConcept: `${businessType} themed logo with modern, clean design`,
      animationSuggestion: 'Smooth fade transitions with subtle animations',
      colorScheme: 'Orange and white with complementary accents',
      visualElements: 'Professional imagery with motion graphics and effects'
    }
  }
}

export async function generateCampaignInsights(campaignData: any) {
  // Check if OpenAI client is available
  if (!openai) {
    console.warn('🔄 OpenAI not configured for insights, using fallback')
    return 'AI insights not available - OpenAI API key required'
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert digital marketing strategist. Analyze campaign data and provide actionable insights and recommendations for outdoor advertising campaigns.`
        },
        {
          role: "user",
          content: `Analyze this campaign data and provide insights: ${JSON.stringify(campaignData)}`
        }
      ],
      max_tokens: 300,
      temperature: 0.5,
    })

    return completion.choices[0]?.message?.content || 'No insights available'
  } catch (error) {
    console.error('Error generating campaign insights:', error)
    return 'Unable to generate insights at this time'
  }
}
