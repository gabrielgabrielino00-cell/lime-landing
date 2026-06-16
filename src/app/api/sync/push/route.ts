import { createHash } from "crypto";
import { localFindApiKey, localGetProject, localSaveProject } from "@/lib/local-db";

function hashKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-limeforge-key");
  if (!apiKey) {
    return Response.json({ error: "Missing x-limeforge-key." }, { status: 401 });
  }

  const keyRow = await localFindApiKey(hashKey(apiKey));
  if (!keyRow) {
    return Response.json({ error: "Invalid API key." }, { status: 401 });
  }

  const body = (await request.json()) as {
    projectId?: string;
    files?: Array<{ name: string; content: string; language?: string }>;
  };

  if (!body.projectId) {
    return Response.json({ error: "projectId required." }, { status: 400 });
  }

  const project = await localGetProject(keyRow.userId, body.projectId);
  if (!project) {
    return Response.json({ error: "Project not found." }, { status: 404 });
  }

  if (body.files?.length) {
    project.files = body.files.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      language: f.language ?? "lua",
      content: f.content,
    }));
    if (project.files[0]) {
      project.output = project.files[0].content;
    }
  }

  await localSaveProject(project);

  return Response.json({
    ok: true,
    syncedAt: new Date().toISOString(),
    fileCount: project.files.length,
  });
}