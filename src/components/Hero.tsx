"use client";

import { Play } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section
      id="product"
      className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 pb-20 pt-16 md:px-8"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 40%, var(--glow) 0%, transparent 55%), radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 24px 24px",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
            AI workflow studio
          </p>
          <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Build automations
            <br />
            faster than you think.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-text-muted">
            Volt turns messy AI experiments into production-ready flows your
            whole community can trust.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button glow>Get started free</Button>
            <Button variant="ghost">
              <Play className="h-4 w-4 fill-current" />
              Watch demo
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-xl border border-bg-surface bg-bg-secondary p-4 shadow-2xl">
            <div className="mb-3 flex items-center gap-2 border-b border-bg-surface pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 font-mono text-xs text-text-muted">
                flow-builder.tsx
              </span>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="rounded-lg border border-bg-surface bg-bg-primary p-3">
                <span className="text-accent">trigger</span> → new Discord
                message
              </div>
              <div className="rounded-lg border border-bg-surface bg-bg-primary p-3">
                <span className="text-accent">agent</span> → summarize + tag
              </div>
              <div className="rounded-lg border border-accent/30 bg-bg-primary p-3 text-text-primary">
                <span className="text-accent">action</span> → post to Notion ✓
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}