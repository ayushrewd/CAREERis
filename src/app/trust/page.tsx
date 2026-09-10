"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, CheckCircle2, Eye, Database, Sparkles, Scale } from "lucide-react";
import Link from "next/link";

export default function PublicTrustCenterPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="text-center max-w-2xl mx-auto space-y-2 py-4">
        <Badge variant="outline" className="text-xs text-primary border-primary/30">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" /> CareerIS Trust &amp; Governance Architecture
        </Badge>
        <h1 className="text-2xl font-bold font-heading">Public Trust, Privacy &amp; Data Provenance Center</h1>
        <p className="text-xs text-muted-foreground">
          How CareerIS guarantees candidate privacy, verifies tamper-proof digital credentials, and enforces explainable statistical forecasting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-subtle">
          <CardHeader className="pb-2">
            <Lock className="w-6 h-6 text-primary mb-1" />
            <CardTitle className="text-base font-bold">Zero-PII Public Verification</CardTitle>
            <CardDescription className="text-xs">
              Public verification links expose only minimal cryptographic authenticity metadata without revealing contact information.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="pb-2">
            <Eye className="w-6 h-6 text-emerald-600 mb-1" />
            <CardTitle className="text-base font-bold">Purpose-Bound Revocable Consent</CardTitle>
            <CardDescription className="text-xs">
              Candidates maintain complete control over which employers can view their Skill Passport with 1-click instant revocation.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="pb-2">
            <Database className="w-6 h-6 text-amber-500 mb-1" />
            <CardTitle className="text-base font-bold">Data Provenance &amp; Quarantine</CardTitle>
            <CardDescription className="text-xs">
              External data is never inserted blindly; untrusted or conflicting records are quarantined for review.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="shadow-subtle border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Responsible AI &amp; Simulation Disclaimers</CardTitle>
          <CardDescription className="text-xs">Deterministic Grounding &bull; No Hallucinated Metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p>
            1. <strong>Explainable Forecasting:</strong> Every forecast displays upper/lower confidence bounds and empirical drivers (e.g. PLI factory commissioning, NCVT seat registries).
          </p>
          <p>
            2. <strong>Simulation Transparency:</strong> Policy What-If scenarios and equipment capacity simulations are strictly labeled as <code>SIMULATION ONLY</code>.
          </p>
          <p>
            3. <strong>Fairness:</strong> Career recommendations are calculated strictly on skills, capabilities, and learning readiness without demographic bias.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
