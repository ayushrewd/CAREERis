import { NextRequest, NextResponse } from "next/server";
import { employerProfileService } from "@/server/services/employer/employerProfileService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employerId = searchParams.get("employerId") || "comp-tata-motors";
    const profile = await employerProfileService.getProfile(employerId);
    return NextResponse.json({
      success: true,
      data: {
        organizationUnits: profile.organizationUnits,
        operatingLocations: profile.operatingLocations,
        hiringTeam: profile.hiringTeam,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();
    const employerId = body.employerId || "comp-tata-motors";

    if (body.type === "UNIT") {
      const created = await employerProfileService.addOrganizationUnit(employerId, body.unit, auth);
      return NextResponse.json({ success: true, data: created });
    } else if (body.type === "MEMBER") {
      const created = await employerProfileService.addHiringTeamMember(employerId, body.member, auth);
      return NextResponse.json({ success: true, data: created });
    }

    return NextResponse.json({ success: false, error: "Invalid organization entity type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
