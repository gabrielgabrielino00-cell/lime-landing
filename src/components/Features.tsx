"use client";

import { Shield, Users, Zap, type LucideIcon } from "lucide-react";
import { features } from "@/lib/data";

const icons: Record<string, LucideIcon> = {
  Zap,
  Shield,
  Users,
};

export default function Features() {
  return (
    <section id="features" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">
          Built for speed
        </h2>
        <p className="mt-3 max-w-xl text-text-muted">
          Everything you need to go from idea to live automation — without
          duct-taping five different apps.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = icons[feature.icon] ?? Zap;
            return (
              <article
                key={feature.title}
                className="rounded-xl border border-bg-surface bg-bg-secondary p-6 transition-all duration-200 hover:border-accent/50 hover:shadow-[0_0_24px_var(--glow)]"
              >
                <Icon className="h-6 w-6 text-accent" />
                <h3 className="mt-4 font-display text-lg font-bold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}