"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SkillGapPage() {
  const [data, setData] = useState<any>(); const [error, setError] = useState("");
  useEffect(() => { fetch("/api/candidate/readiness", { cache: "no-store" }).then(async (r) => { const b = await r.json(); if (!r.ok) throw new Error(b.error); setData(b); }).catch((e) => setError(e.message)); }, []);
  if (error) return <div className="rounded-xl border border-red-500/30 p-5 text-sm text-red-600">{error}</div>;
  if (!data) return <p className="text-sm text-muted-foreground">Comparing candidate evidence with employer requirements…</p>;
  if (data.insufficientEvidence) return <div className="mx-auto max-w-3xl rounded-2xl border border-amber-500/30 bg-amber-500/10 p-7"><AlertTriangle className="h-6 w-6 text-amber-600"/><h1 className="mt-3 text-xl font-bold">Insufficient evidence</h1><p className="mt-2 text-sm text-muted-foreground">Select a target role that has requirements posted by a registered employer.</p><Button asChild className="mt-5"><Link href="/candidate/goals">Choose career goal</Link></Button></div>;
  return <main className="mx-auto max-w-5xl space-y-6 pb-16"><header><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Skill gap engine</p><h1 className="mt-1 text-3xl font-extrabold">{data.role.title}</h1><p className="mt-2 text-sm text-muted-foreground">{data.method} · {data.role.evidenceRecords} registered-employer job record(s)</p></header>
    <Card><CardHeader className="border-b"><div className="flex items-center justify-between"><CardTitle>Candidate evidence vs role requirements</CardTitle><strong className="text-2xl text-primary">{data.matchPercentage}%</strong></div></CardHeader><CardContent className="overflow-x-auto p-0"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b bg-muted/30 text-xs text-muted-foreground"><tr><th className="p-4">Skill</th><th className="p-4">Candidate</th><th className="p-4">Role</th><th className="p-4">Evidence</th></tr></thead><tbody className="divide-y">{data.rows.map((row:any) => <tr key={row.normalizedName}><td className="p-4 font-semibold">{row.skill}</td><td className="p-4">{row.candidate ? <CheckCircle2 className="h-5 w-5 text-emerald-600"/> : <XCircle className="h-5 w-5 text-red-500"/>}</td><td className="p-4"><Badge>{row.proficiency}</Badge></td><td className="p-4 text-xs text-muted-foreground">{row.reason}</td></tr>)}</tbody></table></CardContent></Card>
    <Card><CardHeader><CardTitle>Priority skill gaps</CardTitle></CardHeader><CardContent className="space-y-3">{data.gaps.length === 0 ? <p className="text-sm text-emerald-600">All recorded requirements have candidate evidence.</p> : data.gaps.map((gap:any) => <div key={gap.normalizedName} className="rounded-xl border p-4"><strong>{gap.priority}. {gap.skill}</strong><p className="mt-1 text-xs text-muted-foreground">{gap.reason}</p></div>)}{data.gaps.length > 0 && <Button asChild className="mt-2"><Link href="/candidate/learning">Fix My Skill Gaps</Link></Button>}</CardContent></Card>
  </main>;
}
