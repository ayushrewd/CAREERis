import { NextRequest, NextResponse } from "next/server";
import { getCandidateEvidence, hasProjectEvidence } from "@/server/candidate/evidence";
import { resolveAuthContext } from "@/server/middleware/authContext";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const profile = await getCandidateEvidence(auth.userId);
    return NextResponse.json({
      candidate: { name: profile.user.fullName, location: profile.location, education: profile.educationSummary, qualification: profile.qualification },
      skills: profile.declaredSkills.map((skill) => {
        const project = hasProjectEvidence(skill);
        const assessment = skill.assessedAt !== null;
        const passed = skill.assessmentPassed === true;
        const status = project ? "VERIFIED" : passed ? "PASSED" : assessment ? "FAILED" : "UNVERIFIED";
        return {
          id: skill.id, name: skill.name, status,
          assessedScore: skill.assessedScore, assessedAt: skill.assessedAt,
          assessmentPassed: skill.assessmentPassed, passThreshold: skill.passThreshold,
          claimedProficiency: skill.claimedProficiency, trainingStatus: skill.trainingStatus, projectEvidence: project,
          evidenceSummary: passed && project ? "Passing assessment plus employer-verified project evidence"
            : project ? "Employer-verified project evidence" : passed ? "Passing assessment evidence" : assessment ? "Assessment failed; skill gap remains" : skill.trainingStatus === "COMPLETED" ? "Training completed; independent verification is still required" : "Declared; not assessed",
        };
      }),
      projects: profile.projects.map((project) => ({
        id: project.id, title: project.title, repositoryUrl: project.repositoryUrl,
        repositoryReachable: project.repositoryReachable, evidenceStatus: project.evidenceStatus, verificationStatus: project.verificationStatus,
        verificationMethod: project.verificationMethod, verificationReason: project.verificationReason, verifiedAt: project.verifiedAt,
        repositoryOwner: project.repositoryOwner, repositoryLanguages: project.repositoryLanguages, readmePresent: project.readmePresent, technologies: project.technologies,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load skill passport";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}
