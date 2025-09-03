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

export async function generateAdCreative(prompt: string, businessType: string, userContent?: any) {
  // Check if OpenAI client is available
  if (!openai) {
    console.warn('🔄 OpenAI not configured, using fallback content')
    // Use user content if available, otherwise fallback to business type
    const userHeadline = userContent?.headline || `${businessType} Ultimate Experience`
    const userDescription = userContent?.description || 'Discover something extraordinary today!'
    const userCta = userContent?.cta || 'Experience Now'
    
    return {
      headline: userHeadline,
      description: userDescription,
      cta: userCta,
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
          content: `You are a creative advertising genius specializing in eye-catching outdoor advertising for taxi-top digital billboards. 

Your job is to analyze the user's existing content and enhance it with creative suggestions that build upon what they've already written. Focus on:

1. Understanding the user's specific business/offer from their content
2. Enhancing their headline while keeping their core message
3. Expanding their description with more compelling language
4. Suggesting a CTA that matches their specific offer
5. Creating a logo concept that fits their actual business/offer
6. Recommending animations that complement their content
7. Suggesting colors that match their brand/offer
8. Adding visual elements that enhance their specific message

Always build upon what the user has written rather than replacing it with generic content. Make suggestions that are relevant to their specific business, offer, or product.`
        },
        {
          role: "user",
          content: `${prompt}

Return your response in this exact JSON format:
{
  "headline": "Enhanced headline based on user's input",
  "description": "Improved description building on user's content",
  "cta": "Better CTA that matches their offer",
  "logoConcept": "Logo concept that fits their specific business/offer",
  "animationSuggestion": "Animation that complements their content",
  "colorScheme": "Colors that match their brand/offer",
  "visualElements": "Visual elements that enhance their message"
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
    // Use user content if available, otherwise fallback to business type
    const userHeadline = userContent?.headline || `${businessType} Ultimate Experience`
    const userDescription = userContent?.description || 'Discover something extraordinary today!'
    const userCta = userContent?.cta || 'Experience Now'
    
    return {
      headline: userHeadline,
      description: userDescription,
      cta: userCta,
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
