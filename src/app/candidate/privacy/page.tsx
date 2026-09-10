"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, Trash2, Lock, Eye, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CandidatePrivacyCenterPage() {
  const [consents, setConsents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConsents = () => {
    fetch("/api/v1/consent")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setConsents(res.data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConsents();
  }, []);

  const handleRevoke = async (consentId: string) => {
    const res = await fetch("/api/v1/consent/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consentId }),
    });
    const data = await res.json();
    if (data.success) {
      fetchConsents();
    }
  };

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
          <h1 className="text-xl font-bold font-heading">Data Privacy &amp; Consent Management Center</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Full visibility and instant one-click revocation of organizations authorized to access your credentials
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {consents.map((c) => (
          <Card key={c.consentId} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={c.status === "ACTIVE" ? "success" : "outline"} className="text-[10px]">
                    {c.status}
                  </Badge>
                  <CardTitle className="text-base font-bold">{c.granteeName}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Purpose: <span className="font-bold text-foreground font-mono">{c.purpose}</span> &bull; Granted: {new Date(c.grantedAt).toLocaleDateString()}
                  {c.expiresAt && ` • Expires: ${new Date(c.expiresAt).toLocaleDateString()}`}
                </CardDescription>
              </div>

              {c.status === "ACTIVE" && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="text-xs h-7 px-2.5 gap-1 shrink-0"
                  onClick={() => handleRevoke(c.consentId)}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Revoke Access
                </Button>
              )}
            </CardHeader>

            <CardContent className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground block">Authorized Data Scope:</span>
                <div className="flex flex-wrap gap-1">
                  {c.dataScope?.map((scope: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-[9px]">{scope}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
