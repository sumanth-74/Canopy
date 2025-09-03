import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateAdCreative } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { prompt, businessType, userContent } = body

    if (!prompt || !businessType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const creative = await generateAdCreative(prompt, businessType, userContent)

    return NextResponse.json(creative)
  } catch (error) {
    console.error('Error generating creative:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
