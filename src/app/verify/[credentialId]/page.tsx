"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle2, AlertTriangle, Lock, Award } from "lucide-react";

export default function PublicCredentialVerificationPage() {
  const params = useParams();
  const credentialId = params.credentialId as string;
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (credentialId) {
      fetch(`/api/v1/credentials/verify/${credentialId}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setResult(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [credentialId]);

  if (loading) return <div className="p-12 text-center text-sm text-muted-foreground">Verifying digital signature on CareerIS Trust Registry...</div>;
  if (!result) return <div className="p-12 text-center text-sm text-muted-foreground">Credential record not found.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-xl w-full shadow-lg border-primary/30">
        <CardHeader className="text-center pb-3 space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <Badge variant={result.isValid ? "success" : "destructive"} className="text-xs">
              {result.isValid ? "OFFICIALLY VERIFIED CREDENTIAL" : "INVALID / REVOKED CREDENTIAL"}
            </Badge>
            <CardTitle className="text-lg font-bold pt-2">{result.title}</CardTitle>
            <CardDescription className="text-xs">
              Credential ID: <span className="font-mono font-bold text-foreground">{result.credentialId}</span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 text-xs">
          <div className="p-3 rounded-xl border bg-muted/20 space-y-2">
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-muted-foreground">Certified Competency:</span>
              <span className="font-bold text-foreground">{result.competency}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-muted-foreground">Authoritative Issuer:</span>
              <span className="font-bold text-foreground">{result.issuerName}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-muted-foreground">Issue Date:</span>
              <span className="font-bold text-foreground">{new Date(result.issuedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-muted-foreground">Verification Timestamp:</span>
              <span className="font-mono text-muted-foreground">{new Date(result.verificationTimestamp).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Audit Tracking ID:</span>
              <span className="font-mono text-[10px] text-muted-foreground">{result.verificationAuditId}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl border bg-primary/5 border-primary/20 flex items-start gap-2">
            <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {result.securityNotice}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
