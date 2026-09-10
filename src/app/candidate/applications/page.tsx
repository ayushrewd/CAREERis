"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/candidate/applications", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Could not load applications");
        setApplications(body.applications || []);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Could not load applications"))
      .finally(() => setLoading(false));
  }, []);

  return <main className="mx-auto max-w-5xl space-y-6 pb-16">
    <header><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Applications</p><h1 className="mt-1 text-3xl font-extrabold">Your hiring pipeline</h1><p className="mt-2 text-sm text-muted-foreground">Every status shown here comes from the registered company handling your application.</p></header>
    {error && <div className="rounded-xl border border-red-500/30 p-4 text-sm text-red-600">{error}</div>}
    {loading ? <p className="text-sm text-muted-foreground">Loading persisted applications…</p> : applications.length === 0 ? <Card><CardContent className="p-10 text-center"><Briefcase className="mx-auto h-8 w-8 text-muted-foreground"/><h2 className="mt-3 font-bold">No applications yet</h2><p className="mt-1 text-sm text-muted-foreground">Applications appear after you apply to a registered company job.</p><Button asChild className="mt-4"><Link href="/jobs">Explore jobs</Link></Button></CardContent></Card> : <div className="space-y-3">{applications.map((application) => <Card key={application.id}><CardContent className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary"><Building2 className="h-4 w-4"/>{application.job.company.name}</p><h2 className="mt-1 text-lg font-bold">{application.job.title}</h2><p className="mt-2 text-xs text-muted-foreground">Applied {new Date(application.createdAt).toLocaleString()} · Match {application.matchScore == null ? "Insufficient evidence" : `${Math.round(application.matchScore)}%`}</p></div><Badge>{application.workflowStatus.replaceAll("_", " ")}</Badge></CardContent></Card>)}</div>}
  </main>;
}
