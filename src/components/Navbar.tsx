"use client";

import { useEffect, useState } from "react";
import { brand, navLinks } from "@/lib/data";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 transition-colors duration-300",
        scrolled
          ? "border-b border-bg-surface/80 bg-bg-secondary/80 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 md:px-8">
        <a
          href="#"
          className="font-display text-lg font-bold tracking-tight text-text-primary"
        >
          {brand.name}
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-text-muted transition-colors hover:text-text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:inline-flex px-4 py-2">
            Log in
          </Button>
          <Button glow className="px-4 py-2">
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}