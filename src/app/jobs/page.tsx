"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Building2, MapPin, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [filters, setFilters] = useState({ q: "", location: "", skill: "", sector: "" });
  async function load(event?: FormEvent) { event?.preventDefault(); setLoading(true); setError(""); const params = new URLSearchParams(Object.entries(filters).filter(([,v]) => v.trim())); try { const r = await fetch(`/api/jobs?${params}`, { cache: "no-store" }); const b = await r.json(); if (!r.ok) throw new Error(b.error); setJobs(b.jobs || []); } catch(e) { setError(e instanceof Error ? e.message : "Could not load jobs"); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  return <main className="mx-auto max-w-6xl space-y-6 pb-16"><header><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Explore jobs</p><h1 className="mt-1 text-3xl font-extrabold">Jobs from registered companies</h1><p className="mt-2 text-sm text-muted-foreground">Only active jobs published by company accounts registered on CAREERIS appear here.</p></header>
    <form onSubmit={load} className="grid gap-3 rounded-2xl border bg-card p-4 md:grid-cols-5"><Input value={filters.q} onChange={(e)=>setFilters({...filters,q:e.target.value})} placeholder="Role or company" icon={<Search className="h-4 w-4"/>}/><Input value={filters.location} onChange={(e)=>setFilters({...filters,location:e.target.value})} placeholder="Location"/><Input value={filters.skill} onChange={(e)=>setFilters({...filters,skill:e.target.value})} placeholder="Skill"/><Input value={filters.sector} onChange={(e)=>setFilters({...filters,sector:e.target.value})} placeholder="Sector"/><Button type="submit">Apply filters</Button></form>
    {error && <div className="rounded-xl border border-red-500/30 p-4 text-sm text-red-600">{error}</div>}{loading ? <p className="text-sm text-muted-foreground">Loading company job records…</p> : jobs.length === 0 ? <Card><CardContent className="p-10 text-center"><Briefcase className="mx-auto h-8 w-8 text-muted-foreground"/><h2 className="mt-3 font-bold">No matching active jobs</h2><p className="mt-1 text-sm text-muted-foreground">A job will appear only after a registered company publishes it.</p></CardContent></Card> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{jobs.map((job)=><Card key={job.id}><CardContent className="flex h-full flex-col p-5"><div className="flex items-start justify-between gap-3"><Building2 className="h-5 w-5 text-primary"/><Badge variant="outline">{job.jobType.replaceAll("_"," ")}</Badge></div><p className="mt-4 text-xs font-bold uppercase tracking-wide text-primary">{job.company}</p><h2 className="mt-1 text-lg font-bold">{job.title}</h2><p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground">{job.description}</p><p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5"/>{job.location || "Location not provided"}</p><div className="mt-3 flex flex-wrap gap-1">{job.requirements.slice(0,5).map((req:any)=><Badge key={`${req.name}-${req.proficiency}`} variant="secondary">{req.name}</Badge>)}</div><Button asChild className="mt-5 w-full"><Link href={`/jobs/${job.id}`}>View match & apply</Link></Button></CardContent></Card>)}</div>}
  </main>;
}
