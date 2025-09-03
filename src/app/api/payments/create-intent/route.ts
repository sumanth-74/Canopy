import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe, formatAmountForStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { campaignId, amount, currency = 'GBP' } = body

    if (!campaignId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify campaign belongs to user
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        userId: session.user.id
      }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        currency,
        status: 'PENDING',
        paymentMethod: 'card',
        userId: session.user.id,
        campaignId
      }
    })

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(parseFloat(amount), currency),
      currency: currency.toLowerCase(),
      metadata: {
        paymentId: payment.id,
        campaignId,
        userId: session.user.id
      }
    })

    // Update payment with Stripe ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { stripePaymentId: paymentIntent.id }
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
