import {
  hasAnthropic,
  hasGoogleAI,
  hasGroq,
  hasOpenAI,
} from "@/lib/env";

export async function GET() {
  const providers = {
    anthropic: hasAnthropic(),
    openai: hasOpenAI(),
    google: hasGoogleAI(),
    groq: hasGroq(),
    ollama: Boolean(process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434"),
  };

  const anyReal =
    providers.anthropic ||
    providers.openai ||
    providers.google ||
    providers.groq;

  return Response.json({
    providers,
    mode: anyReal ? "live" : "demo",
    message: anyReal
      ? "Real AI providers connected."
      : "Demo mode — add API keys in .env.local for live models.",
  });
}