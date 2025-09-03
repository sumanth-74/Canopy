import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateAdCreative(prompt: string, businessType: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert advertising copywriter specializing in outdoor advertising for taxi-top digital billboards. Create compelling, concise ad copy that works well for outdoor advertising. Keep headlines under 8 words and descriptions under 20 words. Focus on clear calls-to-action and memorable messaging.`
        },
        {
          role: "user",
          content: `Create ad copy for a ${businessType} business. Requirements: ${prompt}. Generate a headline, description, and call-to-action.`
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) throw new Error('No response from OpenAI')

    // Parse the response to extract headline, description, and CTA
    const lines = response.split('\n').filter(line => line.trim())
    const headline = lines.find(line => line.toLowerCase().includes('headline'))?.split(':')[1]?.trim() || lines[0]?.trim()
    const description = lines.find(line => line.toLowerCase().includes('description'))?.split(':')[1]?.trim() || lines[1]?.trim()
    const cta = lines.find(line => line.toLowerCase().includes('cta') || line.toLowerCase().includes('call to action'))?.split(':')[1]?.trim() || lines[2]?.trim()

    return {
      headline: headline || 'Amazing Offer!',
      description: description || 'Visit us today for great deals!',
      cta: cta || 'Visit Now'
    }
  } catch (error) {
    console.error('Error generating ad creative:', error)
    return {
      headline: `${businessType} Special Offer`,
      description: 'Visit us today for amazing deals and great service!',
      cta: 'Visit Now'
    }
  }
}

export async function generateCampaignInsights(campaignData: any) {
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
