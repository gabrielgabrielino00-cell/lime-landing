import { auth } from "@/auth";
import {
  localGetOrCreateProfile,
  localUpdateProfile,
  type LocalProfile,
} from "@/lib/local-db";
import { getModel } from "@/types/models";
import type { ModelId } from "@/types/models";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const profile = await localGetOrCreateProfile(
    session.user.id,
    session.user.email ?? "user@limeforge.local",
    session.user.name ?? "User",
  );
  return { session, profile };
}

export async function checkGenerationAllowed(
  profile: LocalProfile,
  modelId: ModelId,
) {
  const model = getModel(modelId);
  if (model.requiresPro && profile.plan === "free") {
    return { ok: false as const, error: "This model requires a Pro plan.", code: "PRO_REQUIRED" };
  }
  if (profile.requestsUsed >= profile.requestsLimit) {
    return {
      ok: false as const,
      error: "Monthly request limit reached. Upgrade to Pro.",
      code: "RATE_LIMIT",
    };
  }
  const freeModels = new Set<ModelId>(["claude-sonnet-4-6", "groq-llama"]);
  if (profile.plan === "free" && !freeModels.has(modelId)) {
    return {
      ok: false as const,
      error: "Free plan supports Claude Sonnet and Groq Llama only.",
      code: "MODEL_LOCKED",
    };
  }
  return { ok: true as const };
}

export async function incrementUsage(userId: string, email?: string, name?: string) {
  const profile = await localGetOrCreateProfile(
    userId,
    email ?? "user@limeforge.local",
    name ?? "User",
  );
  return localUpdateProfile(userId, {
    requestsUsed: profile.requestsUsed + 1,
  });
}