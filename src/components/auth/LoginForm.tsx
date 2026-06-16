"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Code2 } from "lucide-react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { OAuthProviders } from "@/lib/oauth";

function LoginFormInner({ providers }: { providers: OAuthProviders }) {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/app";
  const error = params.get("error");

  return (
    <div className="glass-card w-full max-w-md p-8">
      <Link href="/" className="font-display text-2xl font-bold text-gradient">
        LimeForge
      </Link>
      <p className="mt-2 text-sm text-text-muted">
        Sign in to sync AI scripts with Roblox Studio.
      </p>

      {error && (
        <p className="mt-4 rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
          Login failed. Try Dev User or check GitHub keys in .env.local
        </p>
      )}

      <div className="mt-8 space-y-3">
        {providers.github && (
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl })}
            className="oauth-btn"
          >
            <Code2 className="h-4 w-4" />
            Continue with GitHub
          </button>
        )}

        {providers.google && (
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            className="oauth-btn"
          >
            Continue with Google
          </button>
        )}

        {(providers.github || providers.google) && (
          <div className="relative py-2 text-center text-xs text-text-faint">
            or
          </div>
        )}

        <button
          type="button"
          onClick={() =>
            signIn("dev-login", {
              email: "dev@limeforge.local",
              callbackUrl,
            })
          }
          className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-bg-primary shadow-[0_0_32px_var(--glow)] transition hover:bg-accent-soft"
        >
          Continue as Dev User (local)
        </button>
      </div>

      {!providers.github && (
        <p className="mt-4 text-xs text-text-muted">
          GitHub OAuth: add{" "}
          <code className="text-accent">AUTH_GITHUB_ID</code> and{" "}
          <code className="text-accent">AUTH_GITHUB_SECRET</code> to{" "}
          <code>.env.local</code>, then restart{" "}
          <code>npm run dev</code>. Callback:{" "}
          <code className="text-accent">
            http://localhost:3000/api/auth/callback/github
          </code>
        </p>
      )}
    </div>
  );
}

export default function LoginForm({ providers }: { providers: OAuthProviders }) {
  return (
    <Suspense
      fallback={
        <div className="glass-card flex h-64 items-center justify-center text-text-muted">
          Loading…
        </div>
      }
    >
      <LoginFormInner providers={providers} />
    </Suspense>
  );
}