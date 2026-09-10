"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowLeft, Plus, CheckCircle2, Building2, MapPin, Award, Users } from "lucide-react";
import Link from "next/link";

export default function EmployerPartnershipsPage() {
  const [partnerships, setPartnerships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/employer/partnerships?employerId=comp-tata-motors")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setPartnerships(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

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
          <h1 className="text-xl font-bold font-heading">Training-to-Hire &amp; Institutional CoE Partnerships</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sponsored ITI Centers of Excellence, Dual-Vocational apprenticeships, and direct talent pipelines
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Loading training partnerships...</div>
      ) : partnerships.length === 0 ? (
        <div className="p-8 text-center border rounded-xl bg-card">
          <GraduationCap className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium">No active training partnerships currently.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {partnerships.map((part) => (
            <Card key={part.id} className="shadow-subtle hover:border-primary/40 transition-all">
              <CardContent className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base">{part.trainingProviderName}</span>
                      <Badge variant="success" className="text-[10px]">{part.status}</Badge>
                      <Badge variant="primary" className="text-[10px]">{part.partnershipType.replace(/_/g, " ")}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 inline" /> {part.instituteDistrict}, {part.instituteState} &bull; MoU Valid: {part.mouSigningDate} to {part.expiryDate}
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-foreground block">{part.hiredFromCohortCount} Hired to Date</span>
                    <span className="text-[10px] text-muted-foreground">from {part.enrolledStudentsCount} enrolled</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
                  {part.details}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-muted-foreground self-center mr-1">Focus Skills:</span>
                  {part.focusSkills?.map((s: any, idx: number) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                      {s.skillName}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
