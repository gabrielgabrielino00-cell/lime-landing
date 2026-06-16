import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { localCreateProject, localListProjects } from "@/lib/local-db";

export default async function AppRedirectPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const projects = await localListProjects(session.user.id);
  const id =
    projects[0]?.id ??
    (await localCreateProject(session.user.id, "My Roblox Project", "claude-sonnet-4-6")).id;

  redirect(`/app/${id}`);
}