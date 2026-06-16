"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Code2 } from "lucide-react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/app";

  return (
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
          onClick={() => signIn("google", { callbackUrl })}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-bg-elevated bg-bg-surface py-2.5 text-sm hover:border-accent-border"
        >
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => signIn("github", { callbackUrl })}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-bg-elevated bg-bg-surface py-2.5 text-sm hover:border-accent-border"
        >
          <Code2 className="h-4 w-4" /> Continue with GitHub
        </button>
        <div className="relative py-2 text-center text-xs text-text-faint">
          or
        </div>
        <button
          type="button"
          onClick={() =>
            signIn("dev-login", {
              email: "dev@limeforge.local",
              callbackUrl,
            })
          }
          className="w-full rounded-md bg-accent py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-soft"
        >
          Continue as Dev User (local)
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-text-muted">
        OAuth works when you add Google/GitHub keys in `.env.local`.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <Suspense fallback={<div className="text-text-muted">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}