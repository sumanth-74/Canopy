# Canopy - Complete Setup Guide

## Overview
Canopy is a fully functional AI-powered outdoor advertising platform built with Next.js 14, featuring real database integration, authentication, payments, AI, and interactive maps.

## Prerequisites
- Node.js 18+ 
- PostgreSQL database
- API keys for external services

## Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/canopy"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="pk.eyJ1..."
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 3. Start Development Server
```bash
npm run dev
```

## Features Implemented

### ✅ Backend Infrastructure
- **Database**: Prisma + PostgreSQL with full schema
- **Authentication**: NextAuth.js with Google OAuth and credentials
- **Payments**: Stripe integration with webhooks
- **AI**: OpenAI API for ad creative generation
- **Maps**: Mapbox GL JS for interactive targeting

### ✅ Frontend Features
- **Landing Page**: Beautiful orange/white themed homepage
- **Authentication**: Sign in/up pages with Google OAuth
- **Campaign Creation**: 5-step wizard with real API integration
- **Interactive Maps**: Mapbox integration for location targeting
- **AI Ad Studio**: Real AI-powered creative generation
- **Dashboard**: Campaign management and analytics

### ✅ API Routes
- `/api/auth/[...nextauth]` - Authentication
- `/api/campaigns` - Campaign CRUD operations
- `/api/ai/generate-creative` - AI creative generation
- `/api/payments/create-intent` - Stripe payment intents
- `/api/webhooks/stripe` - Payment webhooks
- `/api/screens` - Available screen locations

## Application Flow

### 1. Authentication
- Users can sign up/sign in with email/password or Google OAuth
- Session management with NextAuth.js
- Protected routes for authenticated users

### 2. Campaign Creation
- **Step 1**: Campaign setup (budget, business type, location)
- **Step 2**: AI ad creation with real OpenAI integration
- **Step 3**: Interactive targeting with Mapbox maps
- **Step 4**: Campaign review and summary
- **Step 5**: Payment processing with Stripe

### 3. Dashboard
- View active campaigns
- Real-time analytics (simulated)
- Campaign management
- User profile management

## Database Schema

### Users
- Authentication data (NextAuth.js compatible)
- Profile information
- Business details

### Campaigns
- Campaign metadata
- Targeting parameters
- Creative assets
- Budget and status

### Payments
- Stripe payment intents
- Transaction history
- Campaign associations

### Screens
- Available taxi-top screen locations
- Geographic coordinates
- Availability status

## API Integration

### OpenAI
- Generates compelling ad copy
- Tailored for outdoor advertising
- Business type-specific suggestions

### Stripe
- Secure payment processing
- Webhook handling for payment events
- Campaign activation on successful payment

### Mapbox
- Interactive map display
- Location search and selection
- Radius targeting visualization
- Available screen markers

## Development Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
```

## Production Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Environment Variables for Production
- Update `NEXTAUTH_URL` to your production domain
- Use production Stripe keys
- Use production database URL
- Set secure `NEXTAUTH_SECRET`

## Testing the Application

### 1. Authentication Flow
- Visit `/auth/signup` to create an account
- Or use Google OAuth for quick sign-in
- Verify session persistence

### 2. Campaign Creation
- Navigate to `/campaign/new`
- Complete all 5 steps
- Test AI creative generation
- Test map interaction
- Test payment flow (use Stripe test cards)

### 3. Dashboard
- View created campaigns
- Check analytics display
- Test campaign management

## Troubleshooting

### Common Issues

1. **Database Connection**
   - Verify PostgreSQL is running
   - Check DATABASE_URL format
   - Run `npm run db:push` to sync schema

2. **Authentication Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain
   - Ensure Google OAuth credentials are correct

3. **Mapbox Not Loading**
   - Verify MAPBOX_ACCESS_TOKEN is set
   - Check token permissions
   - Ensure token is public (NEXT_PUBLIC_)

4. **Stripe Payments**
   - Use test mode keys
   - Check webhook endpoint configuration
   - Verify webhook secret

## Next Steps

The application is now fully functional with:
- ✅ Real database integration
- ✅ Complete authentication system
- ✅ Payment processing
- ✅ AI-powered features
- ✅ Interactive maps
- ✅ Production-ready architecture

You can now:
1. Deploy to production
2. Add more AI features
3. Implement real-time analytics
4. Add more payment methods
5. Expand targeting options
6. Add campaign optimization features

## Support

For issues or questions:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check database connectivity
5. Review API key permissions
