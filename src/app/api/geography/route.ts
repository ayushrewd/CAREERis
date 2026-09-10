import { NextResponse } from "next/server";
import { getAllStates, getDistrictsByStateId, getClustersByDistrictId, searchGeography } from "@/lib/geography";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const stateId = searchParams.get("stateId");
  const districtId = searchParams.get("districtId");

  if (q) {
    const results = searchGeography(q);
    return NextResponse.json(results);
  }

  if (districtId) {
    const clusters = getClustersByDistrictId(districtId);
    return NextResponse.json({ clusters });
  }

  if (stateId) {
    const districts = getDistrictsByStateId(stateId);
    return NextResponse.json({ districts });
  }

  const states = getAllStates();
  return NextResponse.json({ states });
}
