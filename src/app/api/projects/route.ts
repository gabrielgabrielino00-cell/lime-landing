import { requireUser } from "@/lib/auth-server";
import {
  localCreateProject,
  localListProjects,
} from "@/lib/local-db";
import type { ModelId } from "@/types/models";

export async function GET() {
  const ctx = await requireUser();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const projects = await localListProjects(ctx.session.user.id);
  return Response.json({ projects });
}

export async function POST(request: Request) {
  const ctx = await requireUser();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    name?: string;
    modelId?: ModelId;
  };

  const existing = await localListProjects(ctx.session.user.id);
  if (ctx.profile.plan === "free" && existing.length >= 5) {
    return Response.json(
      { error: "Free plan allows 5 projects. Upgrade to Pro." },
      { status: 403 },
    );
  }

  const project = await localCreateProject(
    ctx.session.user.id,
    body.name ?? `Project ${existing.length + 1}`,
    body.modelId ?? "claude-sonnet-4-6",
  );

  return Response.json({ project });
}