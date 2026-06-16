"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Code2, Mail, Settings } from "lucide-react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { OAuthProviders } from "@/lib/oauth";

function LoginFormInner({
  providers,
  callbackBase,
  showDevLogin,
}: {
  providers: OAuthProviders;
  callbackBase: string;
  showDevLogin: boolean;
}) {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/app";
  const error = params.get("error");

  const hasRealOAuth = providers.google || providers.github;

  return (
    <div className="glass-card w-full max-w-md p-8">
      <Link href="/" className="font-display text-2xl font-bold text-gradient">
        LimeForge
      </Link>
      <p className="mt-2 text-sm text-text-muted">
        Accedi con Google o GitHub per usare LimeForge.
      </p>

      {error && (
        <p className="mt-4 rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
          Login fallito. Controlla le chiavi OAuth in{" "}
          <Link href="/setup" className="text-accent underline">
            /setup
          </Link>
          .
        </p>
      )}

      {!hasRealOAuth && (
        <div className="mt-4 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
          OAuth non configurato. Vai su{" "}
          <Link href="/setup" className="font-medium underline">
            /setup
          </Link>{" "}
          per incollare Client ID e Secret da GitHub/Google.
        </div>
      )}

      <div className="mt-8 space-y-3">
        {providers.google ? (
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            className="oauth-btn"
          >
            <Mail className="h-4 w-4" />
            Continua con Google
          </button>
        ) : (
          <Link href="/setup" className="oauth-btn opacity-60">
            <Mail className="h-4 w-4" />
            Configura Google OAuth →
          </Link>
        )}

        {providers.github ? (
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl })}
            className="oauth-btn"
          >
            <Code2 className="h-4 w-4" />
            Continua con GitHub
          </button>
        ) : (
          <Link href="/setup" className="oauth-btn opacity-60">
            <Code2 className="h-4 w-4" />
            Configura GitHub OAuth →
          </Link>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-text-muted">
        <Link
          href="/setup"
          className="inline-flex items-center gap-1 hover:text-accent"
        >
          <Settings className="h-3 w-3" /> Configura .env
        </Link>
        {showDevLogin && (
          <button
            type="button"
            onClick={() =>
              signIn("dev-login", {
                email: "dev@limeforge.local",
                callbackUrl,
              })
            }
            className="hover:text-accent"
          >
            Dev user (emergenza)
          </button>
        )}
      </div>

      {hasRealOAuth && (
        <p className="mt-4 text-center font-mono text-[10px] text-text-faint">
          Callback: {callbackBase}/github · {callbackBase}/google
        </p>
      )}
    </div>
  );
}

export default function LoginForm({
  providers,
  callbackBase,
  showDevLogin = false,
}: {
  providers: OAuthProviders;
  callbackBase: string;
  showDevLogin?: boolean;
}) {
  return (
    <Suspense
      fallback={
        <div className="glass-card flex h-96 items-center justify-center text-text-muted">
          Caricamento…
        </div>
      }
    >
      <LoginFormInner
        providers={providers}
        callbackBase={callbackBase}
        showDevLogin={showDevLogin}
      />
    </Suspense>
  );
}