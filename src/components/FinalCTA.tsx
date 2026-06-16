import Link from "next/link";
import Button from "@/components/ui/Button";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-4 py-32 md:px-8">
      <div className="mesh-bg pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Start free in{" "}
          <span className="text-gradient">30 seconds</span>
        </h2>
        <p className="mt-4 text-lg text-text-muted">
          Open the workspace, pick a model, sync Luau to Studio.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/app">
            <Button glow className="px-8 py-3">
              Get started free
            </Button>
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-text-muted transition hover:text-accent"
          >
            No credit card required →
          </Link>
        </div>
      </div>
    </section>
  );
}