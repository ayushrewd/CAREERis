"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Building2, CheckCircle2, FileText, MapPin, Pencil, PlusCircle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Profile = {
  companyName: string; designation: string | null; industry: string | null; cinNumber: string | null;
  headquarters: string | null; website: string | null; canPostJobs: boolean;
  contact: { fullName: string; email: string; phone: string | null };
  company: { legalName: string | null; description: string | null; isVerified: boolean; jobsPublished: number } | null;
};

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ companyName: "", designation: "", industry: "", cinNumber: "", headquarters: "", website: "", description: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  function applyProfile(next: Profile) {
    setProfile(next);
    setForm({ companyName: next.companyName, designation: next.designation || "", industry: next.industry || "", cinNumber: next.cinNumber || "", headquarters: next.headquarters || "", website: next.website || "", description: next.company?.description || "" });
  }

  useEffect(() => {
    fetch("/api/employer/profile", { cache: "no-store" }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      applyProfile(data.profile);
    }).catch((error) => setMessage(error instanceof Error ? error.message : "Could not load company profile.")).finally(() => setLoading(false));
  }, []);

  async function save(event: FormEvent) {
    event.preventDefault(); setLoading(true); setMessage("");
    try {
      const response = await fetch("/api/employer/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      applyProfile(data.profile); setEditing(false); setMessage("Company profile updated.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update company profile."); }
    finally { setLoading(false); }
  }

  if (loading && !profile) return <div className="p-10 text-center text-sm text-muted-foreground">Loading your company profile...</div>;
  if (!profile) return <div className="mx-auto max-w-3xl rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-700">{message || "Company profile unavailable."}</div>;

  return <main className="mx-auto max-w-5xl space-y-6 pb-16">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Registered company account</p><h1 className="mt-1 font-heading text-3xl font-extrabold">Company Profile</h1><p className="mt-2 text-sm text-muted-foreground">Organization details used on jobs published by your company.</p></div><div className="flex gap-2"><Button asChild><Link href="/employer/jobs/new"><PlusCircle className="mr-2 h-4 w-4"/>Publish Job</Link></Button><Button variant="outline" onClick={() => setEditing((value) => !value)}><Pencil className="mr-2 h-4 w-4"/>{editing ? "Cancel" : "Edit"}</Button></div></header>
    {message && <div className={`rounded-xl border p-3 text-sm ${message.includes("updated") ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700" : "border-red-500/30 bg-red-500/10 text-red-700"}`}>{message}</div>}
    <Card className="overflow-hidden"><div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500"/><CardContent className="p-6 sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div className="flex gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Building2 className="h-8 w-8"/></div><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-heading text-2xl font-bold">{profile.companyName}</h2><Badge variant="outline" className={profile.company?.isVerified ? "border-emerald-500/30 text-emerald-600" : "border-amber-500/30 text-amber-700"}><ShieldCheck className="mr-1 h-3 w-3"/>{profile.company?.isVerified ? "Verified company" : "Verification pending"}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{profile.industry || "Industry not provided"}</p></div></div><div className="rounded-xl border bg-muted/30 px-4 py-3 text-center"><strong className="block text-2xl">{profile.company?.jobsPublished || 0}</strong><span className="text-xs text-muted-foreground">Jobs published</span></div></div><div className="mt-7 grid gap-4 sm:grid-cols-2"><Info icon={MapPin} label="Headquarters" value={profile.headquarters}/><Info icon={FileText} label="CIN / Registration" value={profile.cinNumber}/><Info icon={CheckCircle2} label="Publishing permission" value={profile.canPostJobs ? "Company can publish jobs" : "Publishing disabled"}/><Info icon={Building2} label="Account administrator" value={`${profile.contact.fullName} · ${profile.designation || "Designation not provided"}`}/></div></CardContent></Card>
    {editing ? <Card><CardHeader><CardTitle>Edit company details</CardTitle></CardHeader><CardContent><form onSubmit={save} className="grid gap-4 sm:grid-cols-2"><Input required placeholder="Company name" value={form.companyName} onChange={(e)=>setForm({...form,companyName:e.target.value})}/><Input placeholder="Your designation" value={form.designation} onChange={(e)=>setForm({...form,designation:e.target.value})}/><Input placeholder="Industry" value={form.industry} onChange={(e)=>setForm({...form,industry:e.target.value})}/><Input placeholder="CIN / registration number" value={form.cinNumber} onChange={(e)=>setForm({...form,cinNumber:e.target.value})}/><Input placeholder="Headquarters" value={form.headquarters} onChange={(e)=>setForm({...form,headquarters:e.target.value})}/><Input type="url" placeholder="https://company.example" value={form.website} onChange={(e)=>setForm({...form,website:e.target.value})}/><Textarea className="sm:col-span-2" rows={5} placeholder="Company description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})}/><Button disabled={loading} type="submit" className="sm:col-span-2">{loading ? "Saving..." : "Save Company Profile"}</Button></form></CardContent></Card> : profile.company?.description && <Card><CardHeader><CardTitle>About the company</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-muted-foreground">{profile.company.description}</CardContent></Card>}
  </main>;
}

function Info({icon:Icon,label,value}:{icon:typeof MapPin;label:string;value:string|null}){return <div className="flex items-start gap-3 rounded-xl border p-4"><Icon className="mt-0.5 h-4 w-4 text-primary"/><div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium">{value || "Not provided"}</p></div></div>}
