import { randomBytes } from "crypto";
import { getEnvStatus, readEnvFile, writeEnvFile } from "@/lib/env-file";

function devOnly() {
  return process.env.NODE_ENV === "development";
}

export async function GET() {
  if (!devOnly()) {
    return Response.json({ error: "Not available." }, { status: 404 });
  }
  const vars = await readEnvFile();
  const status = getEnvStatus(vars);
  return Response.json({
    status,
    callbackUrls: {
      github: "http://localhost:3000/api/auth/callback/github",
      google: "http://localhost:3000/api/auth/callback/google",
    },
    links: {
      githubNewApp: "https://github.com/settings/applications/new",
      googleCredentials:
        "https://console.cloud.google.com/apis/credentials/oauthclient",
    },
  });
}

export async function POST(request: Request) {
  if (!devOnly()) {
    return Response.json({ error: "Not available." }, { status: 404 });
  }

  const body = (await request.json()) as Record<string, string | undefined>;

  const current = await readEnvFile();
  const patch: Record<string, string> = {
    AUTH_URL: "http://localhost:3000",
    AUTH_SECRET: current.AUTH_SECRET || randomBytes(32).toString("base64"),
    SYNC_API_SECRET: current.SYNC_API_SECRET || "limeforge-sync-dev-secret",
    OLLAMA_BASE_URL: current.OLLAMA_BASE_URL || "http://127.0.0.1:11434",
  };

  const allowed = [
    "AUTH_GITHUB_ID",
    "AUTH_GITHUB_SECRET",
    "AUTH_GOOGLE_ID",
    "AUTH_GOOGLE_SECRET",
    "GROQ_API_KEY",
    "ANTHROPIC_API_KEY",
    "OPENAI_API_KEY",
    "GOOGLE_GENERATIVE_AI_API_KEY",
  ];

  for (const key of allowed) {
    const val = body[key]?.trim();
    if (val) patch[key] = val;
  }

  await writeEnvFile({ ...current, ...patch });

  const vars = await readEnvFile();
  return Response.json({
    ok: true,
    status: getEnvStatus(vars),
    message: "Salvato. Riavvia il server: Ctrl+C poi npm run dev",
  });
}