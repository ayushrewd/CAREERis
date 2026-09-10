"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ArrowLeft, ArrowRight, Share2, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CandidateCredentialsPage() {
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/credentials")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCredentials(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/candidate/profile">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Candidate Profile
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Verifiable Digital Credentials &amp; Skill Badges</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tamper-proof digital credentials issued by Sector Skill Councils, NCVT/DGT, and Enterprise OEMs
          </p>
        </div>
        <Link href="/candidate/sharing">
          <Button size="sm" className="text-xs h-7 px-3 gap-1">
            <Share2 className="w-3.5 h-3.5" /> Share Credentials
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {credentials.map((cred) => (
          <Card key={cred.credentialId} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="success" className="text-[10px]">
                  ✓ {cred.status}
                </Badge>
                <Badge variant="outline" className="text-[10px] font-mono">{cred.credentialType}</Badge>
              </div>
              <CardTitle className="text-base font-bold pt-1">{cred.title}</CardTitle>
              <CardDescription className="text-xs">
                Issuer: <span className="font-bold text-foreground">{cred.issuerName}</span> &bull; Issued: {new Date(cred.issuedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certified Competency:</span>
                  <span className="font-bold text-foreground">{cred.skillName} ({cred.proficiencyLevel})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Integrity Signature:</span>
                  <span className="font-mono text-[10px]">{cred.digitalSignatureHash.slice(0, 16)}...</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Link href={`/verify/${cred.credentialId}`} target="_blank">
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 gap-1">
                    Public Verification <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
                <span className="text-[10px] text-muted-foreground font-mono">ID: {cred.credentialId}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
