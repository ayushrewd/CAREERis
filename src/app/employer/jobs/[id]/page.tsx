"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { platformStore, ApplicationRecord, ApplicationStage } from "@/lib/store/platformStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  FileCheck2,
  ShieldCheck,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  UserCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function EmployerJobPipelinePage() {
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState(platformStore.getJobById(jobId) || platformStore.getJobs()[0]);
  const [applications, setApplications] = useState(platformStore.getApplicationsByJob(jobId));
  const [selectedAppForInterview, setSelectedAppForInterview] = useState<ApplicationRecord | null>(null);
  const [interviewDate, setInterviewDate] = useState("2026-03-05T11:00");
  const [interviewNotes, setInterviewNotes] = useState("Technical Round covering BMS CAN telemetry and high voltage safety.");

  useEffect(() => {
    return platformStore.subscribe(() => {
      setJob(platformStore.getJobById(jobId) || platformStore.getJobs()[0]);
      setApplications(platformStore.getApplicationsByJob(jobId));
    });
  }, [jobId]);

  const handleStageChange = (appId: string, stage: ApplicationStage) => {
    platformStore.updateApplicationStage(appId, stage);
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForInterview) return;

    platformStore.scheduleInterview({
      applicationId: selectedAppForInterview.id,
      scheduledAt: interviewDate,
      durationMinutes: 45,
      format: "TECHNICAL_PANEL",
      locationOrLink: "Tata Motors EV Plant 2, Chakan (Gate 3 Powertrain Lab)",
      interviewerName: "Priya Mehta (Lead Battery Powertrain)",
      notes: interviewNotes,
    });

    setSelectedAppForInterview(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Back button */}
      <div>
        <Button asChild variant="ghost" size="sm" className="text-xs -ml-2 gap-1">
          <Link href="/employer/jobs">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Requisitions
          </Link>
        </Button>
      </div>

      {/* Header Requisition Dossier */}
      <div className="p-6 rounded-2xl border bg-gradient-to-r from-card via-card/90 to-primary/5 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple" className="text-[10px]">
              {job.jobType.replace("_", " ")}
            </Badge>
            <span className="text-xs text-muted-foreground">{job.district}, {job.state}</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            {job.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {job.openPositions} Open Positions &bull; {applications.length} Candidates in Pipeline
          </p>
        </div>

        <Button asChild size="sm" variant="outline" className="text-xs">
          <Link href="/employer/candidates">
            <Users className="w-3.5 h-3.5 mr-1" />
            Source Verified Talent &rarr;
          </Link>
        </Button>
      </div>

      {/* Applicant Pipeline List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span>Active Candidate Applicants ({applications.length})</span>
        </h2>

        {applications.length === 0 ? (
          <EmptyState
            title="No candidates applied yet"
            description="Candidates in the Chakan cluster with matching verified skills will appear here."
            actionLabel="Search Talent Pool"
            onAction={() => {}}
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="border-primary/20 hover:border-primary/40 transition-all">
                <CardContent className="p-5 space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-foreground">
                          {app.candidateName}
                        </h3>
                        <Badge variant="success" className="text-[9px] gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Proctored Verified
                        </Badge>
                        <Badge variant="purple" className="text-[9px]">
                          {app.stage.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-primary font-medium">{app.candidateHeadline}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Applied on {formatDate(app.appliedAt)} &bull; Explainable Skill Fit: <strong>{app.matchScore}%</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black font-heading text-emerald-600 dark:text-emerald-400">
                        {app.matchScore}%
                      </span>
                      <span className="text-[10px] text-muted-foreground block">Readiness Match</span>
                    </div>
                  </div>

                  {app.coverNote && (
                    <div className="p-3 rounded-xl bg-muted/20 border text-[11px] text-muted-foreground">
                      &ldquo;{app.coverNote}&rdquo;
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStageChange(app.id, "SHORTLISTED")}
                        className="text-xs h-7 px-2.5"
                      >
                        <UserCheck className="w-3.5 h-3.5 mr-1" />
                        Shortlist
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedAppForInterview(app)}
                        className="text-xs h-7 px-2.5 text-primary border-primary/30"
                      >
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        Schedule Interview
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStageChange(app.id, "OFFERED")}
                        className="text-xs h-7 px-2.5 text-emerald-600 border-emerald-500/30"
                      >
                        Extend Offer
                      </Button>
                    </div>

                    <Button asChild size="sm" variant="ghost" className="text-xs h-7">
                      <Link href={`/employer/candidates/${app.candidateId}`}>
                        Full Candidate Dossier &rarr;
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      {selectedAppForInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
          <div className="fixed inset-0" onClick={() => setSelectedAppForInterview(null)} />
          <div className="relative w-full max-w-lg bg-card border rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <h3 className="text-lg font-bold font-heading">
              Schedule Technical Interview with {selectedAppForInterview.candidateName}
            </h3>

            <form onSubmit={handleScheduleInterview} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Date &amp; Time</label>
                <input
                  type="datetime-local"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Interview Venue / Link</label>
                <input
                  defaultValue="Tata Motors EV Plant 2, Chakan (Gate 3 Lab)"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Technical Focus &amp; Notes</label>
                <textarea
                  rows={3}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAppForInterview(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="font-semibold">
                  Confirm &amp; Notify Candidate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
