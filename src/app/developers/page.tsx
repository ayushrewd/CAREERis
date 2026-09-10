"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Key, ShieldCheck, ArrowRight, BookOpen, Layers } from "lucide-react";
import Link from "next/link";

export default function DeveloperDocumentationPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div>
        <h1 className="text-xl font-bold font-heading">CareerIS REST API Developer Documentation (v1)</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Standardized OpenAPI endpoints for digital credentials, labour forecasts, job matching &amp; training synchronization
        </p>
      </div>

      <div className="space-y-4">
        {/* Auth Section */}
        <Card className="shadow-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Authentication &amp; API Headers</CardTitle>
            <CardDescription className="text-xs">Include your partner API Key in the authorization header</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="p-3 rounded-xl border bg-muted/20 font-mono text-[11px] space-y-1">
              <p>Authorization: Bearer pk_live_your_api_key_here</p>
              <p>Content-Type: application/json</p>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints Table */}
        <Card className="shadow-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Core REST Endpoints</CardTitle>
            <CardDescription className="text-xs">All endpoints return standard envelopes with request IDs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-xl border bg-card flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-[10px]">GET</Badge>
                <span className="font-mono font-bold">/api/v1/credentials/verify/:id</span>
              </div>
              <span className="text-muted-foreground">Public minimal verification (Zero PII)</span>
            </div>

            <div className="p-3 rounded-xl border bg-card flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-[10px]">GET</Badge>
                <span className="font-mono font-bold">/api/v1/consent?candidateId=:id</span>
              </div>
              <span className="text-muted-foreground">Retrieve active candidate consent grants</span>
            </div>

            <div className="p-3 rounded-xl border bg-card flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-[10px]">GET</Badge>
                <span className="font-mono font-bold">/api/intelligence/forecasts</span>
              </div>
              <span className="text-muted-foreground">Multi-horizon labour demand projections</span>
            </div>

            <div className="p-3 rounded-xl border bg-card flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-[10px]">POST</Badge>
                <span className="font-mono font-bold">/api/v1/webhooks</span>
              </div>
              <span className="text-muted-foreground">HMAC signed domain event dispatcher</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
