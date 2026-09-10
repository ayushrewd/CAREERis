"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Key, Plus, ShieldCheck, Copy, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PartnerApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [partnerName, setPartnerName] = useState("");
  const [newRawSecret, setNewRawSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchKeys = () => {
    fetch("/api/v1/partners/api-keys")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setKeys(res.data || []);
      });
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleGenerate = async () => {
    if (!partnerName.trim()) return;
    const res = await fetch("/api/v1/partners/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partnerName,
        scopes: ["jobs:read", "jobs:write", "credentials:verify", "analytics:read"],
      }),
    });
    const data = await res.json();
    if (data.success) {
      setNewRawSecret(data.data.rawSecret);
      setPartnerName("");
      fetchKeys();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/partners">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Partner Portal
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-bold font-heading">Partner API Key Governance</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Generate scoped REST API tokens with automatic rate limits and hash-secured storage
        </p>
      </div>

      <Card className="shadow-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Generate New Partner API Key</CardTitle>
          <CardDescription className="text-xs">Secrets are shown once upon creation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex gap-2">
            <Input
              placeholder="Partner Organization Name (e.g. Mahindra Electric Ltd)"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="text-xs h-9"
            />
            <Button size="sm" onClick={handleGenerate} className="text-xs h-9 px-4 shrink-0 gap-1">
              <Plus className="w-3.5 h-3.5" /> Generate Token
            </Button>
          </div>

          {newRawSecret && (
            <div className="p-3 rounded-xl border bg-emerald-500/5 border-emerald-500/20 space-y-2">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">
                API Secret Key Generated (Store safely, will not be shown again):
              </span>
              <div className="flex gap-2">
                <Input readOnly value={newRawSecret} className="text-xs h-9 bg-card font-mono" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(newRawSecret);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs h-9 px-3 gap-1"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3 pt-2">
        <h2 className="text-sm font-bold font-heading">Active API Credentials</h2>
        {keys.map((k) => (
          <Card key={k.keyId} className="shadow-subtle">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-[10px]">{k.status}</Badge>
                  <CardTitle className="text-base font-bold">{k.partnerName}</CardTitle>
                </div>
                <CardDescription className="text-xs font-mono">{k.apiKeyMasked}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
