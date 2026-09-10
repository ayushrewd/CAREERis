"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, CheckCircle2, MessageSquare, ArrowLeft, Plus, Award, Star } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function EmployerInterviewsPage() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [feedbackScore, setFeedbackScore] = useState(5);
  const [recommendation, setRecommendation] = useState("STRONG_HIRE");
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/employer/interviews")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setInterviews(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterview) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/employer/interviews/${selectedInterview.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedback: {
            overallScore: feedbackScore,
            recommendation,
            evaluations: [
              { criteriaName: "TECHNICAL_SKILL", score: feedbackScore, feedbackComment: feedbackText },
              { criteriaName: "PROBLEM_SOLVING", score: feedbackScore, feedbackComment: "Evaluated during scenario analysis" },
            ],
            summaryComments: feedbackText,
            assessedSkills: [
              { skillId: "skill-bms", skillName: "Battery Management Systems (BMS)", assessedProficiency: "ADVANCED" },
            ],
          },
        }),
      }).then((r) => r.json());

      if (res.success) {
        setInterviews((prev) =>
          prev.map((i) => (i.id === selectedInterview.id ? { ...i, status: "COMPLETED", feedback: res.data.feedback } : i))
        );
        setSelectedInterview(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/employer">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Command Center
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Interview Management & Panel Evaluation</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Multi-round interview scheduling with structured diagnostic scoring rubrics
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Loading interview panels...</div>
      ) : interviews.length === 0 ? (
        <div className="p-8 text-center border rounded-xl bg-card">
          <Calendar className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium">No scheduled interviews currently.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((int) => (
            <Card key={int.id} className="shadow-subtle hover:border-primary/40 transition-all">
              <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-base">{int.candidateName}</span>
                    <Badge variant={int.status === "COMPLETED" ? "success" : int.status === "CONFIRMED" ? "primary" : "secondary"} className="text-[10px]">
                      {int.status}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      Round {int.roundNumber}: {int.roundName}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Requisition: <span className="text-foreground font-medium">{int.jobTitle}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(int.scheduledAt).toLocaleString("en-IN")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {int.durationMinutes} mins ({int.format})
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      Interviewer: {int.interviewerName}
                    </span>
                  </div>

                  {int.feedback && (
                    <div className="p-3 rounded-xl border bg-emerald-500/5 text-emerald-900 dark:text-emerald-300 text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold">
                        <span>Recommendation: {int.feedback.recommendation.replace(/_/g, " ")}</span>
                        <span>Score: {int.feedback.overallScore}/5</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{int.feedback.summaryComments}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!int.feedback && int.status !== "CANCELLED" && (
                    <Button size="sm" className="text-xs gap-1" onClick={() => setSelectedInterview(int)}>
                      <Star className="w-3.5 h-3.5" /> Evaluate &amp; Score
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Evaluation Rubric Modal */}
      {selectedInterview && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-xl border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">
                Submit Structured Evaluation: {selectedInterview.candidateName}
              </CardTitle>
              <CardDescription className="text-xs">
                Round {selectedInterview.roundNumber}: {selectedInterview.roundName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold block">Overall Technical &amp; Role Score (1 - 5)</label>
                  <select
                    className="w-full p-2 rounded-lg border bg-card text-xs focus:outline-none"
                    value={feedbackScore}
                    onChange={(e) => setFeedbackScore(parseInt(e.target.value))}
                  >
                    <option value={5}>5 - Strong Hire (Exceeds benchmarks)</option>
                    <option value={4}>4 - Hire (Meets all technical competencies)</option>
                    <option value={3}>3 - Neutral (Borderline competencies)</option>
                    <option value={2}>2 - Do Not Hire (Significant gaps)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold block">Recommendation</label>
                  <select
                    className="w-full p-2 rounded-lg border bg-card text-xs focus:outline-none"
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                  >
                    <option value="STRONG_HIRE">STRONG HIRE</option>
                    <option value="HIRE">HIRE</option>
                    <option value="NEUTRAL">NEUTRAL / RE-ASSESS</option>
                    <option value="DO_NOT_HIRE">DO NOT HIRE</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold block">Technical Assessment Summary &amp; Observations</label>
                  <textarea
                    rows={3}
                    placeholder="E.g. Demonstrated thorough grasp of CAN DBC parsing, passed high-voltage test bench validation..."
                    className="w-full p-2.5 rounded-lg border bg-card text-xs focus:outline-none"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <Button type="button" variant="outline" size="sm" onClick={() => setSelectedInterview(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={submitting}>
                    {submitting ? "Submitting..." : "Save Evaluation"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
