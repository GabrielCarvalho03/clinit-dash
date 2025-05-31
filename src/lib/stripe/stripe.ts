import Stripe from "stripe";

export const stripeCliente = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
});
