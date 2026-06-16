"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";

export default function SettingsPage() {
  const user = useAppStore((s) => s.user);
  const setPlan = useAppStore((s) => s.setPlan);

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-8 md:px-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="text-sm text-text-muted hover:text-accent">
          ← Dashboard
        </Link>
        <h1 className="mt-4 font-display text-3xl font-bold">Settings</h1>

        <section className="mt-8 rounded-lg border border-bg-elevated bg-bg-secondary p-6">
          <h2 className="font-medium">Account</h2>
          <p className="mt-2 text-sm text-text-muted">{user.email}</p>
          <p className="font-mono text-xs text-accent">Plan: {user.plan}</p>
        </section>

        <section className="mt-4 rounded-lg border border-bg-elevated bg-bg-secondary p-6">
          <h2 className="font-medium">Dev plan toggle</h2>
          <p className="mt-1 text-sm text-text-muted">Unlock Pro models locally.</p>
          <div className="mt-3 flex gap-2">
            {(["free", "pro", "team"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlan(p)}
                className={`rounded px-3 py-1.5 font-mono text-xs uppercase ${
                  user.plan === p
                    ? "bg-accent text-bg-primary"
                    : "border border-bg-elevated text-text-muted"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-lg border border-bg-elevated bg-bg-secondary p-6">
          <h2 className="font-medium">API key</h2>
          <p className="mt-1 text-sm text-text-muted">Pro feature — generate for REST sync.</p>
          <code className="mt-3 block rounded bg-bg-primary p-3 font-mono text-xs text-text-muted">
            lf_dev_••••••••••••••••
          </code>
        </section>
      </div>
    </div>
  );
}