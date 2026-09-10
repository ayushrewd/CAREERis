"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Compass, Sparkles, Shield, MapPin, CheckCircle2, Lock, FileText, Database } from "lucide-react";
import { CareerISLogo } from "@/components/ui/CareerISLogo";

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-4xl pb-12">
      {/* Header */}
      <div className="border-b pb-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Platform Architecture &amp; Manifesto</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-foreground">
            About CareerIS
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            India Career, Skill &amp; Labour-Market Intelligence Platform
          </p>
        </div>
        <CareerISLogo size="lg" showTagline={true} />
      </div>

      {/* Core Principle */}
      <Card className="border-primary/40 bg-gradient-to-br from-primary/5 via-card to-cyan-500/5">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>CENTRAL ARCHITECTURAL PRINCIPLE</span>
          </div>
          <h2 className="text-2xl font-bold font-heading text-foreground">
            Everything Connects Through Skills.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            CareerIS is not a standard job portal, social network clone, or static dashboard. It is an end-to-end national intelligence ecosystem designed to bridge industry demand signals directly into vocational curricula, lab equipment readiness, proctored candidate verification, explainable job matches, and closed-loop placement feedback.
          </p>
        </CardContent>
      </Card>

      {/* What CareerIS Is NOT vs What CareerIS IS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-rose-500/20 bg-rose-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-rose-700 dark:text-rose-300">
              What CareerIS is NOT
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-2">
            <p>&bull; NOT a basic job aggregator or keyword resume matcher.</p>
            <p>&bull; NOT a LinkedIn or social network clone.</p>
            <p>&bull; NOT only a top-down government compliance dashboard.</p>
            <p>&bull; NOT a static once-a-year survey report.</p>
            <p>&bull; NOT an unverified AI claim generator.</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              What CareerIS IS
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-2">
            <p>&bull; A unified national skill taxonomy &amp; competency graph.</p>
            <p>&bull; Evidence-based candidate profiles with proctored verification.</p>
            <p>&bull; ITI curriculum health and real lab equipment monitoring.</p>
            <p>&bull; District-level skill demand vs. capacity planning engine.</p>
            <p>&bull; Closed-loop placement retention feedback loop.</p>
          </CardContent>
        </Card>
      </div>

      {/* Geography Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Pan-India Geographic Hierarchy</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
          <p>
            The platform architecture supports all <strong>28 States</strong> and <strong>8 Union Territories</strong> through a multi-tiered geographic hierarchy:
          </p>
          <div className="p-4 rounded-lg bg-muted/40 font-mono text-[11px] text-foreground space-y-1">
            <p>Country (India)</p>
            <p>&nbsp;&nbsp;↳ State / Union Territory (e.g., Maharashtra, Karnataka, Tamil Nadu, Gujarat)</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;↳ Administrative Division / Region (e.g., Pune Division)</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ District (e.g., Pune, Bengaluru Urban, Chennai, Noida)</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ City / Municipality</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ Industrial &amp; Economic Cluster (e.g., Chakan Auto Corridor)</p>
          </div>
          <p className="text-[11px]">
            <strong>SIH Pilot Context:</strong> Maharashtra serves as the reference pilot implementation geography for high-density automotive and electronics clusters, but the underlying database schema and services are fully generic across India.
          </p>
        </CardContent>
      </Card>

      {/* Data Privacy & Ethical AI Principles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            <span>Data Privacy &amp; Inclusion Principles</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Objective Skill Scoring:</strong> Sensitive personal attributes (such as caste, religion, gender, or marital status) are strictly quarantined and never used to rank candidate employability or matching scores.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Explainable Matching:</strong> Every job recommendation explicitly displays which specific verified skills match the employer requirement and where gaps exist.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Data Provenance &amp; Confidence:</strong> Every intelligence metric is tied to an auditable DataSource record with collection dates and explicit confidence ratings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
