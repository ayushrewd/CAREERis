"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, CircleDashed, FolderGit2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Passport = {
  candidate: { name: string; location?: string; education?: string; qualification?: string };
  skills: Array<{ id: string; name: string; status: string; assessedScore: number | null; assessedAt?: string | null; assessmentPassed?: boolean | null; passThreshold?: number | null; claimedProficiency?: string; trainingStatus: string; projectEvidence: boolean; evidenceSummary: string }>;
  projects: Array<{ id: string; title: string; repositoryUrl: string | null; repositoryReachable: boolean | null; evidenceStatus: string; verificationStatus?: string; verificationReason?: string; readmePresent?: boolean | null; repositoryOwner?: string | null }>;
};

export default function SkillPassportPage() {
  const [data, setData] = useState<Passport | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { fetch("/api/candidate/skill-passport", { cache: "no-store" }).then(async (response) => {
    const body = await response.json(); if (!response.ok) throw new Error(body.error); setData(body);
  }).catch((reason) => setError(reason.message)); }, []);
  if (error) return <div className="rounded-xl border border-red-500/30 p-5 text-sm text-red-600">{error}</div>;
  if (!data) return <p className="text-sm text-muted-foreground">Loading your evidence profile…</p>;
  return <main className="mx-auto max-w-5xl space-y-6 pb-16">
    <header><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Skill passport</p><h1 className="mt-1 text-3xl font-extrabold">{data.candidate.name}&apos;s evidence profile</h1><p className="mt-2 text-sm text-muted-foreground">{[data.candidate.location, data.candidate.education, data.candidate.qualification].filter(Boolean).join(" · ") || "Profile details not provided"}</p></header>
    <Card><CardHeader className="border-b"><CardTitle>Skills and evidence layers</CardTitle></CardHeader><CardContent className="divide-y p-0">
      {data.skills.length === 0 ? <p className="p-6 text-sm text-muted-foreground">No declared skills yet.</p> : data.skills.map((skill) => <div key={skill.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-bold uppercase tracking-wide">{skill.name}</h2><p className="mt-1 text-xs text-muted-foreground">{skill.evidenceSummary}</p><div className="mt-2 flex flex-wrap gap-2"><Badge variant="outline">Declared</Badge>{skill.assessedScore !== null && <Badge className="bg-blue-600">Assessment {Math.round(skill.assessedScore)}%</Badge>}{skill.trainingStatus === "COMPLETED" && <Badge className="bg-violet-600">Training completed</Badge>}{skill.projectEvidence && <Badge className="bg-emerald-600">Project repository</Badge>}</div></div>
        <div className="flex items-center gap-2 text-sm font-semibold">{skill.status === "VERIFIED" || skill.status === "PASSED" ? <><CheckCircle2 className="h-5 w-5 text-emerald-600"/>{skill.status}</> : <><CircleDashed className="h-5 w-5 text-muted-foreground"/>{skill.status}</>}</div>
      </div>)}
    </CardContent></Card>
    <Card><CardHeader className="border-b"><CardTitle className="flex items-center gap-2"><FolderGit2 className="h-5 w-5"/>GitHub project evidence</CardTitle></CardHeader><CardContent className="p-6">
      {data.projects.length === 0 ? <div className="space-y-3"><p className="text-sm text-muted-foreground">No GitHub project evidence submitted.</p><Button asChild><Link href="/candidate/projects">Attach repository</Link></Button></div> : <div className="space-y-3">{data.projects.map((project) => <div key={project.id} className="rounded-xl border p-4"><div className="flex items-center justify-between gap-3"><strong>{project.title}</strong><Badge variant="outline">{project.verificationStatus || "UNVERIFIED"}</Badge></div>{project.repositoryUrl && <a className="mt-2 block break-all text-xs text-primary hover:underline" href={project.repositoryUrl} target="_blank" rel="noreferrer">{project.repositoryUrl}</a>}<p className="mt-2 text-xs text-muted-foreground">{project.verificationReason || "No verification result."}</p></div>)}</div>}
    </CardContent></Card>
    <p className="flex items-start gap-2 text-xs text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0"/>Only a passing assessment or explicitly verified evidence contributes to matching. Repository accessibility alone is not verification.</p>
  </main>;
}
