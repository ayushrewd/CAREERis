"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JobDetailPage() {
  const { id } = useParams<{id:string}>(); const [data,setData]=useState<any>(); const [error,setError]=useState(""); const [applying,setApplying]=useState(false); const [checklist,setChecklist]=useState<any>();
  useEffect(()=>{fetch(`/api/jobs/${id}`,{cache:"no-store"}).then(async r=>{const b=await r.json();if(!r.ok)throw new Error(b.error);setData(b)}).catch(e=>setError(e.message))},[id]);
  async function apply(){setApplying(true);setError("");const r=await fetch("/api/candidate/applications",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({jobId:id})});const b=await r.json();setChecklist(b.checklist);if(!r.ok)setError(b.error);else setError("Application created successfully.");setApplying(false)}
  if(!data)return <p className="text-sm text-muted-foreground">{error||"Loading job evidence…"}</p>; const {job,match}=data;
  return <main className="mx-auto max-w-5xl space-y-6 pb-16"><Button asChild variant="ghost"><Link href="/jobs"><ArrowLeft className="mr-2 h-4 w-4"/>Back to jobs</Link></Button><header className="rounded-2xl border bg-card p-7"><p className="text-xs font-bold uppercase tracking-wide text-primary">{job.company.name}</p><h1 className="mt-1 text-3xl font-extrabold">{job.title}</h1><p className="mt-2 text-sm text-muted-foreground">{job.locationText||"Location not provided"} · {job.jobType.replaceAll("_"," ")} · {job.minExperience}+ years</p></header>
    <Card><CardHeader><CardTitle>Why you match</CardTitle><p className="text-xs text-muted-foreground">Calculated only from required skills and candidate evidence.</p></CardHeader><CardContent>{!match?<p className="text-sm text-muted-foreground">Candidate evidence match is available to candidate accounts.</p>:match.total===0?<p className="text-sm text-amber-600">Insufficient evidence to calculate a percentage.</p>:<><div className="mb-4 flex items-end justify-between"><strong className="text-3xl text-primary">{match.percentage}%</strong><span className="text-xs text-muted-foreground">{match.method}</span></div><div className="divide-y rounded-xl border">{match.rows.map((row:any)=><div key={row.normalizedName} className="flex items-center justify-between gap-3 p-4"><div><strong>{row.name}</strong><p className="text-xs text-muted-foreground">Required: {row.proficiency}</p></div>{row.matched?<span className="flex items-center gap-1 text-sm font-semibold text-emerald-600"><CheckCircle2 className="h-4 w-4"/>Evidence</span>:<span className="flex items-center gap-1 text-sm font-semibold text-amber-600"><XCircle className="h-4 w-4"/>Gap</span>}</div>)}</div></>}</CardContent></Card>
    <Card><CardHeader><CardTitle>Job details</CardTitle></CardHeader><CardContent className="space-y-4 text-sm"><p className="whitespace-pre-wrap leading-6 text-muted-foreground">{job.description}</p><div className="flex flex-wrap gap-2">{job.requirements.map((r:any)=><Badge key={`${r.normalizedName}-${r.proficiency}`}>{r.name} · {r.proficiency}</Badge>)}</div><p><strong>Qualification:</strong> {job.qualification||"Not specified"}</p></CardContent></Card>
    {error&&<div className={`rounded-xl border p-4 text-sm ${error.includes("successfully")?"border-emerald-500/30 text-emerald-600":"border-red-500/30 text-red-600"}`}>{error}{checklist&&<div className="mt-2 text-xs">Assessment: {checklist.assessmentComplete?"✓":"✕"} · Required evidence: {checklist.requiredEvidence?"✓":"✕"} · Profile complete: {checklist.profileComplete?"✓":"✕"}</div>}</div>}<Button disabled={applying||!match} onClick={apply}>{applying?"Checking prerequisites…":"Apply"}</Button>
  </main>;
}
