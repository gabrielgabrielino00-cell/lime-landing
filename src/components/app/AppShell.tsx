"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/app/AppSidebar";
import ChatPanel from "@/components/app/ChatPanel";
import OutputPanel from "@/components/app/OutputPanel";
import { useProjects } from "@/hooks/useProjects";
import type { LocalProfile } from "@/lib/local-db";

export default function AppShell({ projectId }: { projectId?: string }) {
  const { project, projects, loading, refreshProject, createProject } =
    useProjects(projectId);
  const [profile, setProfile] = useState<LocalProfile | null>(null);

  useEffect(() => {
    void fetch("/api/user/me")
      .then((r) => r.json())
      .then((d: { profile: LocalProfile }) => setProfile(d.profile));
  }, []);

  if (loading || !profile) {
    return (
      <div className="flex h-full items-center justify-center bg-bg-primary text-text-muted">
        Loading workspace…
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-bg-primary">
        <p className="text-text-muted">No project yet.</p>
        <button
          type="button"
          className="rounded-md bg-accent px-4 py-2 font-semibold text-bg-primary"
          onClick={() =>
            void createProject().then((p) => {
              window.location.href = `/app/${p.id}`;
            })
          }
        >
          Create first project
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-bg-primary">
      <AppSidebar
        projects={projects}
        activeProjectId={project.id}
        profile={profile}
        onCreate={() =>
          void createProject().then((p) => {
            window.location.href = `/app/${p.id}`;
          })
        }
      />

      {/* flex row — each column exactly 50% height on screen, never grows with content */}
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col md:flex-row">
        <div className="flex h-[50%] min-h-0 min-w-0 flex-col overflow-hidden border-white/[0.06] md:h-full md:flex-1 md:border-r">
          <ChatPanel
            key={project.id}
            project={project}
            profile={profile}
            onComplete={() => {
              void refreshProject(project.id);
              void fetch("/api/user/me")
                .then((r) => r.json())
                .then((d: { profile: LocalProfile }) => setProfile(d.profile));
            }}
          />
        </div>

        <div className="flex h-[50%] min-h-0 min-w-0 flex-col overflow-hidden md:h-full md:flex-1">
          <OutputPanel
            project={project}
            onSaveFile={async (content) => {
              await fetch(`/api/projects/${project.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  files: project.files.map((f, i) =>
                    i === 0 ? { ...f, content } : f,
                  ),
                }),
              });
              await refreshProject(project.id);
            }}
          />
        </div>
      </div>
    </div>
  );
}