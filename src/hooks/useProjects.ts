"use client";

import { useCallback, useEffect, useState } from "react";
import type { LocalProject } from "@/lib/local-db";
import type { ModelId } from "@/types/models";

export function useProjects(projectId?: string) {
  const [projects, setProjects] = useState<LocalProject[]>([]);
  const [project, setProject] = useState<LocalProject | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/projects");
    if (res.ok) {
      const data = (await res.json()) as { projects: LocalProject[] };
      setProjects(data.projects);
    }
  }, []);

  const refreshProject = useCallback(async (id: string) => {
    const res = await fetch(`/api/projects/${id}`);
    if (res.ok) {
      const data = (await res.json()) as { project: LocalProject };
      setProject(data.project);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      await refresh();
      if (projectId) await refreshProject(projectId);
      setLoading(false);
    })();
  }, [projectId, refresh, refreshProject]);

  const createProject = async (name?: string, modelId?: ModelId) => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, modelId }),
    });
    const data = (await res.json()) as { project?: LocalProject; error?: string };
    if (!res.ok) throw new Error(data.error ?? "Failed to create project");
    await refresh();
    return data.project!;
  };

  return {
    projects,
    project,
    loading,
    refresh,
    refreshProject,
    createProject,
    setProject,
  };
}