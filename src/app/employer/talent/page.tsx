"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, UserPlus, Star, MapPin } from "lucide-react";
import Link from "next/link";

export default function EmployerTalentPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/employer/requisitions/req-tata-ev-01/candidates")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCandidates(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <Users className="w-3.5 h-3.5 mr-1" /> TALENT DISCOVERY &amp; TRAINABILITY
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Verified Candidates, Match Breakdown &amp; Trainability Index
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Discover verified Skill Passport holders matched against active requisitions with transparent fit explanations
          </p>
        </div>

        <Button asChild size="sm" className="gap-1.5 text-xs">
          <Link href="/employer/copilot">
            <Sparkles className="w-3.5 h-3.5" /> AI Recruiter Copilot
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {candidates.map((c) => (
          <Card key={c.candidateId} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={c.classification === "STRONG_MATCH" ? "success" : "warning"} className="text-[10px] font-mono">
                    {c.matchScore}% {c.classification}
                  </Badge>
                  {c.hasVerifiedPassport && (
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                      ✓ ASDC Verified
                    </Badge>
                  )}
                  <CardTitle className="text-base font-bold">{c.candidateName}</CardTitle>
                </div>
                <CardDescription className="text-xs pt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary" /> {c.district}, {c.state} &bull; Evidence Strength: {c.evidenceStrength}%
                </CardDescription>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs h-8">
                  View Passport
                </Button>
                <Button size="sm" className="text-xs h-8 gap-1">
                  <UserPlus className="w-3.5 h-3.5" /> Shortlist
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-2.5 text-xs">
              <div className="flex flex-wrap gap-1">
                <span className="font-bold text-foreground mr-1">Matched Skills:</span>
                {c.matchedSkills?.map((s: string) => (
                  <Badge key={s} variant="secondary" className="text-[9px]">✓ {s}</Badge>
                ))}
              </div>

              {c.missingSkills?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="font-bold text-foreground mr-1">Missing / Gap Skills:</span>
                  {c.missingSkills?.map((s: string) => (
                    <Badge key={s} variant="warning" className="text-[9px]">! {s}</Badge>
                  ))}
                </div>
              )}

              <div className="p-2 rounded bg-muted/30 border text-[11px] flex justify-between items-center">
                <span><strong>Trainability Index:</strong> {c.trainabilityIndex}/100</span>
                <span className="text-muted-foreground">Estimated Ramp: 4 Weeks via ITI Aundh COE</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
