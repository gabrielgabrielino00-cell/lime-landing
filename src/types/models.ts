export type ModelId =
  | "claude-sonnet-4-6"
  | "claude-opus-4-6"
  | "gpt-4o"
  | "gemini-1.5-pro"
  | "groq-llama"
  | "ollama-local";

export type ModelProvider =
  | "anthropic"
  | "openai"
  | "google"
  | "groq"
  | "local";

export interface AIModel {
  id: ModelId;
  name: string;
  provider: ModelProvider;
  tags: string[];
  maxTokens: number;
  costPer1kTokens: number;
  requiresPro: boolean;
  latencyMs: number;
  description: string;
}

export const AI_MODELS: AIModel[] = [
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    provider: "anthropic",
    tags: ["FAST", "BALANCED"],
    maxTokens: 200_000,
    costPer1kTokens: 0.003,
    requiresPro: false,
    latencyMs: 800,
    description: "Best default for Luau scripts and fast iteration.",
  },
  {
    id: "claude-opus-4-6",
    name: "Claude Opus 4.6",
    provider: "anthropic",
    tags: ["SMART", "SLOWER"],
    maxTokens: 200_000,
    costPer1kTokens: 0.015,
    requiresPro: false,
    latencyMs: 2400,
    description: "Deep reasoning for complex game systems.",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    tags: ["VERSATILE"],
    maxTokens: 128_000,
    costPer1kTokens: 0.005,
    requiresPro: false,
    latencyMs: 1200,
    description: "Strong generalist for mixed code + docs.",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "google",
    tags: ["LONG CONTEXT"],
    maxTokens: 1_000_000,
    costPer1kTokens: 0.004,
    requiresPro: false,
    latencyMs: 1500,
    description: "Huge context for full game folders.",
  },
  {
    id: "groq-llama",
    name: "Llama 3.3 70B (Groq)",
    provider: "groq",
    tags: ["FREE TIER", "FAST"],
    maxTokens: 32_000,
    costPer1kTokens: 0,
    requiresPro: false,
    latencyMs: 400,
    description: "Free & fast via Groq — great default without Anthropic keys.",
  },
  {
    id: "ollama-local",
    name: "Local (Ollama)",
    provider: "local",
    tags: ["PRIVATE"],
    maxTokens: 32_000,
    costPer1kTokens: 0,
    requiresPro: false,
    latencyMs: 600,
    description: "Run models on your machine. Zero cloud latency.",
  },
];

export function getModel(id: ModelId): AIModel {
  const model = AI_MODELS.find((m) => m.id === id);
  if (!model) throw new Error(`Unknown model: ${id}`);
  return model;
}