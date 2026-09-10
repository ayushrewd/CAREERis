"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Share2, Copy, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CandidateCredentialSharingPage() {
  const [credentialId, setCredentialId] = useState("cred-asdc-bms-2026-001");
  const [duration, setDuration] = useState("7");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    const res = await fetch("/api/v1/credentials/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credentialId, durationDays: parseInt(duration) }),
    });
    const data = await res.json();
    if (data.success) {
      setGeneratedLink(data.data.shareUrl);
      setCopied(false);
    }
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/candidate/credentials">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Digital Credentials
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-bold font-heading">Generate Secure Time-Bound Credential Share Link</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Share tamper-proof credential verification links with employers that expire automatically
        </p>
      </div>

      <Card className="shadow-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Configure Share Link</CardTitle>
          <CardDescription className="text-xs">
            Recipients receive zero-PII cryptographic authenticity verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-foreground block">Select Credential</label>
            <Input
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-foreground block">Expiration Window (Days)</label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="text-xs h-9 w-32"
            />
          </div>

          <Button size="sm" onClick={handleGenerate} className="text-xs h-8 px-4 gap-1">
            <Share2 className="w-3.5 h-3.5" /> Generate Time-Bound Link
          </Button>

          {generatedLink && (
            <div className="p-3 rounded-xl border bg-emerald-500/5 border-emerald-500/20 space-y-2 pt-2">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">
                Share Link Generated (Valid for {duration} days):
              </span>
              <div className="flex gap-2">
                <Input readOnly value={generatedLink} className="text-xs h-9 bg-card font-mono" />
                <Button size="sm" variant="outline" onClick={handleCopy} className="text-xs h-9 px-3 gap-1">
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
