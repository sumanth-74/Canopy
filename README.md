# Canopy - AI-Powered Outdoor Advertising Platform

Canopy is the world's first self-serve outdoor advertising platform, making taxi-top digital billboard advertising as easy as Google Ads. Built with Next.js 14, TypeScript, and modern web technologies.

## 🚀 Features

- **AI-Powered Ad Creation**: Generate compelling ad copy with OpenAI integration
- **Smart Targeting**: Target customers around your store, near competitors, or on high-traffic routes
- **Real-Time Analytics**: Live tracking of impressions, reach, and demographic insights
- **Interactive Maps**: Mapbox integration for visual campaign planning
- **Secure Payments**: Stripe integration for seamless payment processing
- **User Authentication**: NextAuth.js with multiple provider support
- **Responsive Design**: Beautiful orange and white theme with smooth animations

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** & **React Spring** for animations
- **Shadcn/ui** components
- **Mapbox GL JS** for interactive maps

### Backend
- **Next.js API Routes**
- **Prisma** ORM with PostgreSQL
- **NextAuth.js** for authentication
- **Stripe** for payments
- **OpenAI API** for AI features

### Database
- **PostgreSQL** with Prisma schema
- User management and authentication
- Campaign and analytics data
- Screen inventory management

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account
- OpenAI API key
- Mapbox access token
- Google OAuth credentials (optional)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd canopy
npm install
```

### 2. Environment Setup

Copy the environment template and fill in your credentials:

```bash
cp env.example .env
```

Update `.env` with your actual values:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/canopy?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Mapbox
MAPBOX_ACCESS_TOKEN="your-mapbox-access-token"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3001` to see the application.

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with the following main entities:

- **Users**: Authentication and profile data
- **Campaigns**: Campaign details, targeting, and creative assets
- **Payments**: Stripe payment tracking
- **Screens**: Available taxi-top screens with locations
- **Analytics**: Performance metrics and insights
- **CampaignScreens**: Many-to-many relationship for screen assignments

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `GET /api/auth/session` - Get current session

### Campaigns
- `GET /api/campaigns` - List user campaigns
- `POST /api/campaigns` - Create new campaign
- `GET /api/campaigns/[id]` - Get campaign details
- `PUT /api/campaigns/[id]` - Update campaign
- `DELETE /api/campaigns/[id]` - Delete campaign

### AI Features
- `POST /api/ai/generate-creative` - Generate ad copy with AI

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Screens
- `GET /api/screens` - Get available screens (with location filtering)

## 🎨 Design System

The application uses a custom orange and white design system with:

- **Color Palette**: Orange gradients (orange-50 to orange-950)
- **Components**: Custom `canopy-*` CSS classes
- **Animations**: Smooth transitions with Framer Motion
- **Typography**: Clear hierarchy with proper contrast
- **Responsive**: Mobile-first design approach

## 🔐 Authentication

NextAuth.js provides multiple authentication methods:

- **Credentials**: Email/password authentication
- **Google OAuth**: Social login (optional)
- **Session Management**: JWT-based sessions
- **Protected Routes**: Automatic route protection

## 💳 Payment Processing

Stripe integration handles:

- **Payment Intents**: Secure payment processing
- **Webhooks**: Real-time payment status updates
- **Campaign Activation**: Automatic campaign launch on successful payment
- **Multiple Methods**: Credit cards, PayPal, direct debit

## 🤖 AI Integration

OpenAI API powers:

- **Ad Copy Generation**: AI-generated headlines, descriptions, and CTAs
- **Campaign Optimization**: Smart targeting recommendations
- **Content Suggestions**: Industry-specific ad variations
- **Performance Insights**: AI-powered analytics interpretation

## 🗺️ Map Integration

Mapbox provides:

- **Interactive Maps**: Visual campaign planning
- **Location Search**: Geocoding and address lookup
- **Screen Visualization**: Show available screens on map
- **Radius Targeting**: Visual targeting area selection

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Enhanced tablet experience
- **Desktop**: Full-featured desktop interface
- **Touch-Friendly**: Optimized touch interactions

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform supporting Next.js:

- **Netlify**: Static site generation
- **Railway**: Full-stack deployment
- **DigitalOcean**: App Platform
- **AWS**: Amplify or EC2

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
```

### Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── campaign/       # Campaign management
│   └── globals.css     # Global styles
├── components/         # React components
│   └── ui/            # Reusable UI components
├── lib/               # Utility libraries
│   ├── auth.ts        # NextAuth configuration
│   ├── prisma.ts      # Prisma client
│   ├── stripe.ts      # Stripe configuration
│   └── openai.ts      # OpenAI integration
└── types/             # TypeScript type definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation
- Review the API endpoints

## 🔮 Roadmap

- [ ] Advanced analytics dashboard
- [ ] A/B testing for campaigns
- [ ] Real-time screen availability
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced targeting options
- [ ] Campaign templates
- [ ] Bulk campaign management

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.