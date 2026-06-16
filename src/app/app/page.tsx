"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export default function AppRedirectPage() {
  const router = useRouter();
  const projects = useAppStore((s) => s.projects);
  const createProject = useAppStore((s) => s.createProject);

  useEffect(() => {
    const id = projects[0]?.id ?? createProject();
    router.replace(`/app/${id}`);
  }, [projects, createProject, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-bg-primary text-text-muted">
      Loading workspace…
    </div>
  );
}