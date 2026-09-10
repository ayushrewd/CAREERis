"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, Lock, AlertTriangle, Key, Users } from "lucide-react";
import Link from "next/link";

export default function AdminSecurityCenterPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/security/audit")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setEvents(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Security Center &amp; Access Audit Trail</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time audit log of credential verifications, consent grants, API token access, and administrative actions
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold font-heading">Immutable Security Audit Logs</h2>
        {events.map((ev) => (
          <Card key={ev.eventId} className="shadow-subtle">
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={ev.status === "SUCCESS" ? "success" : "destructive"} className="text-[10px]">
                    {ev.status}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-mono">{ev.eventType}</Badge>
                  <span className="text-xs font-bold text-foreground">{ev.resourceAccessed}</span>
                </div>
                <CardDescription className="text-xs">
                  IP: <span className="font-mono">{ev.ipAddress}</span> &bull; {new Date(ev.timestamp).toLocaleString()}
                </CardDescription>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{ev.eventId}</span>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <p>{ev.details}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
