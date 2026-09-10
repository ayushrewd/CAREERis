import { NextRequest, NextResponse } from "next/server";
import { employerFeedbackAndSurveyService } from "@/server/services/employer/employerFeedbackAndSurveyService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const surveys = await employerFeedbackAndSurveyService.getSurveys(auth.userId);
    return NextResponse.json({ success: true, count: surveys.length, data: surveys });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newSurvey = await employerFeedbackAndSurveyService.submitSurvey(body);
    return NextResponse.json({ success: true, data: newSurvey });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
