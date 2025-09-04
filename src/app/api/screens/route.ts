import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const radius = searchParams.get('radius') || '5'

    let whereClause: any = {
      status: 'ACTIVE'
    }

    // If coordinates provided, filter by radius
    if (lat && lng) {
      const latitude = parseFloat(lat)
      const longitude = parseFloat(lng)
      const radiusKm = parseFloat(radius)

      // Simple bounding box filter (for demo purposes)
      // In production, you'd use PostGIS for proper geographic queries
      const latRange = radiusKm / 111 // Rough conversion: 1 degree ≈ 111 km
      const lngRange = radiusKm / (111 * Math.cos(latitude * Math.PI / 180))

      whereClause = {
        ...whereClause,
        latitude: {
          gte: latitude - latRange,
          lte: latitude + latRange
        },
        longitude: {
          gte: longitude - lngRange,
          lte: longitude + lngRange
        }
      }
    }

    const screens = await prisma.screen.findMany({
      where: whereClause,
      include: {
        campaigns: {
          where: {
            endDate: {
              gte: new Date()
            }
          },
          include: {
            campaign: true
          }
        }
      }
    })

    // Filter out screens that are fully booked
    const availableScreens = screens.filter((screen:any) => 
      screen.campaigns.length < 3 // Max 3 campaigns per screen
    )

    return NextResponse.json(availableScreens)
  } catch (error) {
    console.error('Error fetching screens:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
