import { Router } from 'express';
import { db } from '../config/database';
import { stripeEvents } from '../db/schema';
import { eq, asc } from 'drizzle-orm';
import Stripe from 'stripe';

const router = Router();

// Get setup intent details by ID
router.get('/:id', async (req, res) => {
    try {
        const setupIntentId = req.params.id;

        // Fetch all events for this setup intent in chronological order
        const events = await db.query.stripeEvents.findMany({
            where: eq(stripeEvents.objectId, setupIntentId),
            orderBy: [asc(stripeEvents.createdAt)]
        });

        if (events.length === 0) {
            return res.status(404).json({ error: 'Setup intent not found' });
        }

        // Initialize setup intent state
        let setupIntentState: Stripe.SetupIntent | null = null;

        // Apply events in order
        for (const event of events) {
            switch (event.type) {
                case 'setup_intent.created':
                    setupIntentState = event.data as Stripe.SetupIntent;
                    break;
                case 'setup_intent.updated':
                    setupIntentState = {
                        ...setupIntentState!,
                        ...(event.data as Stripe.SetupIntent)
                    };
                    break;
                case 'setup_intent.succeeded':
                    setupIntentState = {
                        ...setupIntentState!,
                        ...(event.data as Stripe.SetupIntent)
                    };
                    break;
                case 'setup_intent.processing':
                    setupIntentState = {
                        ...setupIntentState!,
                        ...(event.data as Stripe.SetupIntent)
                    };
                    break;
                case 'setup_intent.setup_failed':
                    setupIntentState = {
                        ...setupIntentState!,
                        ...(event.data as Stripe.SetupIntent)
                    };
                    break;
                case 'setup_intent.canceled':
                    setupIntentState = {
                        ...setupIntentState!,
                        ...(event.data as Stripe.SetupIntent)
                    };
                    break;
                case 'setup_intent.requires_action':
                    setupIntentState = {
                        ...setupIntentState!,
                        ...(event.data as Stripe.SetupIntent)
                    };
                    break;
                case 'setup_intent.requires_confirmation':
                    setupIntentState = {
                        ...setupIntentState!,
                        ...(event.data as Stripe.SetupIntent)
                    };
                    break;
                // Add more event types as needed
            }
        }

        res.json(setupIntentState);
    } catch (error) {
        console.error('Error retrieving setup intent:', error);
        res.status(500).json({ error: 'Failed to retrieve setup intent details' });
    }
});

export default router; 