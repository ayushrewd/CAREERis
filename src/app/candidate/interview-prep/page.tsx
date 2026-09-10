"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare, CheckCircle2, ShieldCheck, ArrowRight, HelpCircle } from "lucide-react";

export default function CandidateInterviewPrepPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/candidate/interview-practice")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.length > 0) {
          setQuestions(res.data);
          setSelectedQuestion(res.data[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <MessageSquare className="w-3.5 h-3.5 mr-1" /> INTERVIEW PREPARATION &amp; SIMULATION
            </Badge>
          </div>
          <h1 className="text-xl font-bold font-heading pt-1">
            Role-Specific Technical &amp; Situational Mock Scenarios
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Practice real employer questions matched directly to your target role and critical skill requirements
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Questions List */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold font-heading">Available Questions</h2>
          {questions.map((q) => (
            <Card
              key={q.questionId}
              onClick={() => setSelectedQuestion(q)}
              className={`p-3 cursor-pointer transition-all ${
                selectedQuestion?.questionId === q.questionId
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between gap-1 pb-1">
                <Badge variant="outline" className="text-[9px] font-mono">{q.questionType}</Badge>
                <span className="text-[10px] text-muted-foreground">{q.roleTarget}</span>
              </div>
              <p className="text-xs font-semibold text-foreground line-clamp-2">{q.questionText}</p>
            </Card>
          ))}
        </div>

        {/* Question Practice Arena */}
        {selectedQuestion && (
          <div className="md:col-span-2 space-y-4">
            <Card className="shadow-subtle">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono">{selectedQuestion.questionType}</Badge>
                  <Badge variant="success" className="text-[10px]">ASDC Mapped</Badge>
                </div>
                <CardTitle className="text-base font-bold pt-1">{selectedQuestion.questionText}</CardTitle>
                <CardDescription className="text-xs">
                  Target Role: <span className="font-bold text-foreground">{selectedQuestion.roleTarget}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <span className="font-bold text-foreground block">Key Skills Evaluated:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedQuestion.expectedSkills?.map((s: string) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">
                        ✓ {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg border bg-muted/20 space-y-1.5">
                  <span className="font-bold text-foreground block text-[11px]">Recommended Technical Structure:</span>
                  <p className="text-muted-foreground leading-relaxed">{selectedQuestion.sampleAnswerOutline}</p>
                </div>

                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-1.5">
                  <span className="font-bold text-primary block text-[11px]">Evaluator Scoring Rubric:</span>
                  <p className="text-muted-foreground leading-relaxed">{selectedQuestion.scoringRubric}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
