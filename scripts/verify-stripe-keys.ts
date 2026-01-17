
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verifyStripe() {
    console.log("Verifying Stripe Keys...");

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        console.error("❌ STRIPE_SECRET_KEY missing");
        return;
    }

    // Initialize Stripe
    const stripe = new Stripe(secretKey);

    try {
        // Try to list products to verify secret key permissions
        const products = await stripe.products.list({ limit: 1 });
        console.log("✅ Secret Key Valid! Accessing account...");
        console.log(`   Found ${products.data.length} products locally available to list.`);
    } catch (err: any) {
        console.error(`❌ Secret Key Error: ${err.message}`);
    }
}

verifyStripe();
