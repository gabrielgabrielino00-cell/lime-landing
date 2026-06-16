import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { getOAuthProviders } from "@/lib/oauth";

const oauth = getOAuthProviders();

function devSocialUser(provider: "google" | "github", email: string) {
  const clean = email.trim().toLowerCase();
  if (!clean.includes("@")) return null;
  const name = clean.split("@")[0] ?? "User";
  return {
    id: `${provider}-${clean}`,
    email: clean,
    name: name.charAt(0).toUpperCase() + name.slice(1),
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    ...(oauth.google
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            authorization: { params: { prompt: "select_account" } },
          }),
        ]
      : [
          Credentials({
            id: "google-local",
            name: "Google",
            credentials: {
              email: { label: "Email", type: "email" },
            },
            async authorize(credentials) {
              const email = String(credentials?.email ?? "");
              return devSocialUser("google", email);
            },
          }),
        ]),
    ...(oauth.github
      ? [
          GitHub({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
          }),
        ]
      : [
          Credentials({
            id: "github-local",
            name: "GitHub",
            credentials: {
              email: { label: "Email", type: "email" },
            },
            async authorize(credentials) {
              const email = String(credentials?.email ?? "");
              return devSocialUser("github", email);
            },
          }),
        ]),
    Credentials({
      id: "dev-login",
      name: "Dev Login",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "dev@limeforge.local");
        return {
          id: `local-${email}`,
          email,
          name: email.split("@")[0] ?? "Creator",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider && account.provider !== "credentials") {
          token.id = `${account.provider}-${account.providerAccountId ?? user.id}`;
        } else {
          token.id = user.id ?? `local-${user.email}`;
        }
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = (token.email as string) ?? session.user.email;
        session.user.name = (token.name as string) ?? session.user.name;
      }
      return session;
    },
  },
});