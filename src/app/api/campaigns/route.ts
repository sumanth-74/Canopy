import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const campaigns = await prisma.campaign.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        payments: true,
        analytics: {
          orderBy: {
            date: 'desc'
          },
          take: 30
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Parse JSON strings back to objects for frontend consumption
    const parsedCampaigns = campaigns.map(campaign => ({
      ...campaign,
      creative: campaign.creative ? JSON.parse(campaign.creative as string) : {},
      targetAudience: campaign.targetAudience ? JSON.parse(campaign.targetAudience as string) : {}
    }))

    return NextResponse.json(parsedCampaigns)
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, budget, targetLocation, targetRadius, creative, targetAudience } = body

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        budget: parseFloat(budget),
        targetLocation,
        targetRadius: parseFloat(targetRadius),
        creative: JSON.stringify(creative || {}),
        targetAudience: JSON.stringify(targetAudience || {}),
        userId: session.user.id,
        status: 'DRAFT'
      }
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
