import { socialBrands } from "@/lib/data";

export default function SocialProof() {
  return (
    <section className="border-y border-bg-surface bg-bg-secondary/50 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 md:flex-row md:justify-between md:px-8">
        <p className="font-mono text-sm text-text-muted">
          Trusted by <span className="text-text-primary">12,000+</span> creators
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
          {socialBrands.map((brand) => (
            <span
              key={brand}
              className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}