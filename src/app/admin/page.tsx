"use client";

import React, { useState } from "react";
import { getAuditLogs, recordAuditEvent } from "@/lib/audit";
import { SEED_DATA_SOURCES } from "@/lib/data-sources";
import { DEMO_USERS } from "@/lib/auth/mockUsers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { UserRole } from "@/types";
import { getRoleDisplayName } from "@/lib/rbac";
import { Settings, ShieldCheck, Database, Activity, FileCheck2, Users, RefreshCw, CheckCircle2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default function AdminConsolePage() {
  const [logs, setLogs] = useState(getAuditLogs());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshLogs = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLogs(getAuditLogs());
      setIsRefreshing(false);
    }, 300);
  };

  const triggerTestAudit = () => {
    recordAuditEvent({
      userName: "Platform Super Admin",
      userRole: "PLATFORM_ADMIN",
      action: "MANUAL_INTEGRITY_CHECK",
      entity: "DatabaseIntegrity",
      entityId: "chk-manual-01",
      details: { status: "PASSED", verifiedRecords: 1420 },
    });
    setLogs(getAuditLogs());
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl border bg-gradient-to-r from-card via-card/90 to-rose-500/5 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center justify-center font-bold text-xl font-heading shadow-inner">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-heading text-foreground">
                CareerIS Platform Super Administration
              </h1>
              <Badge variant="destructive" className="text-[10px]">
                Platform Super Admin
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              System Health &bull; Audit Trail &bull; User &amp; Role Access Control &bull; Data Source Trust
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={triggerTestAudit}
            className="text-xs"
          >
            Emit Test Audit Log
          </Button>
          <Button
            size="sm"
            onClick={refreshLogs}
            className="text-xs gap-1.5"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="health">
        <StatCard
          title="System Health"
          value="100% Operational"
          change="All Nodes Normal"
          isPositive={true}
          icon={<Activity className="w-4 h-4 text-emerald-500" />}
        />
        <StatCard
          title="Database Engine"
          value="PostgreSQL + pgvector"
          change="Schema Active"
          isPositive={true}
          icon={<Database className="w-4 h-4 text-primary" />}
        />
        <StatCard
          title="Active Personas"
          value="7 Ecosystem Roles"
          change="RBAC Enforced"
          isPositive={true}
          icon={<Users className="w-4 h-4 text-indigo-500" />}
        />
        <StatCard
          title="Audit Log Integrity"
          value={`${logs.length} Recorded`}
          change="Immutable Stream"
          isPositive={true}
          icon={<FileCheck2 className="w-4 h-4 text-cyan-500" />}
        />
      </div>

      {/* Main Grid: Audit Logs & User Roles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-time Audit Trail Stream */}
        <div className="lg:col-span-2 space-y-6" id="audit">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-primary" />
                  <span>Platform Audit Trail &amp; Sensitive Action Stream</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Every privileged action, role change, and intelligence update is permanently recorded.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Real-time
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg border bg-muted/20 text-xs space-y-1 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-background border font-bold text-primary">
                          {log.action}
                        </span>
                        <span className="font-semibold text-foreground">
                          {log.entity} &bull; {log.userName}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {formatRelativeTime(log.createdAt)}
                      </span>
                    </div>

                    {log.details && (
                      <pre className="text-[10px] font-mono bg-background p-1.5 rounded border text-muted-foreground overflow-x-auto">
                        {JSON.stringify(log.details)}
                      </pre>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
                      <span>Role: {log.userRole}</span>
                      <span>IP: {log.ipAddress}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Sources Table */}
          <Card id="datasources">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <span>Connected Intelligence Data Sources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-2 px-3">Data Source Name</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Scope</th>
                      <th className="py-2 px-3 text-right">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {SEED_DATA_SOURCES.map((ds) => (
                      <tr key={ds.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-medium text-foreground">{ds.name}</td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-primary">{ds.sourceType}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{ds.geographyScope}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          {ds.confidence}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Persona & Access Control Matrix */}
        <div className="space-y-6" id="users">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>Platform Persona Directory</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Pre-configured test persona accounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {Object.entries(DEMO_USERS).map(([roleKey, u]) => (
                <div key={u.id} className="p-3 rounded-lg border bg-card space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{u.fullName}</span>
                    <Badge variant="outline" className="text-[9px]">
                      {roleKey}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-mono">{u.email}</p>
                  <span className="text-[10px] text-primary font-medium block">
                    {getRoleDisplayName(roleKey as UserRole)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
