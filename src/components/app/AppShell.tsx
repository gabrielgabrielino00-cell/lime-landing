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
      <div className="flex h-screen items-center justify-center bg-bg-primary text-text-muted">
        Loading workspace…
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-bg-primary">
        <p className="text-text-muted">No project yet.</p>
        <button
          type="button"
          className="rounded-md bg-accent px-4 py-2 font-semibold text-bg-primary"
          onClick={() => void createProject().then((p) => {
            window.location.href = `/app/${p.id}`;
          })}
        >
          Create first project
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
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
      <div className="grid min-w-0 flex-1 grid-cols-1 lg:grid-cols-2">
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
  );
}