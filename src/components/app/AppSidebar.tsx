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
    <aside className="flex h-full w-60 flex-col border-r border-bg-elevated bg-bg-secondary">
      <div className="border-b border-bg-elevated p-3">
        <Link href="/" className="font-display text-lg font-bold text-accent">
          LimeForge
        </Link>
        <p className="font-mono text-[10px] text-text-muted">Roblox Studio AI</p>
      </div>

      <div className="p-3">
        <button
          type="button"
          onClick={onCreate}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-2 text-sm font-semibold text-bg-primary hover:bg-accent-soft"
        >
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <p className="px-2 py-1 font-mono text-[10px] uppercase text-text-muted">
          Projects
        </p>
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/app/${p.id}`}
            className={cn(
              "mb-1 block rounded-md px-2 py-2 text-sm",
              p.id === activeProjectId
                ? "bg-accent-dim text-text-primary"
                : "text-text-muted hover:bg-bg-surface",
            )}
          >
            <span className="block truncate font-medium">{p.name}</span>
            <span className="font-mono text-[10px] text-text-faint">{p.modelId}</span>
          </Link>
        ))}

        <div className="mt-4 px-2">
          <p className="mb-2 flex items-center gap-1 font-mono text-[10px] uppercase text-text-muted">
            <FolderTree className="h-3 w-3" /> Studio tree
          </p>
          <ul className="space-y-1 text-xs text-text-muted">
            <li>ServerScriptService/</li>
            <li className="pl-3">Leaderstats.server.lua</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-bg-elevated p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-dim font-bold text-accent">
            {profile.name[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{profile.name}</p>
            <p className="font-mono text-[10px] uppercase text-accent">
              {profile.plan}
            </p>
          </div>
          <Link href="/settings" className="text-text-muted hover:text-accent">
            <Settings className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-text-muted hover:text-error"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}