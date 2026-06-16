import { auth, signIn } from "@/auth";
import { getOAuthProviders } from "@/lib/oauth";
import LoginForm from "@/components/auth/LoginForm";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/app";
  const providers = getOAuthProviders();
  const session = await auth();

  if (session) redirect(callbackUrl);

  const autoLogin =
    process.env.NODE_ENV === "development" &&
    process.env.LOCAL_AUTO_LOGIN !== "false" &&
    !providers.any &&
    !params.error;

  if (autoLogin) {
    await signIn("dev-login", {
      email: "creator@limeforge.local",
      redirectTo: callbackUrl,
    });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-primary">
      <div className="mesh-bg pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-4 py-12 lg:grid-cols-2 lg:px-8">
        <div className="hidden lg:block">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            LimeForge workspace
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight">
            Pronto a costruire.
            <br />
            <span className="text-gradient">Clicca e entra.</span>
          </h1>
          <p className="mt-4 max-w-md text-text-muted">
            In locale non serve configurare nulla — un click e sei dentro
            l&apos;workspace AI per Roblox Studio.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-text-muted">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Accesso automatico in locale
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Tutti i modelli AI sbloccati
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Sync Roblox Studio via plugin
            </li>
          </ul>
        </div>

        <LoginForm
          providers={providers}
          callbackUrl={callbackUrl}
          localMode={!providers.any}
        />
      </div>
    </div>
  );
}