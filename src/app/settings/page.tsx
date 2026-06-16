"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredApiKey, storeApiKey } from "@/lib/api-key-storage";
import type { LocalProfile } from "@/lib/local-db";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(() => getStoredApiKey());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetch("/api/user/me")
      .then((r) => r.json())
      .then((d: { profile: LocalProfile }) => setProfile(d.profile));
  }, []);

  async function upgrade(plan: "pro" | "team") {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = (await res.json()) as { url?: string };
    if (data.url) router.push(data.url);
    setLoading(false);
  }

  async function generateKey() {
    const res = await fetch("/api/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: "Studio Plugin" }),
    });
    const data = (await res.json()) as { key?: string; error?: string };
    if (data.key) {
      setApiKey(data.key);
      storeApiKey(data.key);
    }
    else alert(data.error ?? "Failed");
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center text-text-muted">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-8 md:px-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="text-sm text-text-muted hover:text-accent">
          ← Dashboard
        </Link>
        <h1 className="mt-4 font-display text-3xl font-bold">Settings</h1>

        <section className="mt-8 rounded-lg border border-bg-elevated bg-bg-secondary p-6">
          <h2 className="font-medium">Account</h2>
          <p className="mt-2 text-sm text-text-muted">{profile.email}</p>
          <p className="font-mono text-xs text-accent">
            Plan: {profile.plan} · {profile.requestsUsed}/{profile.requestsLimit}{" "}
            requests
          </p>
        </section>

        <section className="mt-4 rounded-lg border border-bg-elevated bg-bg-secondary p-6">
          <h2 className="font-medium">Upgrade</h2>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => void upgrade("pro")}
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg-primary"
            >
              Pro $12/mo
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => void upgrade("team")}
              className="rounded-md border border-bg-elevated px-4 py-2 text-sm"
            >
              Team $29/mo
            </button>
          </div>
          <p className="mt-2 text-xs text-text-muted">
            Without Stripe keys, upgrade applies instantly (dev mode).
          </p>
        </section>

        <section className="mt-4 rounded-lg border border-bg-elevated bg-bg-secondary p-6">
          <h2 className="font-medium">API key (Studio plugin)</h2>
          <p className="mt-1 text-sm text-text-muted">
            Pro/Team only. Paste into `plugin/LimeForgeStudio.lua`.
          </p>
          <button
            type="button"
            onClick={() => void generateKey()}
            className="mt-3 rounded-md border border-bg-elevated px-4 py-2 text-sm hover:border-accent-border"
          >
            Generate API key
          </button>
          {apiKey && (
            <code className="mt-3 block break-all rounded bg-bg-primary p-3 font-mono text-xs text-success">
              {apiKey}
            </code>
          )}
        </section>

        <section className="mt-4 rounded-lg border border-bg-elevated bg-bg-secondary p-6">
          <h2 className="font-medium">Roblox Studio plugin</h2>
          <p className="mt-1 text-sm text-text-muted">
            File: <code className="text-accent">plugin/LimeForgeStudio.lua</code>
          </p>
          <p className="mt-2 text-xs text-text-muted">
            Set API_KEY, PROJECT_ID, and enable HttpService in Studio game
            settings.
          </p>
        </section>
      </div>
    </div>
  );
}