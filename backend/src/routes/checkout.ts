import { Router, Request, Response } from 'express';
import { stripe, validateAmount } from '../utils/stripe';

const router = Router();

// checkout session request interface
interface CheckoutSessionRequest {
    amountCents: number;
    currency: string;
    successUrl: string;
    cancelUrl: string;
}

// create checkout session endpoint
router.post('/create-checkout-session', async (req: Request, res: Response) => {
    try {
        const { amountCents, currency, successUrl, cancelUrl } = req.body as CheckoutSessionRequest;

        if (!amountCents || !currency || !successUrl || !cancelUrl) {
            return res.status(400).json({
                error: 'Missing required fields: amountCents, currency, successUrl, cancelUrl'
            });
        }

        const validation = validateAmount(amountCents);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name: 'Custom Payment',
                            description: `Payment of ${(amountCents / 100).toFixed(2)} ${currency.toUpperCase()}`,
                        },
                        unit_amount: amountCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        console.log(`[Checkout] Created session ${session.id} for ${amountCents} ${currency}`);

        return res.status(200).json({ url: session.url });
    } catch (error: any) {
        console.error('[Checkout] Error:', error.message);
        return res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

export default router;

