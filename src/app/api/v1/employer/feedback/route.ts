import { NextRequest, NextResponse } from "next/server";
import { employerFeedbackAndSurveyService } from "@/server/services/employer/employerFeedbackAndSurveyService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const feedback = await employerFeedbackAndSurveyService.getPlacementFeedback(auth.userId);
    return NextResponse.json({ success: true, count: feedback.length, data: feedback });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newFeedback = await employerFeedbackAndSurveyService.submitPlacementFeedback(body);
    return NextResponse.json({ success: true, data: newFeedback });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
