import { Router, Request, Response } from 'express';
import { stripe, validateAmount } from '../utils/stripe';

const router = Router();

// payment intent request interface
interface PaymentIntentRequest {
    amountCents: number;
    currency: string;
}

// create payment intent endpoint
router.post('/create-payment-intent', async (req: Request, res: Response) => {
    try {
        const { amountCents, currency } = req.body as PaymentIntentRequest;

        if (!amountCents || !currency) {
            return res.status(400).json({
                error: 'Missing required fields: amountCents, currency'
            });
        }

        const validation = validateAmount(amountCents);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountCents,
            currency: currency.toLowerCase(),
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log(`[PaymentIntent] Created ${paymentIntent.id} for ${amountCents} ${currency}`);

        return res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        console.error('[PaymentIntent] Error:', error.message);
        return res.status(500).json({ error: 'Failed to create payment intent' });
    }
});

export default router;

