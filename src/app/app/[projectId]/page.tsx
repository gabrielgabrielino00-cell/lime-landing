import { Suspense } from "react";
import AppShell from "@/components/app/AppShell";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center bg-bg-primary text-text-muted">
          Loading workspace…
        </div>
      }
    >
      <AppShell projectId={projectId} />
    </Suspense>
  );
}