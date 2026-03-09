import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  getStripeServer,
  getStripeWebhookSecret,
} from "@/features/payment/stripe";

/**
 * Stripe webhook handler. Must use raw body for signature verification.
 * @see https://docs.stripe.com/webhooks#verify-events
 * @see https://docs.stripe.com/checkout/fulfillment
 */
export async function POST(request: Request) {
  const stripe = getStripeServer();
  const webhookSecret = getStripeWebhookSecret();

  if (!stripe || !webhookSecret) {
    console.error("Stripe or STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  let payload: string;
  try {
    payload = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const sessionId =
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
      ? (event.data.object as Stripe.Checkout.Session).id
      : null;

  if (sessionId) {
    try {
      await fulfillCheckoutSession(stripe, sessionId);
    } catch (err) {
      console.error("Fulfillment error for session", sessionId, err);
      return NextResponse.json(
        { error: "Fulfillment failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

/**
 * Fulfill a successful checkout. Safe to call multiple times for the same session.
 * @see https://docs.stripe.com/checkout/fulfillment
 */
async function fulfillCheckoutSession(
  stripe: Stripe,
  sessionId: string
): Promise<void> {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (session.payment_status === "unpaid") {
    return;
  }

  // TODO: Persist order, update inventory, send confirmation email, etc.
  // Example: await db.orders.fulfill({ stripeSessionId: sessionId, ... });
  console.log("Fulfilling checkout session:", sessionId, {
    payment_status: session.payment_status,
    customer_email: session.customer_details?.email,
    amount_total: session.amount_total,
    client_reference_id: session.client_reference_id,
  });
}
