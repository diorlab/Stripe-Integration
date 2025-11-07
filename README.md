# Stripe Payment Platform

A minimal full-stack TypeScript application for Stripe payment processing with a clean pricing page.

## Project Structure

```
stripe/
├── backend/          # Express + TypeScript API
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   │   ├── checkout.ts
│   │   │   ├── paymentIntent.ts
│   │   │   └── webhook.ts
│   │   └── utils/
│   │       └── stripe.ts
│   └── package.json
└── frontend/         # Next.js + TypeScript
    ├── pages/
    │   ├── index.tsx    # Pricing page (main page)
    │   ├── success.tsx
    │   └── cancel.tsx
    └── package.json
```

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your Stripe keys:

```env
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PORT=4000
FRONTEND_URL=*
MIN_CUSTOM_AMOUNT_CENTS=50
MAX_CUSTOM_AMOUNT_CENTS=999999
```

Start backend:

```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
NEXT_PUBLIC_BACKEND_URL=http://160.187.141.62:4000
```

Start frontend:

```bash
npm run dev
```

### 3. Run Everything (Single Server)

From the root directory:

```bash
./build-and-start.sh
```

This builds and serves everything on port 4000.

## Testing

### Web Interface

1. Open http://localhost:4000 (or http://160.187.141.62:4000)
2. Choose a pricing plan
3. Click "Get Started"
4. Use test card: `4242 4242 4242 4242`
5. Complete payment

### Webhook Testing

```bash
# Install Stripe CLI
stripe listen --forward-to http://localhost:4000/webhook

# In another terminal, trigger test events
stripe trigger checkout.session.completed
```

### API Testing

```bash
curl -X POST http://localhost:4000/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "amountCents": 2900,
    "currency": "usd",
    "successUrl": "http://localhost:4000/success",
    "cancelUrl": "http://localhost:4000/cancel"
  }'
```

## Features

- Three pricing tiers (Basic, Professional, Enterprise)
- Direct Stripe Checkout integration
- Webhook event handling
- Success/Cancel pages
- Responsive design
- TypeScript throughout

## Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- Stripe Node SDK
- dotenv

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Stripe.js

## Environment Variables

### Backend (.env)
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
- `PORT` - Server port (default: 4000)
- `FRONTEND_URL` - CORS origin
- `MIN_CUSTOM_AMOUNT_CENTS` - Minimum payment amount
- `MAX_CUSTOM_AMOUNT_CENTS` - Maximum payment amount

### Frontend (.env.local)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL

## Customization

### Change Pricing

Edit `frontend/pages/index.tsx`:

```typescript
const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9,  // Change price here
    description: 'For individuals',
    features: ['Feature 1', 'Feature 2'],
  },
  // ... more plans
]
```

### Add/Remove Plans

Simply add or remove items from the `plans` array in `index.tsx`.

## Production Checklist

- [ ] Use live Stripe keys (not test keys)
- [ ] Set up webhook endpoint in Stripe Dashboard
- [ ] Add rate limiting
- [ ] Implement proper logging
- [ ] Add error tracking (e.g., Sentry)
- [ ] Set up monitoring
- [ ] Configure SSL/HTTPS
- [ ] Review security settings

## License

MIT
