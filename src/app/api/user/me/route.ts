import { requireUser } from "@/lib/auth-server";

export async function GET() {
  const ctx = await requireUser();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json({ profile: ctx.profile });
}