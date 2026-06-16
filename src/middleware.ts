import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;
  const protectedPrefixes = ["/app", "/dashboard", "/settings"];

  if (protectedPrefixes.some((p) => path.startsWith(p)) && !isLoggedIn) {
    const login = new URL("/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/app/:path*", "/dashboard/:path*", "/settings/:path*"],
};