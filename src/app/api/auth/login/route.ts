import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { verifyPassword } from "@/server/auth/password";
import { createSessionToken, setSessionCookie } from "@/server/auth/session";
import { toAppRole, toPublicUser } from "@/server/auth/publicUser";
import { operationalError } from "@/server/middleware/operationalError";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(128),
  roleType: z.enum(["CANDIDATE", "EMPLOYER", "TRAINING_PROVIDER", "DISTRICT_ADMIN"]).optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      include: {
        candidateProfile: { include: { declaredSkills: true } },
        employerAccount: { select: { companyName: true } },
        trainingProviderAccount: { select: { organizationName: true } },
        governmentPlannerProfile: { select: { departmentName: true } },
      },
    });
    if (!user || !user.isActive || !verifyPassword(parsed.data.password, user.passwordHash)) {
      return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    }
    if (parsed.data.roleType && user.roleType !== parsed.data.roleType) {
      return NextResponse.json({ error: "This account belongs to a different role. Please choose the correct role." }, { status: 403 });
    }

    const session = createSessionToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      userRole: toAppRole(user.roleType),
    });
    await prisma.$transaction([
      prisma.session.create({
        data: {
          userId: user.id,
          token: session.databaseToken,
          userAgent: request.headers.get("user-agent"),
          expiresAt: new Date(session.payload.expiresAt),
        },
      }),
      prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }),
      prisma.session.deleteMany({ where: { userId: user.id, expiresAt: { lt: new Date() } } }),
    ]);

    const response = NextResponse.json({ user: toPublicUser({ ...user, lastLoginAt: new Date() }) });
    setSessionCookie(response, session.token);
    return response;
  } catch (error) {
    return operationalError(error, "Could not sign in. Please try again.");
  }
}
