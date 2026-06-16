import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ModelId } from "@/types/models";
import { hasAnthropic, hasGoogleAI, hasOpenAI } from "@/lib/env";
import { streamMockResponse } from "@/lib/mock-ai";
import { ROBLOX_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";

export async function* streamAI(
  prompt: string,
  modelId: ModelId,
): AsyncGenerator<string> {
  try {
    if (modelId.startsWith("claude") && hasAnthropic()) {
      yield* streamAnthropic(prompt, modelId);
      return;
    }
    if (modelId === "gpt-4o" && hasOpenAI()) {
      yield* streamOpenAI(prompt);
      return;
    }
    if (modelId === "gemini-1.5-pro" && hasGoogleAI()) {
      yield* streamGemini(prompt);
      return;
    }
    if (modelId === "ollama-local") {
      yield* streamOllama(prompt);
      return;
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "AI provider error";
    yield `**Provider error:** ${msg}\n\nFalling back to demo output:\n\n`;
  }

  yield* streamMockResponse(prompt, modelId);
}

async function* streamAnthropic(prompt: string, modelId: ModelId) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const model =
    modelId === "claude-opus-4-6"
      ? "claude-opus-4-20250514"
      : "claude-sonnet-4-20250514";

  const stream = await client.messages.stream({
    model,
    max_tokens: 4096,
    system: ROBLOX_SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
}

async function* streamOpenAI(prompt: string) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const stream = await client.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    messages: [
      { role: "system", content: ROBLOX_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
  });

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content;
    if (text) yield text;
  }
}

async function* streamGemini(prompt: string) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const result = await model.generateContentStream({
    contents: [
      { role: "user", parts: [{ text: `${ROBLOX_SYSTEM_PROMPT}\n\n${prompt}` }] },
    ],
  });

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}

async function* streamOllama(prompt: string) {
  const base = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
  const res = await fetch(`${base}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      prompt: `${ROBLOX_SYSTEM_PROMPT}\n\n${prompt}`,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) throw new Error("Ollama unavailable");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      const json = JSON.parse(line) as { response?: string };
      if (json.response) yield json.response;
    }
  }
}