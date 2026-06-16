"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Code2, Mail } from "lucide-react";
import { Suspense, useState } from "react";
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
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSocial(
    provider: "google" | "github",
    real: boolean,
    localId: string,
  ) {
    setLoading(provider);
    try {
      if (real) {
        await signIn(provider, { callbackUrl });
        return;
      }
      const addr =
        email.trim() ||
        (provider === "google" ? "user@gmail.com" : "user@github.com");
      const result = await signIn(localId, {
        email: addr,
        callbackUrl,
        redirect: false,
      });
      if (result?.error) {
        alert("Inserisci un'email valida.");
        return;
      }
      window.location.href = callbackUrl;
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="glass-card w-full max-w-md p-8">
      <Link href="/" className="font-display text-2xl font-bold text-gradient">
        LimeForge
      </Link>
      <p className="mt-2 text-sm text-text-muted">
        Accedi per sincronizzare gli script AI con Roblox Studio.
      </p>

      {error && (
        <p className="mt-4 rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
          Login fallito. Riprova o usa un&apos;altra email.
        </p>
      )}

      {!providers.google && !providers.github && (
        <div className="mt-6">
          <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Email (per login locale Google/GitHub)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tua@email.com"
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-bg-surface/90 px-4 py-3 text-sm focus:border-accent-border focus:outline-none"
          />
          <p className="mt-2 text-xs text-text-muted">
            Modalità locale — senza chiavi OAuth reali. Aggiungi{" "}
            <code className="text-accent">AUTH_GITHUB_ID</code> in{" "}
            <code>.env.local</code> per OAuth vero.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-3">
        <button
          type="button"
          disabled={loading !== null}
          onClick={() =>
            void handleSocial(
              "google",
              providers.google,
              "google-local",
            )
          }
          className="oauth-btn"
        >
          <Mail className="h-4 w-4" />
          {loading === "google"
            ? "Accesso…"
            : providers.google
              ? "Continua con Google"
              : "Continua con Google (locale)"}
        </button>

        <button
          type="button"
          disabled={loading !== null}
          onClick={() =>
            void handleSocial(
              "github",
              providers.github,
              "github-local",
            )
          }
          className="oauth-btn"
        >
          <Code2 className="h-4 w-4" />
          {loading === "github"
            ? "Accesso…"
            : providers.github
              ? "Continua con GitHub"
              : "Continua con GitHub (locale)"}
        </button>

        <div className="relative py-2 text-center text-xs text-text-faint">
          oppure
        </div>

        <button
          type="button"
          disabled={loading !== null}
          onClick={() =>
            signIn("dev-login", {
              email: email.trim() || "dev@limeforge.local",
              callbackUrl,
            })
          }
          className="w-full rounded-xl border border-white/[0.08] bg-bg-surface/60 py-3 text-sm text-text-muted transition hover:border-accent-border hover:text-text-primary"
        >
          Accedi come Dev User
        </button>
      </div>

      {!providers.google && !providers.github && (
        <div className="mt-6 rounded-xl border border-white/[0.06] bg-bg-surface/50 p-4 text-xs text-text-muted">
          <p className="font-medium text-text-primary">OAuth reale (opzionale)</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>
              GitHub:{" "}
              <a
                href="https://github.com/settings/developers"
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                crea OAuth App
              </a>{" "}
              → callback{" "}
              <code className="text-accent">{callbackBase}/github</code>
            </li>
            <li>
              Google:{" "}
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                crea OAuth client
              </a>{" "}
              → callback{" "}
              <code className="text-accent">{callbackBase}/google</code>
            </li>
            <li>Aggiungi le chiavi in .env.local e riavvia il server</li>
          </ol>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-text-muted">
        Solo per sviluppo locale.
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
          Caricamento…
        </div>
      }
    >
      <LoginFormInner providers={providers} callbackBase={callbackBase} />
    </Suspense>
  );
}