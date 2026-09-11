import { UserRoleType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { calculateWorkforceIntelligence } from "@/server/services/intelligence/prismaWorkforceIntelligenceService";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const district = request.nextUrl.searchParams.get("district");
    return NextResponse.json(await calculateWorkforceIntelligence(auth.userId, auth.userRole as UserRoleType, district));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load intelligence";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}
