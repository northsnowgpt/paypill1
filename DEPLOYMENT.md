# PayPill Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended for Next.js)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd paypill-app
vercel --prod
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Option 3: Static Hosting (S3, GitHub Pages, etc.)
```bash
# Build static export
npm run build

# The 'dist' folder will contain all static files
# Upload to your hosting provider
```

## Environment Variables

Create a `.env.local` file:

```
# Google Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Optional: Real provider APIs
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_places_key
NEXT_PUBLIC_GOODRX_API_KEY=your_goodrx_key

# Encryption
PAYPILL_ENCRYPTION_KEY=your_secure_key
```

## Database Integration (Future)

The app currently uses Zustand with localStorage persistence. For production:

1. **Supabase** — PostgreSQL with real-time subscriptions
2. **Firebase** — Firestore for health records
3. **Prisma + PostgreSQL** — Self-hosted option

## Production Checklist

- [ ] Set up real Gemini API key
- [ ] Configure actual provider proximity APIs
- [ ] Implement proper encryption (replace simulated crypto)
- [ ] Add OAuth providers (Google, Microsoft)
- [ ] Set up HIPAA-compliant hosting (AWS HIPAA, Azure HITRUST)
- [ ] Configure audit logging
- [ ] Implement rate limiting
- [ ] Add error tracking (Sentry)
- [ ] Set up monitoring (Datadog, New Relic)

## Architecture Notes

### Frontend
- Next.js 15 with App Router
- Static export for simple hosting
- Responsive design (mobile-first)
- Accessible UI (ARIA labels, keyboard navigation)

### State Management
- Zustand for global state
- localStorage persistence
- Demo data pre-loaded for testing

### AI Integration
- Simulated Gemini API calls
- Real implementation requires API key
- Literature search via PubMed/semantic Scholar APIs

### Security
- Simulated encryption (replace with proper crypto in production)
- HIPAA compliance UI indicators
- Secure messaging with end-to-end encryption placeholder

## Support

For issues or questions, contact the PayPill development team.
