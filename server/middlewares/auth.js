import { clerkClient } from "@clerk/express";

// Middleware to check userId and hasPremiumPlan

export const auth = async (req, res, next)=>{
    try {
        const { userId, has } = req.auth;

        // Prefer Clerk entitlements via `has`, fallback to user metadata flags set after Stripe webhook
        let hasPremiumPlan = false;
        if (typeof has === 'function') {
            try {
                hasPremiumPlan = await has({ plan: 'premium' });
            } catch (_) {
                hasPremiumPlan = false;
            }
        }

        const user = await clerkClient.users.getUser(userId);

        if (!hasPremiumPlan) {
            const meta = user.privateMetadata || {};
            const pub = user.publicMetadata || {};
            if (
                meta.subscription_status === 'active' ||
                meta.stripe_subscription_status === 'active' ||
                pub.plan === 'premium'
            ) {
                hasPremiumPlan = true;
            }
        }

        if(!hasPremiumPlan && user.privateMetadata.free_usage){
            req.free_usage = user.privateMetadata.free_usage
        } else{
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            })
            req.free_usage = 0;
        }

        req.plan = hasPremiumPlan ? 'premium' : 'free';
        next()
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}