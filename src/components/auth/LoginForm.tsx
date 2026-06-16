"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Code2, Mail } from "lucide-react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { OAuthProviders } from "@/lib/oauth";

function LoginFormInner({
  providers,
  callbackBase,
}: {
  providers: OAuthProviders;
  callbackBase: string;
}) {
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
          Login failed. Check OAuth keys in `.env.local`.
        </p>
      )}

      <div className="mt-8 space-y-3">
        {providers.google && (
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            className="oauth-btn"
          >
            <Mail className="h-4 w-4" />
            Continue with Google
          </button>
        )}
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

        {(providers.google || providers.github) && (
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
          <Code2 className="mr-2 inline h-4 w-4" />
          Continue as Dev User
        </button>
      </div>

      {!providers.any && (
        <div className="mt-6 rounded-xl border border-white/[0.06] bg-bg-surface/50 p-4 text-xs text-text-muted">
          <p className="font-medium text-text-primary">OAuth setup (one time)</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>
              Google:{" "}
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                create OAuth client
              </a>
            </li>
            <li>
              GitHub:{" "}
              <a
                href="https://github.com/settings/developers"
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                create OAuth app
              </a>
            </li>
            <li>
              Callback URL:{" "}
              <code className="text-accent">{callbackBase}/github</code> or{" "}
              <code className="text-accent">{callbackBase}/google</code>
            </li>
            <li>
              Add keys to <code>.env.local</code> and restart dev server
            </li>
          </ol>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-text-muted">
        By continuing you agree to our terms. Local dev only.
      </p>
    </div>
  );
}

export default function LoginForm({
  providers,
  callbackBase,
}: {
  providers: OAuthProviders;
  callbackBase: string;
}) {
  return (
    <Suspense
      fallback={
        <div className="glass-card flex h-96 items-center justify-center text-text-muted">
          Loading…
        </div>
      }
    >
      <LoginFormInner providers={providers} callbackBase={callbackBase} />
    </Suspense>
  );
}