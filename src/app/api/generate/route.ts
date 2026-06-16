import { streamMockResponse } from "@/lib/mock-ai";
import type { ModelId } from "@/types/models";
import { getModel } from "@/types/models";

const VALID_MODELS = new Set([
  "claude-sonnet-4-6",
  "claude-opus-4-6",
  "gpt-4o",
  "gemini-1.5-pro",
  "ollama-local",
]);

export async function POST(request: Request) {
  let body: { prompt?: string; modelId?: ModelId; plan?: string };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  const modelId = body.modelId;

  if (!prompt) {
    return Response.json({ error: "Prompt is required." }, { status: 400 });
  }

  if (!modelId || !VALID_MODELS.has(modelId)) {
    return Response.json({ error: "Invalid model." }, { status: 400 });
  }

  const model = getModel(modelId);
  const plan = body.plan ?? "free";

  if (model.requiresPro && plan === "free") {
    return Response.json(
      { error: "This model requires a Pro plan.", code: "PRO_REQUIRED" },
      { status: 403 },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamMockResponse(prompt, modelId)) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`),
          );
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