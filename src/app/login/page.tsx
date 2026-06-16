import { getOAuthProviders } from "@/lib/oauth";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const providers = getOAuthProviders();

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-primary">
      <div className="mesh-bg pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-4 py-12 lg:grid-cols-2 lg:px-8">
        <div className="hidden lg:block">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            LimeForge workspace
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight">
            Build Luau
            <br />
            <span className="text-gradient">faster than you think.</span>
          </h1>
          <p className="mt-4 max-w-md text-text-muted">
            Multi-model AI, Monaco editor, version history, and one-click sync
            to Roblox Studio.
          </p>
        </div>

        <LoginForm providers={providers} />
      </div>
    </div>
  );
}