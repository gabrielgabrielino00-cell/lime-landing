import AppShell from "@/components/app/AppShell";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <AppShell projectId={projectId} />;
}