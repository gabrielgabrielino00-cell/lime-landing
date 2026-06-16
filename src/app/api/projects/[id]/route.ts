import { requireUser } from "@/lib/auth-server";
import { localGetProject, localSaveProject } from "@/lib/local-db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await requireUser();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const project = await localGetProject(ctx.session.user.id, id);
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ project });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await requireUser();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const project = await localGetProject(ctx.session.user.id, id);
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });

  const body = (await request.json()) as Partial<typeof project>;
  const updated = await localSaveProject({ ...project, ...body, id: project.id });
  return Response.json({ project: updated });
}