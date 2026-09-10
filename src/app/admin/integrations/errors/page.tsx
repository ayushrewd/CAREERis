"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function IntegrationErrorsQuarantinePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = () => {
    fetch("/api/v1/integrations/quarantine")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setRecords(res.data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleResolve = async (recordId: string, status: "CORRECTED_AND_RESOLVED" | "REJECTED") => {
    const res = await fetch("/api/v1/integrations/quarantine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordId, status }),
    });
    const data = await res.json();
    if (data.success) {
      fetchRecords();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/admin/integrations">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Integrations Registry
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-bold font-heading">Data Ingestion Quarantine &amp; Conflict Resolution</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Untrusted, unmapped or conflicting records quarantined to protect canonical entity integrity
        </p>
      </div>

      <div className="space-y-4">
        {records.map((q) => (
          <Card key={q.recordId} className="shadow-subtle border-amber-500/30">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning" className="text-[10px]">{q.reason}</Badge>
                  <Badge variant="outline" className="text-[10px]">{q.status}</Badge>
                  <CardTitle className="text-base font-bold">{q.sourceName}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Quarantined: {new Date(q.quarantinedAt).toLocaleString()} &bull; ID: {q.recordId}
                </CardDescription>
              </div>

              {q.status === "PENDING_REVIEW" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="text-xs h-7 px-2.5 gap-1"
                    onClick={() => handleResolve(q.recordId, "CORRECTED_AND_RESOLVED")}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Map &amp; Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 px-2.5 gap-1 text-destructive"
                    onClick={() => handleResolve(q.recordId, "REJECTED")}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg border bg-muted/20 font-mono text-[11px]">
                <pre className="whitespace-pre-wrap">{JSON.stringify(q.rawPayload, null, 2)}</pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
