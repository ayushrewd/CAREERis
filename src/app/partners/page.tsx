"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Key, ArrowRight, Webhook, Code, ShieldCheck, Building2 } from "lucide-react";
import Link from "next/link";

export default function PartnerPortalPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/partners/api-keys")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setKeys(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Ecosystem Partner &amp; Enterprise API Portal</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage partner credentials, webhook event subscriptions, and REST API access scopes
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/partners/api-keys">
            <Button size="sm" className="text-xs h-7 px-3 gap-1">
              <Key className="w-3.5 h-3.5" /> API Keys
            </Button>
          </Link>
          <Link href="/developers">
            <Button size="sm" variant="outline" className="text-xs h-7 px-3 gap-1">
              <Code className="w-3.5 h-3.5" /> Documentation
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Active API Keys</CardTitle>
            <CardDescription className="text-xs">Granular scoped tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <span className="text-3xl font-bold font-mono text-primary block">{keys.length}</span>
            <p className="text-[11px] text-muted-foreground">Governed under strict rate limits (120 req/min).</p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Webhook Subscriptions</CardTitle>
            <CardDescription className="text-xs">Asynchronous domain events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <span className="text-3xl font-bold font-mono text-emerald-600 block">1 Active</span>
            <p className="text-[11px] text-muted-foreground">HMAC SHA-256 signatures &amp; automatic retry queue.</p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Data Security Tier</CardTitle>
            <CardDescription className="text-xs">Zero PII candidate exposure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <span className="text-3xl font-bold font-mono text-foreground block">100% Audit</span>
            <p className="text-[11px] text-muted-foreground">Every credential verification audited in real-time.</p>
          </CardContent>
        </Card>
      </div>

      {/* Keys List */}
      <div className="space-y-3 pt-2">
        <h2 className="text-sm font-bold font-heading">Registered Partner Organizations</h2>
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
              <span className="text-[10px] font-mono text-muted-foreground">
                Rate Limit: {k.rateLimitPerMinute} req/min
              </span>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex flex-wrap gap-1">
                {k.scopes?.map((sc: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-[9px]">{sc}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
