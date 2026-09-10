"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, Plus, ShieldCheck, MapPin, ArrowLeft, Layers } from "lucide-react";
import Link from "next/link";

export default function EmployerOrganizationPage() {
  const [orgData, setOrgData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/employer/organization?employerId=comp-tata-motors")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setOrgData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Loading organization hierarchy...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/employer">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Command Center
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-heading">Organization Units & Hiring Teams</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Multi-location structure: Business Units $\rightarrow$ Plants $\rightarrow$ Recruitment Leads
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Units & Plants */}
        <Card className="shadow-subtle">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-bold">Business Units & Divisions</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Operating plants and R&D centers
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {orgData?.organizationUnits?.map((unit: any) => (
              <div key={unit.id} className="p-4 rounded-xl border bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{unit.name}</span>
                  <Badge variant="secondary" className="text-[9px]">{unit.type}</Badge>
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>Unit Code: <span className="font-mono text-foreground">{unit.code}</span></span>
                  <span>Head: {unit.headOfUnit || "Unit Lead"}</span>
                </div>
                <div className="pt-1 flex items-center justify-between text-xs border-t">
                  <span className="text-[10px] text-primary font-medium">{unit.activeJobCount} active jobs</span>
                  <span className="text-[10px] text-muted-foreground">{unit.workforceCount} workforce</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Hiring Team & Recruiter Roles */}
        <Card className="shadow-subtle">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <CardTitle className="text-sm font-bold">Hiring Team Members</CardTitle>
              </div>
              <CardDescription className="text-xs">
                RBAC assigned recruiters and hiring managers
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {orgData?.hiringTeam?.map((member: any) => (
              <div key={member.id} className="p-4 rounded-xl border bg-card space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{member.fullName}</span>
                  <Badge variant="primary" className="text-[9px]">{member.role}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {member.email} &bull; {member.department}
                </p>
                <div className="pt-1 text-[10px] text-muted-foreground border-t flex items-center justify-between">
                  <span>Assigned Requisitions:</span>
                  <span className="font-bold text-foreground">{member.activeRequisitionsCount} active</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
