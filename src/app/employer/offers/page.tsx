"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCheck, ArrowLeft, Plus, CheckCircle2, User, Building2, MapPin, DollarSign } from "lucide-react";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils";

export default function EmployerOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/employer/offers?employerId=comp-tata-motors")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setOffers(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSimulateAcceptance = async (offerId: string) => {
    try {
      const res = await fetch(`/api/employer/offers/${offerId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACCEPTED" }),
      }).then((r) => r.json());

      if (res.success) {
        setOffers((prev) =>
          prev.map((o) => (o.id === offerId ? { ...o, status: "ACCEPTED" } : o))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/employer">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Command Center
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Offer Management &amp; Placement Registry</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Formal employment offers with automated placement milestone generation
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Loading offer records...</div>
      ) : offers.length === 0 ? (
        <div className="p-8 text-center border rounded-xl bg-card">
          <FileCheck className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium">No formal offers extended currently.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((off) => (
            <Card key={off.id} className="shadow-subtle hover:border-primary/40 transition-all">
              <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-base">{off.candidateName}</span>
                    <Badge variant={off.status === "ACCEPTED" ? "success" : off.status === "SENT" ? "primary" : "secondary"} className="text-[10px]">
                      {off.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Role: <span className="text-foreground font-medium">{off.roleTitle}</span> &bull; {off.employerName}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      CTC: {formatCurrencyINR(off.annualCompensationINR)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      Joining: {off.joiningDate} ({off.workLocation})
                    </span>
                    <span>Type: {off.employmentType}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {off.status === "SENT" && (
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => handleSimulateAcceptance(off.id)}>
                      Simulate Candidate Acceptance
                    </Button>
                  )}
                  {off.status === "ACCEPTED" && (
                    <Badge variant="success" className="text-xs gap-1 py-1.5 px-3">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Placed &amp; Onboarded
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
