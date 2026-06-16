import { brand } from "@/lib/data";

const columns = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Changelog", "Docs"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-bg-surface px-4 py-16 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold">{brand.name}</p>
          <p className="mt-2 text-sm text-text-muted">{brand.tagline}</p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-text-muted transition-colors hover:text-text-primary"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-12 max-w-6xl text-center font-mono text-xs text-text-muted">
        © 2026 {brand.name}. All rights reserved.
      </p>
    </footer>
  );
}