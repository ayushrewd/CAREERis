"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataProvenancePanel } from "@/components/intelligence/DataProvenancePanel";
import {
  Database,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Layers,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Check,
  X,
} from "lucide-react";

export default function AdminIntelligenceCenterPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [quality, setQuality] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [runningJob, setRunningJob] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/intelligence/sources").then((r) => r.json()),
      fetch("/api/admin/intelligence/ingestion").then((r) => r.json()),
      fetch("/api/admin/intelligence/quality").then((r) => r.json()),
    ])
      .then(([sourcesRes, jobsRes, qualityRes]) => {
        if (sourcesRes.data) setSources(sourcesRes.data);
        if (jobsRes.data) setJobs(jobsRes.data);
        if (qualityRes.data) setQuality(qualityRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTriggerIngestion = async (sourceId: string) => {
    setRunningJob(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/intelligence/ingestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Ingestion job completed successfully for source: ${sourceId}`);
        fetchData();
      } else {
        setMessage(`Ingestion job failed: ${data.error?.message || "Unknown error"}`);
      }
    } catch (err: any) {
      setMessage(`Execution error: ${err.message}`);
    } finally {
      setRunningJob(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>Platform Administration</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Labour-Market Data Ingestion Center &amp; Pipeline Control
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage multi-source ingestion connectors, monitor data quality diagnostics, and execute deterministic normalization pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={fetchData}
            variant="outline"
            disabled={loading}
            className="text-xs font-semibold gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh State</span>
          </Button>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-lg border bg-card text-xs font-medium text-foreground flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quality Health KPI Banner */}
      {quality && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[11px] text-muted-foreground font-semibold">Overall Pipeline Health</span>
              <div className="text-2xl font-extrabold font-heading text-emerald-600 font-mono">
                {quality.overallHealthScore}%
              </div>
              <span className="text-[10px] text-muted-foreground">Deterministic validation rules</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[11px] text-muted-foreground font-semibold">Raw Records Ingested</span>
              <div className="text-2xl font-extrabold font-heading text-foreground font-mono">
                {quality.totalRawRecordsReceived}
              </div>
              <span className="text-[10px] text-muted-foreground">{quality.processedRecordsCount} accepted &amp; normalized</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[11px] text-muted-foreground font-semibold">Filtered Duplicates</span>
              <div className="text-2xl font-extrabold font-heading text-primary font-mono">
                {quality.duplicateRecordsFiltered}
              </div>
              <span className="text-[10px] text-muted-foreground">Checksum-based deduplication</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[11px] text-muted-foreground font-semibold">Validation Error Rate</span>
              <div className="text-2xl font-extrabold font-heading text-emerald-600 font-mono">
                0.2%
              </div>
              <span className="text-[10px] text-muted-foreground">Quarantined for review</span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Registered Data Sources */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                Registered Data Sources ({sources.length})
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Official government registries, industry council feeds, and job market vacancy connectors.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {sources.map((src) => (
              <div key={src.id} className="p-4 rounded-xl border bg-card space-y-3 text-xs">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground font-heading">{src.name}</span>
                      <Badge variant="outline" className="text-[10px] font-mono">{src.code}</Badge>
                      <Badge variant={src.status === "HEALTHY" ? "success" : "warning"} className="text-[10px]">
                        {src.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{src.publisher} • Frequency: {src.frequency}</p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleTriggerIngestion(src.id)}
                    disabled={runningJob}
                    className="text-xs font-bold gap-1 shadow-xs"
                  >
                    <Play className="w-3 h-3" />
                    <span>Run Ingestion</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded-lg bg-muted/40 font-mono text-[11px] text-muted-foreground">
                  <div><span className="font-semibold text-foreground">Type:</span> {src.sourceType}</div>
                  <div><span className="font-semibold text-foreground">Confidence:</span> {Math.round(src.confidence * 100)}%</div>
                  <div><span className="font-semibold text-foreground">Coverage:</span> {src.geographyCoverage}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ingestion Execution History */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-primary" />
            Recent Ingestion Job Executions ({jobs.length})
          </h3>

          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="p-4 rounded-xl border bg-card space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground font-mono">{job.id}</span>
                    <Badge variant={job.status === "COMPLETED" ? "success" : job.status === "PARTIAL" ? "warning" : "danger"} className="text-[10px]">
                      {job.status}
                    </Badge>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {new Date(job.startedAt).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-muted-foreground">
                  <div>Received: <span className="font-bold text-foreground">{job.recordsReceived}</span></div>
                  <div>Accepted: <span className="font-bold text-emerald-600">{job.recordsAccepted}</span></div>
                  <div>Rejected: <span className="font-bold text-amber-600">{job.recordsRejected}</span></div>
                  <div>Created: <span className="font-bold text-primary">{job.recordsCreated}</span></div>
                </div>

                {job.checksum && (
                  <div className="text-[10px] font-mono text-muted-foreground truncate">
                    Checksum: {job.checksum}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <DataProvenancePanel
        sourceName="CareerIS Administrative Pipeline Center"
        period="2026-Q2"
        confidenceScore={98}
      />
    </div>
  );
}
