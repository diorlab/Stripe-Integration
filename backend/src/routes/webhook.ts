import { Router, Request, Response } from 'express';
import { stripe } from '../utils/stripe';
import Stripe from 'stripe';

const router = Router();

const processedEvents = new Set<string>();

// webhook endpoint
router.post('/webhook', async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
        console.error('[Webhook] Missing stripe-signature header');
        return res.status(400).send('Missing signature');
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error('[Webhook] STRIPE_WEBHOOK_SECRET not configured');
        return res.status(500).send('Webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error('[Webhook] Signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (processedEvents.has(event.id)) {
        console.log(`[Webhook] Event ${event.id} already processed, skipping`);
        return res.status(200).json({ received: true, duplicate: true });
    }

    console.log(`[Webhook] Received event ${event.id} of type ${event.type}`);

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log(`[Webhook] Checkout session completed: ${session.id}`);
                console.log(`  - Amount: ${session.amount_total} ${session.currency}`);
                console.log(`  - Payment Status: ${session.payment_status}`);
                console.log(`[Fulfillment] TODO: Fulfill order for session ${session.id}`);
                break;
            }

            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`[Webhook] Payment intent succeeded: ${paymentIntent.id}`);
                console.log(`  - Amount: ${paymentIntent.amount} ${paymentIntent.currency}`);
                console.log(`[Fulfillment] TODO: Fulfill order for payment intent ${paymentIntent.id}`);
                break;
            }

            default:
                console.log(`[Webhook] Unhandled event type: ${event.type}`);
        }

        processedEvents.add(event.id);

        return res.status(200).json({ received: true });
    } catch (error: any) {
        console.error('[Webhook] Error processing event:', error.message);
        return res.status(500).json({ error: 'Webhook processing failed' });
    }
});

export default router;

