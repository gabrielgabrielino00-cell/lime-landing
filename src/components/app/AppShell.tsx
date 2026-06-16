"use client";

import { useEffect } from "react";
import AppSidebar from "@/components/app/AppSidebar";
import ChatPanel from "@/components/app/ChatPanel";
import OutputPanel from "@/components/app/OutputPanel";
import { useAppStore } from "@/lib/store";

export default function AppShell({ projectId }: { projectId?: string }) {
  const setActiveProject = useAppStore((s) => s.setActiveProject);
  const projects = useAppStore((s) => s.projects);

  useEffect(() => {
    if (projectId) {
      setActiveProject(projectId);
    } else if (projects[0]) {
      setActiveProject(projects[0].id);
    }
  }, [projectId, projects, setActiveProject]);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <AppSidebar />
      <div className="grid min-w-0 flex-1 grid-cols-1 lg:grid-cols-2">
        <ChatPanel />
        <OutputPanel />
      </div>
    </div>
  );
}