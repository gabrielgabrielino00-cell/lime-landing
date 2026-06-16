import Button from "@/components/ui/Button";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-4 py-28 md:px-8">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(200,255,0,0.18) 0%, transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight md:text-5xl">
          Ready to ship your first flow?
        </h2>
        <p className="mt-4 text-lg text-text-muted">
          Join thousands of creators building with Volt today.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button glow>Get started free</Button>
          <a href="#pricing" className="text-sm text-text-muted hover:text-accent">
            No credit card required →
          </a>
        </div>
      </div>
    </section>
  );
}