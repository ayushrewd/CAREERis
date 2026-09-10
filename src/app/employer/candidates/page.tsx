"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ShieldCheck, Award, ArrowLeft, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";

export default function EmployerCandidateSearchPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("BEST_MATCH");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`/api/employer/candidates/search?sortBy=${sortBy}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCandidates(res.data || []);
      })
      .finally(() => setLoading(false));
  }, [sortBy]);

  const filtered = candidates.filter((c) =>
    c.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.matchingSkills?.some((s: any) => s.skillName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          <h1 className="text-xl font-bold font-heading">Candidate Discovery & Explainable Match</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Grounded in 7-Factor Skill Graph verification & National Skill Registry credentials
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search candidates by name, competency, or certification..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Sort by:</span>
          <select
            className="text-xs py-2 px-3 rounded-xl border bg-card focus:outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="BEST_MATCH">Best Explainable Match</option>
            <option value="SKILL_MATCH">Skill Coverage</option>
            <option value="EVIDENCE">Evidence Strength</option>
            <option value="LOCATION">Location Proximity</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Searching candidates...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center border rounded-xl bg-card">
          <p className="text-sm font-medium">No candidate matches found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((cand) => (
            <Card key={cand.candidateId} className="shadow-subtle hover:border-primary/40 transition-all">
              <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-base">{cand.candidateName}</span>
                    {cand.isVerifiedSkillPassportHolder && (
                      <Badge variant="success" className="text-[10px] gap-1">
                        <Award className="w-3 h-3" /> Skill Passport ({cand.passportBadgeCount} Badges)
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {cand.currentDistrict}, {cand.currentState}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">{cand.headline}</p>

                  {/* Matching Strengths */}
                  <div className="space-y-1 pt-1">
                    {cand.whyThisCandidateMatches?.slice(0, 2).map((reason: string, idx: number) => (
                      <p key={idx} className="text-[11px] text-foreground font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        {reason}
                      </p>
                    ))}
                  </div>

                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cand.matchingSkills?.map((s: any, idx: number) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        {s.skillName} ({s.claimedProficiency}) {s.hasEvidence ? "✓ Verified" : ""}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-emerald-600 font-mono">
                      {cand.overallMatchScore}%
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      7-Factor Match
                    </span>
                  </div>
                  <Link href={`/employer/candidates/${cand.candidateId}`}>
                    <Button size="sm" className="text-xs gap-1">
                      Match Dossier <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
