import { NextRequest, NextResponse } from "next/server";

const candidatePages = ["/candidate/profile", "/candidate/goals", "/candidate/quiz", "/candidate/readiness", "/candidate/learning", "/candidate/projects", "/candidate/skill-passport", "/candidate/applications", "/candidate/jobs", "/candidate/messages", "/candidate/skills", "/candidate/assessments"];
const employerPages = ["/employer/profile", "/employer/jobs", "/employer/feedback", "/employer/company"];
const providerPages = ["/training-provider/profile", "/training-provider/courses", "/training-provider/curriculum", "/training-provider/trainers", "/training-provider/equipment"];
const governmentPages = ["/government/skill-gaps", "/government/district-plans"];

function matches(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/v1/") || pathname.startsWith("/api/intelligence/") || pathname.startsWith("/api/training/")) {
    return NextResponse.json({ error: "This legacy demo endpoint is not available in production." }, { status: 410 });
  }
  const operationalCandidateApis = ["/api/candidate/profile", "/api/candidate/goals", "/api/candidate/diagnostic", "/api/candidate/readiness", "/api/candidate/learning-path", "/api/candidate/projects", "/api/candidate/skill-passport", "/api/candidate/applications", "/api/candidate/role-evidence"];
  const operationalEmployerApis = ["/api/employer/profile", "/api/employer/feedback", "/api/employer/jobs", "/api/employer/projects"];
  const operationalGovernmentApis = ["/api/government/district-intelligence", "/api/government/district-plans"];
  const operationalProviderApis = ["/api/training-provider/profile", "/api/training-provider/courses", "/api/training-provider/trainers", "/api/training-provider/equipment"];
  if (pathname.startsWith("/api/candidate/") && !matches(pathname, operationalCandidateApis)) return NextResponse.json({ error: "This legacy candidate endpoint is not available in production." }, { status: 410 });
  if (pathname.startsWith("/api/employer/") && !matches(pathname, operationalEmployerApis)) return NextResponse.json({ error: "This legacy company endpoint is not available in production." }, { status: 410 });
  if (pathname.startsWith("/api/government/") && !matches(pathname, operationalGovernmentApis)) return NextResponse.json({ error: "This legacy government endpoint is not available in production." }, { status: 410 });
  if (pathname.startsWith("/api/training-provider/") && !matches(pathname, operationalProviderApis)) return NextResponse.json({ error: "This legacy provider endpoint is not available in production." }, { status: 410 });

  if (pathname.startsWith("/candidate/") && !matches(pathname, candidatePages)) {
    return NextResponse.redirect(new URL("/candidate/profile", request.url));
  }
  if (pathname.startsWith("/employer/") && !matches(pathname, employerPages)) {
    return NextResponse.redirect(new URL("/employer/jobs", request.url));
  }
  if (pathname.startsWith("/training-provider/") && !matches(pathname, providerPages)) {
    return NextResponse.redirect(new URL("/training-provider", request.url));
  }
  if (pathname.startsWith("/government/") && !matches(pathname, governmentPages)) {
    return NextResponse.redirect(new URL("/government/skill-gaps", request.url));
  }
  if (["/insights", "/career-paths", "/copilot", "/partners", "/training"].some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/candidate/:path*", "/employer/:path*", "/training-provider/:path*", "/government/:path*", "/insights/:path*", "/career-paths/:path*", "/copilot", "/partners/:path*", "/training/:path*"],
};
