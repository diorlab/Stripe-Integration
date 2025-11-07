# Stripe Payment Backend

A minimal TypeScript + Express backend for Stripe payment processing with Checkout Sessions and Payment Intents.

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your Stripe test keys:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
PORT=4000
FRONTEND_URL=http://localhost:3000
MIN_CUSTOM_AMOUNT_CENTS=50
MAX_CUSTOM_AMOUNT_CENTS=999999
```

**Get your keys from:** https://dashboard.stripe.com/test/apikeys

### 3. Run the Server

Development mode (with hot reload):

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

Server will start on http://localhost:4000

## Webhook Testing

### 1. Install Stripe CLI

Follow instructions at: https://stripe.com/docs/stripe-cli

### 2. Login to Stripe

```bash
stripe login
```

### 3. Forward Webhook Events

```bash
stripe listen --forward-to http://localhost:4000/webhook
```

This will output a webhook signing secret like `whsec_...`. Add it to your `.env` file as `STRIPE_WEBHOOK_SECRET`.

### 4. Trigger Test Events

```bash
# Trigger a test checkout session completed event
stripe trigger checkout.session.completed

# Trigger a test payment intent succeeded event
stripe trigger payment_intent.succeeded
```

## API Endpoints

### POST /api/create-checkout-session

Create a Stripe Checkout Session for hosted payment page.

**Request:**

```bash
curl -X POST http://localhost:4000/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "amountCents": 2000,
    "currency": "usd",
    "successUrl": "http://localhost:3000/success",
    "cancelUrl": "http://localhost:3000/cancel"
  }'
```

**Response:**

```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### POST /api/create-payment-intent

Create a PaymentIntent for custom payment flows (Stripe Elements).

**Request:**

```bash
curl -X POST http://localhost:4000/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "amountCents": 1500,
    "currency": "usd"
  }'
```

**Response:**

```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

### POST /webhook

Stripe webhook endpoint for event notifications. Requires raw body and signature verification.

**Handled Events:**
- `checkout.session.completed` - When a Checkout Session payment succeeds
- `payment_intent.succeeded` - When a PaymentIntent succeeds

## Production TODOs

- [ ] Add rate limiting (e.g., express-rate-limit)
- [ ] Implement proper logging service (e.g., Winston, Pino, or Sentry)
- [ ] Store processed webhook event IDs in Redis/database for idempotency
- [ ] Implement real fulfillment logic (database updates, emails, etc.)
- [ ] Add request validation middleware (e.g., express-validator)
- [ ] Validate currency codes against supported list
- [ ] Add monitoring and alerting
- [ ] Set up proper error tracking
- [ ] Add unit and integration tests

