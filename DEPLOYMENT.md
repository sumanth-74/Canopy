# Canopy Deployment Guide

## Vercel Deployment Checklist

### ✅ **Ready for Deployment**
The application is fully configured for Vercel deployment with the following setup:

### **1. Database Configuration**
- **Current**: SQLite (development)
- **Production**: PostgreSQL (recommended)
- **Schema**: `prisma/schema-postgres.prisma` provided
- **Migration**: Use `prisma db push` or `prisma migrate deploy`

### **2. Environment Variables Required**
Set these in Vercel dashboard under Settings > Environment Variables:

```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:5432/canopy?schema=public"

# NextAuth.js
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

### **3. Vercel Configuration**
- **vercel.json**: Configured with 30s timeout for API routes
- **next.config.js**: Updated with proper image domains and external packages
- **package.json**: Added postbuild script for Prisma generation

### **4. Deployment Steps**

1. **Connect to Vercel**:
   - Import from GitHub
   - Select the repository
   - Vercel will auto-detect Next.js

2. **Set Environment Variables**:
   - Add all required environment variables
   - Ensure `NEXTAUTH_URL` matches your Vercel domain

3. **Database Setup**:
   - Use Vercel Postgres or external PostgreSQL
   - Update `DATABASE_URL` with production connection string
   - Run `prisma db push` to create tables

4. **Deploy**:
   - Vercel will automatically build and deploy
   - Monitor build logs for any issues

### **5. Post-Deployment Setup**

1. **Database Migration**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

2. **Test All Features**:
   - User registration/login
   - Campaign creation
   - AI generation
   - Payment processing
   - Dashboard functionality

### **6. Potential Issues & Solutions**

#### **Issue**: Prisma Client Generation
- **Solution**: `postbuild` script runs `prisma generate`
- **Fallback**: Manual generation in Vercel functions

#### **Issue**: Database Connection
- **Solution**: Use connection pooling (Prisma handles this)
- **Alternative**: Use Vercel Postgres with connection limits

#### **Issue**: API Route Timeouts
- **Solution**: `vercel.json` sets 30s timeout
- **Note**: OpenAI API calls may take longer

#### **Issue**: Environment Variables
- **Solution**: All variables properly configured
- **Check**: Verify all required variables are set

### **7. Production Optimizations**

1. **Database**:
   - Use connection pooling
   - Enable query logging for debugging
   - Set up database backups

2. **Performance**:
   - Enable Vercel Analytics
   - Use Vercel Edge Functions for static content
   - Optimize images with Next.js Image component

3. **Security**:
   - Use strong `NEXTAUTH_SECRET`
   - Enable HTTPS only
   - Set up proper CORS policies

4. **Monitoring**:
   - Set up error tracking (Sentry)
   - Monitor API performance
   - Track user analytics

### **8. Testing Checklist**

- [ ] User registration works
- [ ] User login works (credentials + Google)
- [ ] Campaign creation flow works
- [ ] AI generation works
- [ ] Payment processing works
- [ ] Dashboard displays correctly
- [ ] Real-time updates work
- [ ] Mobile responsiveness
- [ ] Error handling works

### **9. Rollback Plan**

- Keep previous deployment as backup
- Database migrations are reversible
- Environment variables can be reverted
- Vercel provides automatic rollback options

## **Status: ✅ READY FOR DEPLOYMENT**

The application is fully configured and ready for Vercel deployment without any additional proxy configuration needed.
