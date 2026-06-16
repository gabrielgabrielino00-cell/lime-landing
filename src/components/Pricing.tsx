"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check } from "lucide-react";
import { plans } from "@/lib/data";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export default function Pricing() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function checkout(planName: string) {
    const plan = planName.toLowerCase() as "pro" | "team";
    if (plan !== "pro" && plan !== "team") {
      router.push("/login");
      return;
    }
    setLoading(planName);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = (await res.json()) as { url?: string };
    if (data.url) router.push(data.url);
    setLoading(null);
  }

  return (
    <section id="pricing" className="border-t border-bg-elevated px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">
          Simple pricing
        </h2>
        <p className="mt-3 text-text-muted">
          Start free. Upgrade when your games go viral.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                "relative rounded-xl border bg-bg-secondary p-6",
                plan.popular
                  ? "border-accent shadow-[0_0_32px_var(--glow)]"
                  : "border-bg-elevated",
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 font-mono text-xs font-bold text-bg-primary">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-xl font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-text-muted">{plan.description}</p>
              <p className="mt-6 font-display text-4xl font-bold">
                {plan.price === 0 ? (
                  "Free"
                ) : (
                  <>
                    ${plan.price}
                    <span className="text-base font-normal text-text-muted">
                      /mo
                    </span>
                  </>
                )}
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-text-muted"
                  >
                    <Check className="h-4 w-4 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                glow={plan.popular}
                variant={plan.popular ? "primary" : "ghost"}
                className="mt-8 w-full"
                onClick={() =>
                  plan.price === 0
                    ? router.push("/login")
                    : void checkout(plan.name)
                }
              >
                {loading === plan.name ? "Loading…" : plan.cta}
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}