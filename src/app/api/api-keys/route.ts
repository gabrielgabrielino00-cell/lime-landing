import { createHash, randomBytes } from "crypto";
import { requireUser } from "@/lib/auth-server";
import { localCreateApiKey } from "@/lib/local-db";

export async function POST(request: Request) {
  const ctx = await requireUser();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (ctx.profile.plan === "free") {
    return Response.json(
      { error: "API keys require Pro or Team plan." },
      { status: 403 },
    );
  }

  const { label } = (await request.json()) as { label?: string };
  const raw = `lf_${randomBytes(24).toString("hex")}`;
  const keyHash = createHash("sha256").update(raw).digest("hex");

  const row = await localCreateApiKey(
    ctx.session.user.id,
    keyHash,
    raw.slice(0, 12),
    label ?? "Default",
  );

  return Response.json({
    key: raw,
    prefix: row.keyPrefix,
    label: row.label,
    createdAt: row.createdAt,
  });
}