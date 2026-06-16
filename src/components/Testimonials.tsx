import { Star } from "lucide-react";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  return (
    <section className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">
          Loved by builders
        </h2>

        <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="mb-6 break-inside-avoid rounded-xl border border-bg-surface bg-bg-secondary p-5"
            >
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-primary">
                &ldquo;{item.quote}&rdquo;
              </p>
              <p className="mt-4 font-mono text-xs text-text-muted">
                {item.name} · {item.role}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}