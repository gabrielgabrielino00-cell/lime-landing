"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { LocalProfile, LocalProject } from "@/lib/local-db";

export default function DashboardPage() {
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [projects, setProjects] = useState<LocalProject[]>([]);

  useEffect(() => {
    void fetch("/api/user/me")
      .then((r) => r.json())
      .then((d: { profile: LocalProfile }) => setProfile(d.profile));
    void fetch("/api/projects")
      .then((r) => r.json())
      .then((d: { projects: LocalProject[] }) => setProjects(d.projects));
  }, []);

  async function quickStart(prompt: string) {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Quick session" }),
    });
    const data = (await res.json()) as { project: LocalProject };
    window.location.href = `/app/${data.project.id}?q=${encodeURIComponent(prompt)}`;
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
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-text-muted">Welcome back, {profile.name}</p>
          </div>
          <Link href="/app" className="text-sm text-accent hover:underline">
            Open workspace →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[
            ["Requests", `${profile.requestsUsed}/${profile.requestsLimit}`],
            ["Projects", String(projects.length)],
            ["Top model", "claude-sonnet-4-6"],
            ["Plan", profile.plan],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-bg-elevated bg-bg-secondary p-4"
            >
              <p className="font-mono text-[10px] uppercase text-text-muted">
                {label}
              </p>
              <p className="mt-1 font-display text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-bg-elevated bg-bg-secondary p-4">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Quick prompt</span>
          </div>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              void quickStart(String(fd.get("prompt") ?? ""));
            }}
          >
            <input
              name="prompt"
              placeholder="Generate a round-based lobby system…"
              className="flex-1 rounded-md border border-bg-elevated bg-bg-surface px-3 py-2 text-sm focus:border-accent-border focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg-primary"
            >
              Go
            </button>
          </form>
        </div>

        <h2 className="mt-10 font-display text-xl font-bold">Recent projects</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/app/${p.id}`}
              className="rounded-lg border border-bg-elevated bg-bg-secondary p-4 hover:border-accent-border"
            >
              <p className="font-medium">{p.name}</p>
              <p className="font-mono text-[10px] text-text-muted">{p.modelId}</p>
              <pre className="mt-3 max-h-20 overflow-hidden rounded bg-bg-primary p-2 font-mono text-[10px] text-text-muted">
                {p.files[0]?.content.slice(0, 120) || "No output yet"}
              </pre>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-accent">
                Open <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}