"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ExternalLink, Loader2, Save } from "lucide-react";

type Status = {
  authSecret: boolean;
  github: boolean;
  google: boolean;
  groq: boolean;
  anthropic: boolean;
  openai: boolean;
  gemini: boolean;
};

export default function SetupPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [links, setLinks] = useState<{
    githubNewApp: string;
    googleCredentials: string;
  } | null>(null);
  const [callbacks, setCallbacks] = useState<{
    github: string;
    google: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    AUTH_GITHUB_ID: "",
    AUTH_GITHUB_SECRET: "",
    AUTH_GOOGLE_ID: "",
    AUTH_GOOGLE_SECRET: "",
    GROQ_API_KEY: "",
    ANTHROPIC_API_KEY: "",
    OPENAI_API_KEY: "",
    GOOGLE_GENERATIVE_AI_API_KEY: "",
  });

  useEffect(() => {
    void fetch("/api/setup/env")
      .then((r) => r.json())
      .then(
        (d: {
          status: Status;
          links: { githubNewApp: string; googleCredentials: string };
          callbackUrls: { github: string; google: string };
        }) => {
          setStatus(d.status);
          setLinks(d.links);
          setCallbacks(d.callbackUrls);
        },
      );
  }, []);

  async function save() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/setup/env", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      message?: string;
      status?: Status;
    };
    if (data.ok) {
      setStatus(data.status ?? null);
      setMessage(data.message ?? "Salvato!");
    } else {
      setMessage("Errore nel salvataggio.");
    }
    setSaving(false);
  }

  function field(
    key: keyof typeof form,
    label: string,
    placeholder: string,
  ) {
    return (
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
          {label}
        </span>
        <input
          type={key.includes("SECRET") || key.includes("KEY") ? "password" : "text"}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          className="mt-1 w-full rounded-xl border border-white/[0.08] bg-bg-surface/90 px-4 py-2.5 text-sm focus:border-accent-border focus:outline-none"
        />
      </label>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-10">
      <div className="mesh-bg pointer-events-none fixed inset-0" />
      <div className="relative mx-auto max-w-2xl">
        <Link href="/login" className="text-sm text-text-muted hover:text-accent">
          ← Login
        </Link>
        <h1 className="mt-4 font-display text-3xl font-bold">
          Configura <span className="text-gradient">.env.local</span>
        </h1>
        <p className="mt-2 text-text-muted">
          Incolla le chiavi OAuth reali da GitHub e Google. Dopo il salvataggio
          riavvia il server.
        </p>

        {status && (
          <div className="mt-6 flex flex-wrap gap-2">
            {(
              [
                ["GitHub OAuth", status.github],
                ["Google OAuth", status.google],
                ["Groq AI", status.groq],
                ["Anthropic", status.anthropic],
                ["OpenAI", status.openai],
                ["Gemini", status.gemini],
              ] as const
            ).map(([label, ok]) => (
              <span
                key={label}
                className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase ${
                  ok
                    ? "bg-success/15 text-success"
                    : "bg-bg-surface text-text-muted"
                }`}
              >
                {ok ? "✓" : "○"} {label}
              </span>
            ))}
          </div>
        )}

        <section className="glass-card mt-8 space-y-4 p-6">
          <h2 className="font-medium">1. GitHub OAuth (vero)</h2>
          <ol className="list-decimal space-y-1 pl-4 text-sm text-text-muted">
            <li>
              Apri{" "}
              <a
                href={links?.githubNewApp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-accent hover:underline"
              >
                GitHub → New OAuth App <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              Homepage URL: <code className="text-accent">http://localhost:3000</code>
            </li>
            <li>
              Callback:{" "}
              <code className="text-accent">{callbacks?.github}</code>
            </li>
            <li>Copia Client ID e Client Secret qui sotto</li>
          </ol>
          <div className="grid gap-3 sm:grid-cols-2">
            {field("AUTH_GITHUB_ID", "Client ID", "Ov23li...")}
            {field("AUTH_GITHUB_SECRET", "Client Secret", "ghp_... o secret")}
          </div>
        </section>

        <section className="glass-card mt-4 space-y-4 p-6">
          <h2 className="font-medium">2. Google OAuth (vero)</h2>
          <ol className="list-decimal space-y-1 pl-4 text-sm text-text-muted">
            <li>
              Apri{" "}
              <a
                href={links?.googleCredentials}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-accent hover:underline"
              >
                Google Cloud → OAuth Client <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>Tipo: Web application</li>
            <li>
              Authorized redirect URI:{" "}
              <code className="text-accent">{callbacks?.google}</code>
            </li>
            <li>Abilita Google+ API / People API se richiesto</li>
          </ol>
          <div className="grid gap-3 sm:grid-cols-2">
            {field("AUTH_GOOGLE_ID", "Client ID", "xxx.apps.googleusercontent.com")}
            {field("AUTH_GOOGLE_SECRET", "Client Secret", "GOCSPX-...")}
          </div>
        </section>

        <section className="glass-card mt-4 space-y-4 p-6">
          <h2 className="font-medium">3. API keys AI (opzionale)</h2>
          <div className="grid gap-3">
            {field("GROQ_API_KEY", "Groq (gratis)", "gsk_...")}
            {field("ANTHROPIC_API_KEY", "Anthropic", "sk-ant-...")}
            {field("OPENAI_API_KEY", "OpenAI", "sk-...")}
            {field(
              "GOOGLE_GENERATIVE_AI_API_KEY",
              "Gemini",
              "AIza...",
            )}
          </div>
        </section>

        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 font-semibold text-bg-primary hover:bg-accent-soft disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Salva .env.local
        </button>

        {message && (
          <p className="mt-4 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
            <Check className="h-4 w-4" /> {message}
          </p>
        )}
      </div>
    </div>
  );
}