"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { FolderTree, LogOut, Plus, Settings } from "lucide-react";
import type { LocalProfile, LocalProject } from "@/lib/local-db";
import { cn } from "@/lib/cn";

export default function AppSidebar({
  projects,
  activeProjectId,
  profile,
  onCreate,
}: {
  projects: LocalProject[];
  activeProjectId: string;
  profile: LocalProfile;
  onCreate: () => void;
}) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/[0.06] bg-bg-secondary/90 backdrop-blur-sm">
      <div className="border-b border-white/[0.06] p-4">
        <Link href="/" className="font-display text-lg font-bold text-gradient">
          LimeForge
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
          Roblox Studio AI
        </p>
      </div>

      <div className="p-4">
        <button
          type="button"
          onClick={onCreate}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-bg-primary shadow-[0_0_20px_var(--glow)] transition hover:bg-accent-soft"
        >
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <p className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-text-muted">
          Projects
        </p>
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/app/${p.id}`}
            className={cn(
              "mb-1 block rounded-xl px-3 py-2.5 text-sm transition",
              p.id === activeProjectId
                ? "bg-accent-dim text-text-primary ring-1 ring-accent-border/40"
                : "text-text-muted hover:bg-bg-surface/80 hover:text-text-primary",
            )}
          >
            <span className="block truncate font-medium">{p.name}</span>
            <span className="font-mono text-[10px] text-text-faint">
              {p.modelId}
            </span>
          </Link>
        ))}

        <div className="mt-6 px-2">
          <p className="mb-2 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-text-muted">
            <FolderTree className="h-3 w-3" /> Studio tree
          </p>
          <ul className="space-y-1 rounded-xl border border-white/[0.06] bg-bg-primary/50 p-3 text-xs text-text-muted">
            <li>ServerScriptService/</li>
            <li className="pl-3 text-success">Main.server.lua</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06] p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-dim text-sm font-bold text-accent">
            {profile.name[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{profile.name}</p>
            <p className="font-mono text-[10px] uppercase text-accent">
              {profile.plan}
            </p>
          </div>
          <Link
            href="/settings"
            className="text-text-muted transition hover:text-accent"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-text-muted transition hover:text-error"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}