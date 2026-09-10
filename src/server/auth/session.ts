import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@/types";

export const SESSION_COOKIE = "careeris_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export interface SessionPayload {
  sessionId: string;
  userId: string;
  email: string;
  fullName: string;
  userRole: UserRole;
  expiresAt: number;
}

function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET is not configured");
  return value;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createSessionToken(
  user: Pick<SessionPayload, "userId" | "email" | "fullName" | "userRole">
): { token: string; payload: SessionPayload; databaseToken: string } {
  const databaseToken = randomBytes(32).toString("base64url");
  const payload: SessionPayload = {
    ...user,
    sessionId: databaseToken,
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return { token: `${encoded}.${sign(encoded)}`, payload, databaseToken };
}

export function readSessionToken(token?: string): SessionPayload | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = Buffer.from(sign(encoded));
  const actual = Buffer.from(signature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.userId || !payload.sessionId || payload.expiresAt <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getRequestSession(request: NextRequest): SessionPayload | null {
  return readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
