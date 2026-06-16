import { createHash } from "crypto";
import { localFindApiKey, localGetProject } from "@/lib/local-db";

function hashKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

export async function GET(request: Request) {
  const apiKey = request.headers.get("x-limeforge-key");
  const projectId = request.headers.get("x-project-id");

  if (!apiKey || !projectId) {
    return Response.json({ error: "Missing headers." }, { status: 400 });
  }

  const keyRow = await localFindApiKey(hashKey(apiKey));
  if (!keyRow) {
    return Response.json({ error: "Invalid API key." }, { status: 401 });
  }

  const project = await localGetProject(keyRow.userId, projectId);
  if (!project) {
    return Response.json({ error: "Project not found." }, { status: 404 });
  }

  return Response.json({
    projectId: project.id,
    updatedAt: project.updatedAt,
    files: project.files,
    output: project.output,
  });
}