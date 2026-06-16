"use client";

import { motion, useReducedMotion } from "framer-motion";
import { steps } from "@/lib/data";

export default function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-t border-bg-surface px-4 py-24 md:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-text-muted">
            Three steps from blank canvas to live automation.
          </p>

          <ol className="mt-10 space-y-8">
            {steps.map((step, index) => (
              <motion.li
                key={step.title}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-sm font-bold text-bg-primary">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display font-bold">{step.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-bg-surface bg-bg-secondary p-6"
        >
          <div className="aspect-video rounded-lg bg-bg-primary p-4">
            <div className="grid h-full grid-cols-3 gap-3">
              {["Input", "Agent", "Output"].map((label) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center rounded-lg border border-dashed border-bg-surface text-center"
                >
                  <span className="font-mono text-xs text-accent">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 font-mono text-xs text-text-muted">
            Live preview · latency 120ms avg
          </p>
        </motion.div>
      </div>
    </section>
  );
}