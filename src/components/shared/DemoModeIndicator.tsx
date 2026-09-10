"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Database, Info } from "lucide-react";

export function DemoModeIndicator() {
  const [dbStatus, setDbStatus] = useState<{
    mode: "POSTGRES" | "DEVELOPMENT_DEMO";
    connected: boolean;
  }>({
    mode: "DEVELOPMENT_DEMO",
    connected: false,
  });

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.database) {
          setDbStatus({
            mode: data.data.database.mode,
            connected: data.data.database.connected,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="inline-flex items-center gap-1.5" title="Data Persistence State">
      {dbStatus.connected ? (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          PostgreSQL Active
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-medium">
          <Database className="w-2.5 h-2.5" />
          Demo Data Mode
        </span>
      )}
    </div>
  );
}
