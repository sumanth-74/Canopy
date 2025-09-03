import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const campaign = await prisma.campaign.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        payments: true,
        analytics: {
          orderBy: {
            date: 'desc'
          }
        },
        screens: {
          include: {
            screen: true
          }
        }
      }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Parse JSON strings back to objects for frontend consumption
    const parsedCampaign = {
      ...campaign,
      creative: campaign.creative ? JSON.parse(campaign.creative as string) : {},
      targetAudience: campaign.targetAudience ? JSON.parse(campaign.targetAudience as string) : {}
    }

    return NextResponse.json(parsedCampaign)
  } catch (error) {
    console.error('Error fetching campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, budget, targetLocation, targetRadius, creative, targetAudience, status } = body

    const campaign = await prisma.campaign.updateMany({
      where: {
        id: params.id,
        userId: session.user.id
      },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(budget && { budget: parseFloat(budget) }),
        ...(targetLocation && { targetLocation }),
        ...(targetRadius && { targetRadius: parseFloat(targetRadius) }),
        ...(creative && { creative: JSON.stringify(creative) }),
        ...(targetAudience && { targetAudience: JSON.stringify(targetAudience) }),
        ...(status && { status }),
        updatedAt: new Date()
      }
    })

    if (campaign.count === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const campaign = await prisma.campaign.deleteMany({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (campaign.count === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
