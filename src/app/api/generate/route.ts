import { streamAI } from "@/lib/ai/stream";
import { requireUser, checkGenerationAllowed, incrementUsage } from "@/lib/auth-server";
import { localGetProject, localSaveProject } from "@/lib/local-db";
import { extractCodeBlock } from "@/lib/mock-ai";
import type { ModelId } from "@/types/models";
import { getModel } from "@/types/models";

const VALID = new Set([
  "claude-sonnet-4-6",
  "claude-opus-4-6",
  "gpt-4o",
  "gemini-1.5-pro",
  "groq-llama",
  "ollama-local",
]);

export async function POST(request: Request) {
  const userCtx = await requireUser();
  if (!userCtx) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: {
    prompt?: string;
    modelId?: ModelId;
    projectId?: string;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  const modelId = body.modelId;
  const projectId = body.projectId;

  if (!prompt || !modelId || !VALID.has(modelId)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  getModel(modelId);

  const allowed = await checkGenerationAllowed(userCtx.profile, modelId);
  if (!allowed.ok) {
    return Response.json(
      { error: allowed.error, code: allowed.code },
      { status: 403 },
    );
  }

  await incrementUsage(
    userCtx.session.user.id,
    userCtx.session.user.email ?? undefined,
    userCtx.session.user.name ?? undefined,
  );

  const encoder = new TextEncoder();
  let full = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamAI(prompt, modelId)) {
          full += chunk;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`),
          );
        }

        if (projectId) {
          const project = await localGetProject(
            userCtx.session.user.id,
            projectId,
          );
          if (project) {
            const code = extractCodeBlock(full);
            project.messages.push({
              id: crypto.randomUUID(),
              role: "user",
              content: prompt,
              createdAt: new Date().toISOString(),
            });
            project.messages.push({
              id: crypto.randomUUID(),
              role: "assistant",
              content: full,
              modelId,
              createdAt: new Date().toISOString(),
            });
            project.output = full;
            project.modelId = modelId;
            if (project.files[0]) project.files[0].content = code;
            project.versions.unshift({
              id: crypto.randomUUID(),
              promptUsed: prompt,
              modelId,
              outputSnapshot: code,
              label: `v${project.versions.length + 1}`,
              createdAt: new Date().toISOString(),
            });
            await localSaveProject(project);
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: "Generation failed." })}\n\n`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}