"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, CheckCircle2, XCircle, AlertTriangle, Users } from "lucide-react";
import Link from "next/link";

export default function DecisionsRegisterPage() {
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDecisions = () => {
    fetch("/api/v1/decisions")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setDecisions(res.data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDecisions();
  }, []);

  const handleApprove = async (decisionId: string) => {
    const res = await fetch("/api/v1/decisions/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decisionId }),
    });
    const data = await res.json();
    if (data.success) {
      fetchDecisions();
    } else {
      alert(data.error || "Approval failed.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Decision Register &amp; Four-Eyes Approval Workflow</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Strict separation of duties: Financial allocations and policy interventions require independent authorized approver sign-off
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {decisions.map((d) => (
          <Card key={d.decisionId} className="shadow-subtle hover:border-primary/40 transition-all">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={d.status === "APPROVED" ? "success" : "warning"} className="text-[10px] font-mono">
                    {d.status}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">{d.decisionType}</Badge>
                  <CardTitle className="text-base font-bold">{d.targetEntityName}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Requester: <span className="font-bold text-foreground">{d.requesterName}</span> ({d.requesterRole}) &bull; Requested: {new Date(d.requestedAt).toLocaleString()}
                </CardDescription>
              </div>

              {d.status === "PROPOSED" && (
                <Button
                  size="sm"
                  className="text-xs h-7 px-3 gap-1 shrink-0"
                  onClick={() => handleApprove(d.decisionId)}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve (Four-Eyes Check)
                </Button>
              )}
            </CardHeader>

            <CardContent className="space-y-2 text-xs">
              <p className="text-muted-foreground"><strong className="text-foreground">Justification:</strong> {d.reason}</p>
              <div className="p-2 rounded bg-muted/20 border text-[11px] text-muted-foreground">
                <strong>Evidence Summary:</strong> {d.evidenceSummary}
              </div>
              {d.approverName && (
                <p className="text-[10px] text-emerald-600 font-bold pt-1">
                  ✓ Independently approved by: {d.approverName} ({d.approverRole}) on {new Date(d.approvedAt).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
