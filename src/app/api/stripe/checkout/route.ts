import Stripe from "stripe";
import { requireUser } from "@/lib/auth-server";
import { hasStripe } from "@/lib/env";
import { localUpdateProfile } from "@/lib/local-db";

export async function POST(request: Request) {
  const ctx = await requireUser();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = (await request.json()) as { plan?: "pro" | "team" };

  if (!hasStripe()) {
    const nextPlan = plan === "team" ? "team" : "pro";
    await localUpdateProfile(ctx.session.user.id, {
      plan: nextPlan,
      requestsLimit: 999_999,
    });
    return Response.json({
      url: `/settings?upgraded=${nextPlan}`,
      mock: true,
    });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const priceId =
    plan === "team"
      ? process.env.STRIPE_PRICE_TEAM!
      : process.env.STRIPE_PRICE_PRO!;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: ctx.profile.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.AUTH_URL}/settings?upgraded=${plan}`,
    cancel_url: `${process.env.AUTH_URL}/pricing`,
    metadata: { userId: ctx.session.user.id, plan: plan ?? "pro" },
  });

  return Response.json({ url: session.url });
}