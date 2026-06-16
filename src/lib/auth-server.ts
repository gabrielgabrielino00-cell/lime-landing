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
  getModel(modelId);

  if (profile.requestsUsed >= profile.requestsLimit) {
    return {
      ok: false as const,
      error: "Limite richieste raggiunto. Vai in Settings → Upgrade Pro.",
      code: "RATE_LIMIT",
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