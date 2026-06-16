"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { ArrowRight, Code2, Loader2, Mail } from "lucide-react";
import { Suspense, useState } from "react";
import type { OAuthProviders } from "@/lib/oauth";

function LoginFormInner({
  providers,
  callbackUrl,
  localMode,
}: {
  providers: OAuthProviders;
  callbackUrl: string;
  localMode: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function enterApp() {
    setLoading(true);
    await signIn("dev-login", {
      email: "creator@limeforge.local",
      callbackUrl,
    });
  }

  if (localMode) {
    return (
      <div className="glass-card w-full max-w-md p-8 text-center">
        <Link href="/" className="font-display text-2xl font-bold text-gradient">
          LimeForge
        </Link>
        <p className="mt-3 text-sm text-text-muted">
          Tutto già configurato in locale. Nessuna chiave OAuth necessaria.
        </p>

        <button
          type="button"
          disabled={loading}
          onClick={() => void enterApp()}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-4 text-base font-semibold text-bg-primary shadow-[0_0_32px_var(--glow)] transition hover:bg-accent-soft disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Accesso in corso…
            </>
          ) : (
            <>
              Entra in LimeForge
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        <p className="mt-6 text-xs text-text-faint">
          Account locale: creator@limeforge.local · piano Pro attivo
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card w-full max-w-md p-8">
      <Link href="/" className="font-display text-2xl font-bold text-gradient">
        LimeForge
      </Link>
      <p className="mt-2 text-sm text-text-muted">
        Accedi con il tuo account Google o GitHub.
      </p>

      <div className="mt-8 space-y-3">
        {providers.google && (
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            className="oauth-btn"
          >
            <Mail className="h-4 w-4" />
            Continua con Google
          </button>
        )}
        {providers.github && (
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl })}
            className="oauth-btn"
          >
            <Code2 className="h-4 w-4" />
            Continua con GitHub
          </button>
        )}
      </div>
    </div>
  );
}

export default function LoginForm({
  providers,
  callbackUrl,
  localMode,
}: {
  providers: OAuthProviders;
  callbackUrl: string;
  localMode: boolean;
}) {
  return (
    <Suspense
      fallback={
        <div className="glass-card flex h-64 items-center justify-center gap-2 text-text-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
          Caricamento…
        </div>
      }
    >
      <LoginFormInner
        providers={providers}
        callbackUrl={callbackUrl}
        localMode={localMode}
      />
    </Suspense>
  );
}