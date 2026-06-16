import Link from "next/link";
import { changelog } from "@/lib/data";
import Footer from "@/components/Footer";

export default function ChangelogPage() {
  return (
    <>
      <header className="border-b border-bg-elevated px-4 py-4 md:px-8">
        <Link href="/" className="font-display text-lg font-bold text-accent">
          LimeForge
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <h1 className="font-display text-4xl font-bold">Changelog</h1>
        <div className="mt-10 space-y-8">
          {changelog.map((entry) => (
            <article
              key={entry.date}
              className="rounded-lg border border-bg-elevated bg-bg-secondary p-6"
            >
              <p className="font-mono text-xs text-text-muted">{entry.date}</p>
              <h2 className="mt-1 font-display text-xl font-bold">{entry.title}</h2>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-text-muted">
                {entry.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}