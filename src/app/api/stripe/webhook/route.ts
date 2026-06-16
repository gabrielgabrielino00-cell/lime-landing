import Stripe from "stripe";
import { hasStripe } from "@/lib/env";
import { localUpdateProfile } from "@/lib/local-db";

export async function POST(request: Request) {
  if (!hasStripe()) {
    return Response.json({ error: "Stripe not configured" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = (session.metadata?.plan ?? "pro") as "pro" | "team";
    if (userId) {
      await localUpdateProfile(userId, {
        plan,
        requestsLimit: 999_999,
        stripeCustomerId: String(session.customer ?? ""),
      });
    }
  }

  return Response.json({ received: true });
}