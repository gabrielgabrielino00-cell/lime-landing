import { stats } from "@/lib/data";

export default function SocialProof() {
  return (
    <section className="border-y border-white/[0.06] bg-bg-secondary/40 py-10 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 md:flex-row md:justify-between md:px-8">
        <p className="font-mono text-sm text-text-muted">
          <span className="text-text-primary">{stats.creators}</span> creators ·{" "}
          <span className="text-text-primary">{stats.generations}</span>{" "}
          generations ·{" "}
          <span className="text-accent">{stats.models}</span> AI models
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {["Roblox", "Discord", "GitHub", "Studio", "DevForum"].map((brand) => (
            <span
              key={brand}
              className="font-display text-xs font-semibold uppercase tracking-widest text-text-faint"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}