
import { stripe } from "../lib/stripe";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testStripe() {
    console.log("Testing Stripe Connection...");

    if (!process.env.STRIPE_SECRET_KEY) {
        console.error("ERROR: STRIPE_SECRET_KEY is missing from environment variables.");
        return;
    }

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        console.error("ERROR: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing from environment variables.");
        return;
    }

    if (!stripe) {
        console.error("ERROR: Stripe client failed to initialize.");
        return;
    }

    try {
        const products = await stripe.products.list({ limit: 1 });
        console.log("SUCCESS: Connected to Stripe! Found products:", products.data.length);
    } catch (error: any) {
        console.error("ERROR: Failed to connect to Stripe:", error.message);
    }
}

testStripe();
