"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, BookOpen, BriefcaseBusiness, CheckCircle2, ExternalLink, Search, Sparkles, Target, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RoleResult = { id: string; title: string; sector: string; activePostings: number; employers: string[]; latestEvidenceAt: string | null };
type Evidence = { type: string; signal: string; employer: string; posting: string; source: string; sourceId: string; timestamp: string };
type Requirement = { skillId: string; name: string; requiredLevel: string; evidence: Evidence[] };
type Question = { id: string; skill: string; prompt: string; options: string[] };
type SkillResult = { skill: string; correct: number; total: number; percentage: number; status: "ASSESSED" };
type Recommendation = { skill: string; title: string; provider: string; durationHours: number; source: string; actionUrl: string };

export default function CandidateCareerGoalPage() {
  const [query, setQuery] = useState("");
  const [roles, setRoles] = useState<RoleResult[]>([]);
  const [suggestedRoles, setSuggestedRoles] = useState<RoleResult[]>([]);
  const [selectedRole, setSelectedRole] = useState<{ id: string; title: string; sector: string } | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [insufficientEvidence, setInsufficientEvidence] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assessmentId, setAssessmentId] = useState("");
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [results, setResults] = useState<SkillResult[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    fetch("/api/candidate/role-evidence", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        setSelectedRole(data.selectedRole || null);
        setRequirements(data.requirements || []);
        setInsufficientEvidence(!!data.insufficientEvidence);
        if (Array.isArray(data.suggestedRoles)) {
          setSuggestedRoles(data.suggestedRoles);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setRoles([]);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/candidate/role-evidence?q=${encodeURIComponent(query.trim())}`, { signal: controller.signal });
        const data = await response.json();
        if (response.ok) setRoles(data.roles || []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setError("Could not search employer evidence.");
      }
    }, 250);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  async function chooseRole(roleId: string) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/candidate/role-evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSelectedRole(data.selectedRole);
      setRequirements(data.requirements || []);
      setInsufficientEvidence(!!data.insufficientEvidence);
      setRoles([]);
      setQuery("");
      setQuestions([]);
      setResults([]);
      setRecommendations([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not select role.");
    } finally {
      setLoading(false);
    }
  }

  async function startDiagnostic() {
    setLoading(true);
    setError("");
    setResults([]);
    setRecommendations([]);
    try {
      const response = await fetch("/api/candidate/diagnostic/generate", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setAssessmentId(data.assessmentId);
      setAssessmentTitle(data.title);
      setQuestions(data.questions);
      setAnswers(Array(data.questions.length).fill(-1));
      setCurrentQuestion(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate assessment.");
    } finally {
      setLoading(false);
    }
  }

  async function submitAssessment() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/candidate/diagnostic/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, answers }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResults(data.results || []);
      setRecommendations(data.recommendations || []);
      setQuestions([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not score assessment.");
    } finally {
      setLoading(false);
    }
  }

  const activeQuestion = questions[currentQuestion];

  return (
    <main className="mx-auto max-w-5xl space-y-6 pb-16">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Career Goal</p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold">What role are you targeting?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Search roles supported by connected employer and job-posting evidence.
        </p>
      </header>

      <Card>
        <CardContent className="space-y-4 p-5">
          <Input
            id="role-search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search jobs published by registered CAREERIS companies"
            icon={<Search className="h-4 w-4" />}
          />

          {query.trim().length >= 2 && roles.length === 0 && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">No evidence-backed matching roles found for &quot;{query}&quot;.</p>
              <p className="mt-1">Only active jobs published by companies registered on CAREERIS are shown.</p>
            </div>
          )}

          {query.trim().length < 2 && !selectedRole && suggestedRoles.length === 0 && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">No company jobs have been published yet.</p>
              <p className="mt-1">Roles will appear here after a registered company publishes a real job with skill requirements.</p>
            </div>
          )}

          {roles.length > 0 && (
            <div className="mt-3 divide-y rounded-xl border">
              {roles.map((role) => (
                <button
                  key={role.id}
                  disabled={loading}
                  onClick={() => chooseRole(role.id)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-muted/50"
                >
                  <div>
                    <p className="font-semibold text-foreground">{role.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {role.sector} · {role.activePostings} active posting(s) · {role.employers.length} employer(s): {role.employers.join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                    <span>Select Role</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Show suggested roles if no search and no selected role yet */}
          {query.trim().length < 2 && !selectedRole && suggestedRoles.length > 0 && (
            <div className="mt-4 pt-2">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Available Evidence-Backed Employer Roles
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {suggestedRoles.map((role) => (
                  <button
                    key={role.id}
                    disabled={loading}
                    onClick={() => chooseRole(role.id)}
                    className="flex flex-col justify-between rounded-xl border p-3.5 text-left transition hover:border-primary/50 hover:bg-muted/40"
                  >
                    <div>
                      <p className="font-semibold text-foreground text-sm">{role.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{role.sector}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{role.activePostings} active posting(s)</span>
                      <span className="font-medium text-primary flex items-center gap-1">
                        Select <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {selectedRole && (
        <Card className="border-primary/30 shadow-sm">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">{selectedRole.title}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">{selectedRole.sector} · Target Role Established</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Active Target
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold">Required Skills & Employer Evidence</h2>
              <span className="text-xs text-muted-foreground">{requirements.length} skill(s) backed by registered job postings</span>
            </div>

            {insufficientEvidence || requirements.length === 0 ? (
              <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm font-semibold text-amber-800 dark:text-amber-200">
                <AlertTriangle className="h-5 w-5" /> Insufficient evidence to establish requirement
              </div>
            ) : (
              <div className="space-y-3">
                {requirements.map((requirement) => (
                  <div key={requirement.skillId} className="rounded-xl border p-4 transition hover:border-primary/30">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm font-semibold">{requirement.name}</strong>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {requirement.requiredLevel}
                      </span>
                    </div>
                    <details className="mt-3 text-xs" open={requirement.evidence.length <= 2}>
                      <summary className="cursor-pointer font-semibold text-muted-foreground hover:text-foreground">
                        Employer Evidence ({requirement.evidence.length} signal{requirement.evidence.length !== 1 ? "s" : ""})
                      </summary>
                      <div className="mt-3 space-y-2">
                        {requirement.evidence.map((item) => (
                          <div
                            key={`${item.sourceId}-${requirement.skillId}-${item.employer}`}
                            className="rounded-lg bg-muted/40 p-3 leading-5 text-muted-foreground border border-border/40"
                          >
                            <p>
                              <strong className="text-foreground">Employer:</strong> {item.employer}
                            </p>
                            <p>
                              <strong className="text-foreground">Job-posting signal:</strong> {item.posting}
                            </p>
                            <p>
                              <strong className="text-foreground">Source:</strong>{" "}
                              <a className="text-primary hover:underline" href={item.source}>
                                {item.sourceId}
                              </a>
                            </p>
                            <p>
                              <strong className="text-foreground">Timestamp:</strong>{" "}
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}

            <Button
              disabled={loading || insufficientEvidence || requirements.length === 0}
              onClick={startDiagnostic}
              className="w-full gap-2 h-11 text-sm font-semibold"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating fresh assessment..." : "Start Skill Diagnostic"}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeQuestion && (
        <Card className="border-primary/40 shadow-md">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle>{assessmentTitle}</CardTitle>
            <p className="text-xs text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length} · Skill: <strong className="text-primary">{activeQuestion.skill}</strong>
            </p>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <h2 className="font-heading text-lg font-bold leading-7">{activeQuestion.prompt}</h2>
            <div className="space-y-2.5">
              {activeQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setAnswers((items) =>
                      items.map((answer, answerIndex) => (answerIndex === currentQuestion ? index : answer))
                    )
                  }
                  className={`w-full rounded-xl border p-4 text-left text-sm transition ${
                    answers[currentQuestion] === index
                      ? "border-primary bg-primary/10 ring-1 ring-primary font-medium"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <span className="font-bold mr-2 text-primary">{String.fromCharCode(65 + index)}.</span> {option}
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              {currentQuestion < questions.length - 1 ? (
                <Button
                  disabled={answers[currentQuestion] < 0}
                  onClick={() => setCurrentQuestion((step) => step + 1)}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  disabled={loading || answers.some((answer) => answer < 0)}
                  onClick={submitAssessment}
                >
                  {loading ? "Calculating..." : "Submit Assessment"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <section className="space-y-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Assessment Result</CardTitle>
              <p className="text-xs text-muted-foreground">
                Status updated from Declared to Assessed. Skill scores verified against diagnostic assessment.
              </p>
            </CardHeader>
            <CardContent className="divide-y p-0">
              {results.map((result) => (
                <div key={result.skill} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div>
                    <strong className="text-sm">{result.skill}</strong>
                    <p className="text-xs text-muted-foreground">
                      {result.correct}/{result.total} correct
                    </p>
                  </div>
                  <div className="text-right">
                    <strong className={`text-lg ${result.percentage >= 70 ? "text-emerald-600" : "text-amber-600"}`}>
                      {result.percentage}%
                    </strong>
                    <p className="text-xs font-semibold text-blue-600">Assessed</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Courses & Learning Resources for Identified Skill Gaps</CardTitle>
              <p className="text-xs text-muted-foreground">
                Recommendations appear from verified training-provider course records and recommended curricula.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              {recommendations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No matching courses required — all assessed skills passed benchmark!</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {recommendations.map((course) => (
                    <a
                      key={`${course.actionUrl}-${course.skill}`}
                      href={course.actionUrl}
                      target={course.actionUrl.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="rounded-xl border p-4 transition hover:border-primary/40 hover:bg-muted/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <h3 className="mt-3 font-semibold text-sm">{course.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {course.provider} · Target Skill: {course.skill}
                      </p>
                      <p className="mt-2 text-[11px] text-muted-foreground">Source: {course.source}</p>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </main>
  );
}
