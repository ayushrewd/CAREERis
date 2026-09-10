import { NextRequest, NextResponse } from "next/server";
import { trainingOperationsRepository } from "@/server/repositories/trainingOperationsRepository";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const enrollments = await trainingOperationsRepository.getEnrollments(auth.userId);
    return NextResponse.json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const newEnr = await trainingOperationsRepository.createEnrollment({
      candidateId: body.candidateId || auth.userId,
      courseId: body.courseId,
      courseTitle: body.courseTitle,
      batchId: body.batchId,
    });

    return NextResponse.json({ success: true, data: newEnr });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
