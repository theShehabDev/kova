// Referral capture: moves ?ref=CODE into a cookie.
import { NextResponse } from "next/server";

const COOKIE = "kova_ref";
const MAX_AGE = 60 * 60 * 24 * 60; // 60 days, matching KOVA_REF_DAYS in PHP

export function middleware(request) {
  const params = request.nextUrl.searchParams;

  if (params.has("kova-cart") || params.has("wc-ajax")) {
    return NextResponse.next();
  }

  const code = params.get("ref");
  if (!code) {
    return NextResponse.next();
  }

  const clean = code.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 16);
  if (!clean) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.searchParams.delete("ref");

  const response = NextResponse.redirect(url);
  response.cookies.set(COOKIE, clean, {
    maxAge: MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|cards|api).*)"],
};
