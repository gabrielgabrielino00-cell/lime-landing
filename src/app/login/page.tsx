import { getOAuthProviders, OAUTH_CALLBACK_URL } from "@/lib/oauth";
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
            Sign in once.
            <br />
            <span className="text-gradient">Build Luau forever.</span>
          </h1>
          <p className="mt-4 max-w-md text-text-muted">
            Multi-model AI, Monaco editor, version history, and one-click sync
            to Roblox Studio.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-text-muted">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              OAuth via Google or GitHub
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Dev login for local testing
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Free tier — 50 requests / month
            </li>
          </ul>
        </div>

        <LoginForm providers={providers} callbackBase={OAUTH_CALLBACK_URL} />
      </div>
    </div>
  );
}