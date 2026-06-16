"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function DashboardPage() {
  const user = useAppStore((s) => s.user);
  const projects = useAppStore((s) => s.projects);
  const createProject = useAppStore((s) => s.createProject);

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-text-muted">Welcome back, {user.name}</p>
          </div>
          <Link href="/app" className="text-sm text-accent hover:underline">
            Open workspace →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[
            ["Requests", `${user.requestsUsed}/${user.requestsLimit}`],
            ["Projects", String(projects.length)],
            ["Top model", "claude-sonnet-4-6"],
            ["Plan", user.plan],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-bg-elevated bg-bg-secondary p-4"
            >
              <p className="font-mono text-[10px] uppercase text-text-muted">{label}</p>
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
              const prompt = String(fd.get("prompt") ?? "");
              const id = createProject("Quick session");
              window.location.href = `/app/${id}?q=${encodeURIComponent(prompt)}`;
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
              className="rounded-lg border border-bg-elevated bg-bg-secondary p-4 transition hover:border-accent-border"
            >
              <p className="font-medium">{p.name}</p>
              <p className="mt-1 font-mono text-[10px] text-text-muted">
                {p.modelId} · {new Date(p.updatedAt).toLocaleDateString()}
              </p>
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