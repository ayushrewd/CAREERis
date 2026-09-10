import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { clearSessionCookie, getRequestSession } from "@/server/auth/session";

export async function POST(request: NextRequest) {
  const session = getRequestSession(request);
  if (session) await prisma.session.deleteMany({ where: { token: session.sessionId } });
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
