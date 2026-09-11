"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const emptyForm = {
  type: "EMPLOYER_SURVEYS",
  title: "",
  period: "",
  location: "",
  methodology: "",
  sourceUrl: "",
  observedAt: new Date().toISOString().slice(0, 10),
  skills: "",
};

export default function EmployerEvidencePage() {
  const [sources, setSources] = useState<any[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const load = useCallback(async () => {
    const response = await fetch("/api/employer/evidence", { cache: "no-store" });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error);
    setSources(body.sources || []);
  }, []);
  useEffect(() => { load().catch((reason) => setError(reason.message)); }, [load]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    const skills = form.skills.split("\n").map((line) => {
      const [name = "", quantity = "0", proficiency = "INTERMEDIATE", description = ""] = line.split("|").map((value) => value.trim());
      return { name, quantity: Number(quantity) || 0, proficiency, description };
    }).filter((skill) => skill.name);
    const response = await fetch("/api/employer/evidence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sourceUrl: form.sourceUrl || null, skills }),
    });
    const body = await response.json();
    setSaving(false);
    if (!response.ok) { setError(body.error || "Could not save evidence"); return; }
    setForm(emptyForm);
    setError("");
    await load();
  }

  return <main className="mx-auto max-w-6xl space-y-6 pb-16">
    <header>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Registered company evidence</p>
      <h1 className="mt-1 text-3xl font-extrabold">Industry demand signals</h1>
      <p className="mt-2 text-sm text-muted-foreground">Submit real surveys, consultations, sector observations or sourced technology signals. A technology signal is not treated as labour demand until company demand evidence validates it.</p>
    </header>
    {error && <div className="rounded-xl border border-red-500/30 p-4 text-sm text-red-600">{error}</div>}
    <Card><CardHeader><CardTitle>Add evidence</CardTitle></CardHeader><CardContent>
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold">Evidence type<select className="mt-1 h-10 w-full rounded-md border bg-background px-3" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option value="EMPLOYER_SURVEYS">Employer survey</option><option value="INDUSTRY_CONSULTATION">Industry consultation</option><option value="SECTOR_DATA">Sector growth data</option><option value="TECHNOLOGY_TRENDS">Emerging technology signal</option></select></label>
        <label className="text-sm font-semibold">Observation date<Input className="mt-1" type="date" required value={form.observedAt} onChange={(event) => setForm({ ...form, observedAt: event.target.value })}/></label>
        <Input required placeholder="Evidence title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })}/>
        <Input required placeholder="Period, e.g. Q2 2026" value={form.period} onChange={(event) => setForm({ ...form, period: event.target.value })}/>
        <Input required placeholder="District / location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })}/>
        <Input type="url" placeholder="Source URL (required for sector/technology data)" value={form.sourceUrl} onChange={(event) => setForm({ ...form, sourceUrl: event.target.value })}/>
        <label className="text-sm font-semibold md:col-span-2">Collection method<Textarea className="mt-1" required placeholder="Who was surveyed, how the observation was collected, and what the quantity represents" value={form.methodology} onChange={(event) => setForm({ ...form, methodology: event.target.value })}/></label>
        <label className="text-sm font-semibold md:col-span-2">One skill per line: Skill | observed quantity | proficiency | note<Textarea className="mt-1 font-mono" rows={6} required placeholder="Battery Management Systems | 12 | ADVANCED | Planned hiring in the next quarter" value={form.skills} onChange={(event) => setForm({ ...form, skills: event.target.value })}/></label>
        <Button className="md:col-span-2" disabled={saving} type="submit">{saving ? "Saving evidence…" : "Submit evidence"}</Button>
      </form>
    </CardContent></Card>
    {sources.length === 0 ? <Card><CardContent className="p-8 text-sm text-muted-foreground">No company survey, consultation, sector or technology evidence has been submitted.</CardContent></Card> : <div className="space-y-3">{sources.map((source) => <Card key={source.id}><CardContent className="p-5"><div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="font-bold">{source.name}</h2><p className="text-xs text-muted-foreground">{source.geographyScope} · {source.timePeriod} · {new Date(source.collectionDate).toLocaleDateString()}</p></div><Badge variant="outline">{source.sourceType.replaceAll("_", " ")}</Badge></div><p className="mt-3 text-sm">{source.methodology}</p><p className="mt-3 text-xs text-muted-foreground">{source.demandSignals.map((signal: any) => `${signal.skill.name}: ${signal.openPositions} (${signal.proficiency || "proficiency not provided"})`).join(" · ") || source.technologySignals.map((signal: any) => `${signal.skill.name}: technology signal only`).join(" · ")}</p></CardContent></Card>)}</div>}
  </main>;
}
