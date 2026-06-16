import { promises as fs } from "fs";
import path from "path";

const ENV_PATH = path.join(process.cwd(), ".env.local");

export type EnvPatch = Record<string, string>;

export async function readEnvFile(): Promise<Record<string, string>> {
  try {
    const raw = await fs.readFile(ENV_PATH, "utf8");
    return parseEnv(raw);
  } catch {
    return {};
  }
}

export async function writeEnvFile(patch: EnvPatch): Promise<void> {
  const current = await readEnvFile();
  const merged = { ...current, ...patch };
  const content = serializeEnv(merged);
  await fs.writeFile(ENV_PATH, content, "utf8");
}

function parseEnv(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const ENV_ORDER = [
  "AUTH_SECRET",
  "AUTH_URL",
  "AUTH_GITHUB_ID",
  "AUTH_GITHUB_SECRET",
  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",
  "GROQ_API_KEY",
  "ANTHROPIC_API_KEY",
  "OPENAI_API_KEY",
  "GOOGLE_GENERATIVE_AI_API_KEY",
  "OLLAMA_BASE_URL",
  "SYNC_API_SECRET",
];

function serializeEnv(vars: Record<string, string>): string {
  const lines: string[] = [
    "# LimeForge — auto-generated. Restart dev server after changes.",
    "",
    "# ── Auth (required) ──",
  ];

  const written = new Set<string>();

  for (const key of ENV_ORDER) {
    if (key in vars) {
      lines.push(`${key}=${vars[key]}`);
      written.add(key);
    }
  }

  for (const [key, val] of Object.entries(vars)) {
    if (!written.has(key)) lines.push(`${key}=${val}`);
  }

  lines.push("");
  return lines.join("\n");
}

export function getEnvStatus(vars: Record<string, string>) {
  return {
    authSecret: Boolean(vars.AUTH_SECRET),
    github: Boolean(vars.AUTH_GITHUB_ID && vars.AUTH_GITHUB_SECRET),
    google: Boolean(vars.AUTH_GOOGLE_ID && vars.AUTH_GOOGLE_SECRET),
    groq: Boolean(vars.GROQ_API_KEY),
    anthropic: Boolean(vars.ANTHROPIC_API_KEY),
    openai: Boolean(vars.OPENAI_API_KEY),
    gemini: Boolean(vars.GOOGLE_GENERATIVE_AI_API_KEY),
  };
}