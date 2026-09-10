import { NextRequest, NextResponse } from "next/server";
import { identityService } from "@/server/services/ecosystem/identityService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const memberships = await identityService.getUserMemberships(auth.userId);

    return NextResponse.json({
      success: true,
      data: {
        userId: auth.userId,
        fullName: auth.fullName,
        email: auth.email,
        userRole: auth.userRole,
        memberships,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
