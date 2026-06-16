"use client";

import { motion } from "framer-motion";
import { Shield, Users, Zap, type LucideIcon } from "lucide-react";
import { features } from "@/lib/data";

const icons: Record<string, LucideIcon> = {
  Zap,
  Shield,
  Users,
};

export default function Features() {
  return (
    <section id="features" className="px-4 py-28 md:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Features
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Built for Roblox creators
        </h2>
        <p className="mt-3 max-w-xl text-text-muted">
          Everything from idea to live script — without duct-taping five
          different tools.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = icons[feature.icon] ?? Zap;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card group p-7 transition hover:border-accent-border/50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-dim">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}