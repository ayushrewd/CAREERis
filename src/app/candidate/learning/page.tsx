"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowDown, BookOpen, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LearningPathPage() {
  const [data, setData] = useState<any>(); const [error, setError] = useState("");
  useEffect(() => { fetch("/api/candidate/learning-path", { cache: "no-store" }).then(async (r) => { const b = await r.json(); if (!r.ok) throw new Error(b.error); setData(b); }).catch((e) => setError(e.message)); }, []);
  if (error) return <div className="rounded-xl border border-red-500/30 p-5 text-sm text-red-600">{error}</div>;
  if (!data) return <p className="text-sm text-muted-foreground">Building your evidence-backed learning path…</p>;
  if (data.insufficientEvidence) return <div className="mx-auto max-w-3xl rounded-2xl border border-amber-500/30 p-7"><AlertTriangle className="h-6 w-6 text-amber-600"/><h1 className="mt-3 text-xl font-bold">Insufficient role evidence</h1><p className="mt-2 text-sm text-muted-foreground">A learning path needs a target role with registered-employer skill requirements.</p><Button asChild className="mt-5"><Link href="/candidate/goals">Select role</Link></Button></div>;
  return <main className="mx-auto max-w-5xl space-y-6 pb-16"><header><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Personalized learning path</p><h1 className="mt-1 text-3xl font-extrabold">Close gaps for {data.role.title}</h1><p className="mt-2 text-sm text-muted-foreground">Gap → qualification → real provider course → project evidence → reassessment</p></header>
    {data.paths.length === 0 ? <Card><CardContent className="p-7 text-sm text-emerald-600">No unevidenced required skills found.</CardContent></Card> : data.paths.map((path:any) => <Card key={path.skill}><CardHeader className="border-b"><div className="flex items-center justify-between gap-3"><CardTitle>{path.skill}</CardTitle><Badge>{path.proficiency}</Badge></div><p className="text-xs text-muted-foreground">Requirement supported by {path.evidenceRecords} employer posting(s)</p></CardHeader><CardContent className="space-y-5 p-6"><div className="flex flex-wrap items-center gap-2 text-xs font-semibold"><span className="rounded-lg bg-muted px-3 py-2">Skill gap</span><ArrowDown className="h-4 w-4 rotate-[-90deg]"/><span className="rounded-lg bg-muted px-3 py-2">{path.qualification || "Qualification not provided"}</span><ArrowDown className="h-4 w-4 rotate-[-90deg]"/><span className="rounded-lg bg-muted px-3 py-2">Training</span><ArrowDown className="h-4 w-4 rotate-[-90deg]"/><span className="rounded-lg bg-muted px-3 py-2">Project + reassessment</span></div>
      {path.courses.length === 0 ? <div className="rounded-xl border border-dashed p-5"><strong>No verified course found for this skill gap.</strong><p className="mt-1 text-xs text-muted-foreground">This is an observed supply gap; no course record from a registered CAREERIS provider matches this skill.</p></div> : <div className="grid gap-3 md:grid-cols-2">{path.courses.map((course:any) => <Link key={course.id} href={`/courses/${course.id}`} className="rounded-xl border p-4 hover:border-primary/50"><div className="flex justify-between"><BookOpen className="h-5 w-5 text-primary"/><ExternalLink className="h-4 w-4 text-muted-foreground"/></div><h2 className="mt-3 font-bold">{course.title}</h2><p className="mt-1 text-xs text-muted-foreground">{course.provider} · {course.level} · {course.durationHours} hours</p><p className="mt-3 text-[11px] text-muted-foreground">Evidence: {course.evidence}</p></Link>)}</div>}
    </CardContent></Card>)}
  </main>;
}
