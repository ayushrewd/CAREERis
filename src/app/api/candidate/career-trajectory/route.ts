import { NextRequest, NextResponse } from "next/server";
import { careerTrajectoryService } from "@/server/services/career/careerTrajectoryService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get("candidateId") || undefined;
    const pathId = searchParams.get("pathId") || undefined;

    if (pathId) {
      const traj = await careerTrajectoryService.getTrajectoryById(pathId);
      return NextResponse.json({ success: true, data: traj });
    }

    const trajectories = await careerTrajectoryService.getCandidateTrajectories(candidateId);
    return NextResponse.json({ success: true, count: trajectories.length, data: trajectories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
