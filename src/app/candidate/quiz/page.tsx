"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BrainCircuit, CheckCircle2, ExternalLink, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PassportSkill = { id: string; name: string; status: "DECLARED" | "ASSESSED"; assessedScore: number | null };
type Question = { id: string; skill: string; prompt: string; options: string[] };
type Result = { skill: string; correct: number; total: number; percentage: number; status: "ASSESSED" };
type Recommendation = { skill: string; title: string; provider: string; source: string; actionUrl: string };

export default function CandidateQuizPage() {
  const [skills, setSkills] = useState<PassportSkill[]>([]);
  const [assessmentId, setAssessmentId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [engine, setEngine] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSkills() {
    const response = await fetch("/api/candidate/skill-passport", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load declared skills.");
    setSkills(data.skills || []);
  }

  useEffect(() => {
    loadSkills().catch((err) => setError(err instanceof Error ? err.message : "Could not load skills.")).finally(() => setLoading(false));
  }, []);

  async function startAssessment() {
    setLoading(true); setError(""); setResults([]); setRecommendations([]);
    try {
      const response = await fetch("/api/candidate/diagnostic/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: "DECLARED_SKILLS" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not generate assessment.");
      setAssessmentId(data.assessmentId);
      setQuestions(data.questions || []);
      setAnswers(Array(data.questions.length).fill(-1));
      setCurrent(0);
      setEngine(data.engine || "ADAPTIVE_LOCAL");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate assessment.");
    } finally { setLoading(false); }
  }

  async function submitAssessment() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/candidate/diagnostic/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, answers }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit assessment.");
      setResults(data.results || []);
      setRecommendations(data.recommendations || []);
      setQuestions([]);
      await loadSkills();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit assessment.");
    } finally { setLoading(false); }
  }

  const active = questions[current];
  const answered = answers.filter((answer) => answer >= 0).length;

  if (loading && skills.length === 0) return <div className="py-16 text-center text-sm text-muted-foreground">Loading your assessment...</div>;

  return (
    <main className="mx-auto max-w-4xl space-y-6 pb-16">
      <header className="rounded-2xl border bg-gradient-to-r from-card to-primary/10 p-6 shadow-sm sm:p-8">
        <Badge variant="outline" className="mb-3 gap-1.5 border-primary/30 text-primary"><BrainCircuit className="h-3.5 w-3.5" />Skill Diagnostic</Badge>
        <h1 className="font-heading text-3xl font-extrabold">Assess every skill you declared</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Every declared skill receives a question. A new attempt creates fresh wording and shuffled answers; configured AI generation is used automatically when available.</p>
      </header>

      {error && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">{error}</div>}

      {!active && results.length === 0 && (
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><CardTitle>Assessment scope</CardTitle><p className="mt-1 text-xs text-muted-foreground">Loaded directly from your real Skill Passport.</p></div>
              <Badge>{skills.length} skills · {skills.length} questions</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            {skills.length === 0 ? <p className="text-sm text-muted-foreground">No declared skills found. Add skills while creating or editing your candidate profile.</p> : (
              <div className="grid gap-2 sm:grid-cols-2">
                {skills.map((skill) => <div key={skill.id} className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm"><span className="font-medium">{skill.name}</span><Badge variant="outline" className={skill.status === "ASSESSED" ? "border-blue-500/30 text-blue-600" : "border-amber-500/30 text-amber-700"}>{skill.status === "ASSESSED" ? `${Math.round(skill.assessedScore || 0)}% Assessed` : "Declared"}</Badge></div>)}
              </div>
            )}
            <Button size="lg" disabled={loading || skills.length === 0} onClick={startAssessment} className="w-full gap-2">
              {loading ? <><RefreshCw className="h-4 w-4 animate-spin" />Generating fresh questions...</> : <><Sparkles className="h-4 w-4" />Start assessment for all {skills.length} skills<ArrowRight className="ml-auto h-4 w-4" /></>}
            </Button>
          </CardContent>
        </Card>
      )}

      {active && (
        <Card className="overflow-hidden">
          <div className="h-1.5 bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><CardTitle>Question {current + 1} of {questions.length}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{answered}/{questions.length} answered · {engine === "AI_GENERATED" ? "Fresh AI-generated attempt" : "Fresh adaptive attempt"}</p></div><Badge>{active.skill}</Badge></div>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <h2 className="font-heading text-lg font-bold leading-7">{active.prompt}</h2>
            <div className="space-y-2">
              {active.options.map((option, index) => <button key={index} type="button" onClick={() => setAnswers((items) => items.map((answer, answerIndex) => answerIndex === current ? index : answer))} className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm transition ${answers[current] === index ? "border-primary bg-primary/10 ring-1 ring-primary" : "hover:bg-muted/50"}`}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${answers[current] === index ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{String.fromCharCode(65 + index)}</span><span className="pt-0.5">{option}</span></button>)}
            </div>
            <div className="flex items-center justify-between gap-3 border-t pt-5">
              <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((index) => index - 1)}><ArrowLeft className="mr-2 h-4 w-4" />Previous</Button>
              {current < questions.length - 1 ? <Button disabled={answers[current] < 0} onClick={() => setCurrent((index) => index + 1)}>Next<ArrowRight className="ml-2 h-4 w-4" /></Button> : <Button disabled={loading || answers.some((answer) => answer < 0)} onClick={submitAssessment}>{loading ? "Calculating..." : "Submit all answers"}</Button>}
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <section className="space-y-6">
          <Card>
            <CardHeader className="border-b"><div className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-emerald-600" /><div><CardTitle>Assessment recorded</CardTitle><p className="mt-1 text-xs text-muted-foreground">Declared → Assessed. This does not claim employer verification.</p></div></div></CardHeader>
            <CardContent className="divide-y p-0">{results.map((result) => <div key={result.skill} className="flex items-center justify-between gap-4 px-6 py-4"><div><strong>{result.skill}</strong><p className="text-xs text-muted-foreground">{result.correct}/{result.total} correct</p></div><div className="text-right"><strong className="text-lg">{result.percentage}%</strong><p className="text-xs font-semibold text-blue-600">Assessed</p></div></div>)}</CardContent>
          </Card>
          {recommendations.length > 0 && <Card><CardHeader className="border-b"><CardTitle>Learning for weak skills</CardTitle></CardHeader><CardContent className="grid gap-3 p-6 sm:grid-cols-2">{recommendations.map((item) => <a key={`${item.actionUrl}-${item.skill}`} href={item.actionUrl} target={item.actionUrl.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="rounded-xl border p-4 hover:border-primary/40"><ExternalLink className="h-4 w-4 text-primary" /><h3 className="mt-2 font-semibold">{item.title}</h3><p className="mt-1 text-xs text-muted-foreground">{item.provider} · {item.skill}</p><p className="mt-2 text-[11px] text-muted-foreground">{item.source}</p></a>)}</CardContent></Card>}
          <div className="flex flex-col gap-3 sm:flex-row"><Button onClick={startAssessment} disabled={loading} className="flex-1 gap-2"><RefreshCw className="h-4 w-4" />Retake with fresh questions</Button><Button asChild variant="outline" className="flex-1 gap-2"><Link href="/candidate/skill-passport"><ShieldCheck className="h-4 w-4" />Open Skill Passport</Link></Button></div>
        </section>
      )}
    </main>
  );
}
