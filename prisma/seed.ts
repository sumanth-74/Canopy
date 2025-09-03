import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample screens
  const screens = await Promise.all([
    prisma.screen.create({
      data: {
        name: 'Oxford Street Screen 1',
        location: 'Oxford Street, London',
        latitude: 51.5154,
        longitude: -0.1419,
        width: 1920,
        height: 1080,
        resolution: '1920x1080',
        status: 'ACTIVE'
      }
    }),
    prisma.screen.create({
      data: {
        name: 'Regent Street Screen 2',
        location: 'Regent Street, London',
        latitude: 51.5094,
        longitude: -0.1406,
        width: 1920,
        height: 1080,
        resolution: '1920x1080',
        status: 'ACTIVE'
      }
    }),
    prisma.screen.create({
      data: {
        name: 'Covent Garden Screen 3',
        location: 'Covent Garden, London',
        latitude: 51.5118,
        longitude: -0.1234,
        width: 1920,
        height: 1080,
        resolution: '1920x1080',
        status: 'ACTIVE'
      }
    }),
    prisma.screen.create({
      data: {
        name: 'Leicester Square Screen 4',
        location: 'Leicester Square, London',
        latitude: 51.5103,
        longitude: -0.1337,
        width: 1920,
        height: 1080,
        resolution: '1920x1080',
        status: 'ACTIVE'
      }
    }),
    prisma.screen.create({
      data: {
        name: 'Piccadilly Circus Screen 5',
        location: 'Piccadilly Circus, London',
        latitude: 51.5098,
        longitude: -0.1342,
        width: 1920,
        height: 1080,
        resolution: '1920x1080',
        status: 'ACTIVE'
      }
    })
  ])

  console.log('Created screens:', screens.length)

  // Create or get demo user
  let demoUser = await prisma.user.findUnique({
    where: { email: 'demo@canopy.com' }
  })

  if (!demoUser) {
    // Hash password for demo user
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash('demo123', 12)
    
    demoUser = await prisma.user.create({
      data: {
        email: 'demo@canopy.com',
        name: 'Demo User',
        password: hashedPassword,
        businessName: 'Demo Restaurant',
        businessType: 'Restaurant & Food',
        phone: '+44 20 7123 4567',
        address: '123 Demo Street',
        city: 'London',
        country: 'UK'
      }
    })
  }

  console.log('Created demo user:', demoUser.email)

  // Create a sample campaign (if it doesn't exist)
  let campaign = await prisma.campaign.findFirst({
    where: { name: 'Summer Sale Campaign' }
  })

  if (!campaign) {
    campaign = await prisma.campaign.create({
    data: {
      name: 'Summer Sale Campaign',
      description: 'Promoting summer menu items',
      budget: 500,
      spent: 0,
      targetLocation: 'Central London',
      targetRadius: 2.5,
      creative: JSON.stringify({
        headline: 'Summer Special!',
        description: 'Fresh seasonal dishes',
        cta: 'Visit Now',
        colors: {
          primary: '#f97316',
          secondary: '#ffffff'
        }
      }),
      targetAudience: JSON.stringify({
        ageRange: '25-45',
        interests: ['food', 'dining'],
        timeOfDay: 'lunch'
      }),
      userId: demoUser.id,
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
    })
    console.log('Created sample campaign:', campaign.name)
  } else {
    console.log('Sample campaign already exists:', campaign.name)
  }

  // Assign screens to campaign
  await Promise.all(
    screens.slice(0, 3).map(screen =>
      prisma.campaignScreen.create({
        data: {
          campaignId: campaign.id,
          screenId: screen.id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      })
    )
  )

  console.log('Assigned screens to campaign')

  // Create sample analytics data
  const analyticsData = []
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    analyticsData.push({
      campaignId: campaign.id,
      date,
      impressions: Math.floor(Math.random() * 1000) + 500,
      reach: Math.floor(Math.random() * 300) + 200,
      clicks: Math.floor(Math.random() * 50) + 10,
      conversions: Math.floor(Math.random() * 10) + 2,
      spend: Math.floor(Math.random() * 50) + 20
    })
  }

  await prisma.analytics.createMany({
    data: analyticsData
  })

  console.log('Created analytics data')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
