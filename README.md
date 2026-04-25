# PayPill - Multi-Tenant Healthcare Application

A production-ready, AI-powered healthcare management platform built with Next.js, React, and Tailwind CSS.

## Architecture

**Three-Tier Access System:**
- **Individual Portal** — Personal health tracking, AI medication recommendations, provider discovery
- **Employer Portal** — Bulk employee onboarding, anonymized health analytics, cost-saving tracking
- **Insurance Portal** — Fixed-fee contract management, generic drug savings monitoring, payment routing

## Features Implemented

### Individual User Portal
- ✅ Interactive 9-step health onboarding (Welcome, Demographics, Vitals, Conditions, Medications, Allergies, Lifestyle, Providers, Insurance)
- ✅ AI Health Insights with Gemini API integration
- ✅ Medication management with adherence tracking
- ✅ Appointment booking with proximity-based provider matching
- ✅ Secure HIPAA-compliant messaging
- ✅ Complete health records viewer (8 categories)
- ✅ Settings with Blockchain Smart Contract placeholder

### Employer Portal
- ✅ Workforce health dashboard with KPIs
- ✅ Employee management with search/filter
- ✅ Bulk upload interface with CSV/Excel template
- ✅ Anonymized analytics (trends, department comparison, condition distribution)
- ✅ Cost savings breakdown visualization

### Insurance Portal
- ✅ Fixed-fee and per-member contract management
- ✅ Member outcome tracking with risk distribution
- ✅ Generic drug savings analysis
- ✅ Payment routing rules and transaction history
- ✅ Revenue vs claims visualization

## Tech Stack

- **Framework:** Next.js 15 + React 19
- **Styling:** Tailwind CSS 4 + Custom Design System
- **State:** Zustand (persistent storage)
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **AI:** Google Gemini API (simulated for demo)

## Database Schema Coverage

The onboarding implements ALL fields from the provided schema:
- User Profile (name, contact, preferences, 2FA)
- Personal Demographics (DOB, sex, gender, ethnicity, race)
- Blood Information (group, genotype)
- Body Measurements (height, weight, BMI auto-calc, circumference)
- Vital Baseline (heart rate, BP, O2 sat, temp, respiratory, glucose)
- Reproductive Health (pregnancy, breastfeeding, menstrual, menopause)
- Disability Support (vision, hearing, mobility, speech, cognitive)
- Pre-Existing Conditions (14 categories with severity, treatment, control status)
- Current Medications (9 classes with dosage, frequency, route, adherence)
- Allergies (drug, food, environmental with reaction type and severity)
- Family History, Surgical History, Immunizations, Lab History
- Lifestyle Habits (exercise, smoking, alcohol, substances, diet, sleep, sexual, stress)
- Healthcare Providers (primary, specialist, allied, facility)
- Insurance Details (type, carrier, member ID, coverage areas)
- Emergency Contacts (primary, secondary with permissions)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Security Features

- Simulated AES-256 data encryption
- HIPAA compliance mode toggle
- Two-factor authentication placeholder
- End-to-end encrypted messaging
- Zero-knowledge architecture for health records

## AI Capabilities

- Health data analysis with confidence scoring
- Generic medication alternative recommendations
- Proximity-based provider matching
- Research literature search integration
- Safety check validation (drug interactions, allergies)
- Cost comparison calculations

## Future Features (Placeholder UI)

- Blockchain Smart Contract Sharing (Settings > Blockchain)
- Zero-Knowledge Proofs for health claims
- Multi-chain support (Ethereum, Polygon, Hyperledger)

## File Structure

```
paypill-app/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/
│   │   ├── individual/   # User portal components
│   │   ├── employer/     # Employer portal
│   │   ├── insurance/    # Insurance portal
│   │   ├── onboarding/   # 9-step onboarding flow
│   │   └── shared/       # Landing page, role selector
│   ├── lib/
│   │   ├── store.ts      # Zustand global state
│   │   ├── utils.ts      # Helper functions
│   │   └── aiService.ts  # Gemini API integration
│   ├── data/
│   │   └── mockData.ts   # Comprehensive demo data
│   └── types/
│       └── index.ts      # Full TypeScript definitions
├── package.json
├── tsconfig.json
├── next.config.js
└── postcss.config.mjs
```

## License

Proprietary - PayPill Health Technologies 2026
