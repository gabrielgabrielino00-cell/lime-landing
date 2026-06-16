export type OAuthProviders = {
  google: boolean;
  github: boolean;
  googleLocal: boolean;
  githubLocal: boolean;
  any: boolean;
};

export function getOAuthProviders(): OAuthProviders {
  const google = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );
  const github = Boolean(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
  );
  return {
    google,
    github,
    googleLocal: !google,
    githubLocal: !github,
    any: true,
  };
}

export const OAUTH_CALLBACK_URL = `${process.env.AUTH_URL ?? "http://localhost:3000"}/api/auth/callback`;