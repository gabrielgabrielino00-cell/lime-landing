"use client";

import Link from "next/link";
import { Code2 } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function LoginPage() {
  const loginDev = useAppStore((s) => s.loginDev);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-md rounded-xl border border-bg-elevated bg-bg-secondary p-8">
        <Link href="/" className="font-display text-2xl font-bold text-accent">
          LimeForge
        </Link>
        <p className="mt-2 text-sm text-text-muted">
          Sign in to sync AI scripts with Roblox Studio.
        </p>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => {
              loginDev();
              window.location.href = "/dashboard";
            }}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-bg-elevated bg-bg-surface py-2.5 text-sm hover:border-accent-border"
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => {
              loginDev();
              window.location.href = "/dashboard";
            }}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-bg-elevated bg-bg-surface py-2.5 text-sm hover:border-accent-border"
          >
            <Code2 className="h-4 w-4" /> Continue with GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-text-muted">
          Local dev mode — OAuth connects when you add Supabase/NextAuth.
        </p>
      </div>
    </div>
  );
}