import { socialBrands, stats } from "@/lib/data";

export default function SocialProof() {
  return (
    <section className="border-y border-bg-elevated bg-bg-secondary/50 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 md:flex-row md:justify-between md:px-8">
        <p className="font-mono text-sm text-text-muted">
          <span className="text-text-primary">{stats.creators}</span> creators ·{" "}
          <span className="text-text-primary">{stats.generations}</span> generations ·{" "}
          <span className="text-text-primary">{stats.models}</span> AI models
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