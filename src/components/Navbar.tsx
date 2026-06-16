"use client";

import Link from "next/link";
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
          ? "border-b border-bg-elevated/80 bg-bg-secondary/80 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/" className="font-display text-lg font-bold tracking-tight text-accent">
          {brand.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-text-muted transition-colors hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="hidden px-4 py-2 sm:inline-flex">
              Log in
            </Button>
          </Link>
          <Link href="/app">
            <Button glow className="px-4 py-2">
              Start free
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}