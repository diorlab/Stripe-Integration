import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    typescript: true,
});

export function validateAmount(amountCents: number): { valid: boolean; error?: string } {
    const min = parseInt(process.env.MIN_CUSTOM_AMOUNT_CENTS || '50', 10);
    const max = parseInt(process.env.MAX_CUSTOM_AMOUNT_CENTS || '999999', 10);

    if (!Number.isInteger(amountCents)) {
        return { valid: false, error: 'Amount must be an integer' };
    }

    if (amountCents < min) {
        return { valid: false, error: `Amount must be at least ${min} cents` };
    }

    if (amountCents > max) {
        return { valid: false, error: `Amount cannot exceed ${max} cents` };
    }

    return { valid: true };
}

