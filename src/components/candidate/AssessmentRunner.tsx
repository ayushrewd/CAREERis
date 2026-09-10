"use client";

import React, { useState, useEffect } from "react";
import { AssessmentDefinition, AssessmentAttemptRecord, platformStore } from "@/lib/store/platformStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Clock, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssessmentRunnerProps {
  assessment: AssessmentDefinition;
  onComplete: (attempt: AssessmentAttemptRecord) => void;
  onExit: () => void;
}

export function AssessmentRunner({
  assessment,
  onComplete,
  onExit,
}: AssessmentRunnerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(assessment.durationMinutes * 60);
  const [isCompleted, setIsCompleted] = useState(false);
  const [attemptResult, setAttemptResult] = useState<AssessmentAttemptRecord | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  const currentQ = assessment.questions[currentQuestionIndex];
  const progressPercent = Math.round(
    ((currentQuestionIndex + 1) / assessment.questions.length) * 100
  );

  const selectOption = (optionIdx: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optionIdx,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const attempt = platformStore.submitAssessmentAttempt({
      assessmentId: assessment.id,
      answers: selectedAnswers,
    });
    setAttemptResult(attempt);
    setIsCompleted(true);
    onComplete(attempt);
  };

  const formatTimer = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // RESULTS VIEW AFTER SUBMISSION
  if (isCompleted && attemptResult) {
    return (
      <Card className="max-w-2xl mx-auto border-primary/40 shadow-xl animate-in zoom-in-95">
        <CardHeader className="text-center pb-4 border-b">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Award className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold font-heading">
            Assessment Completed!
          </CardTitle>
          <CardDescription className="text-xs">
            {assessment.title} &bull; Proctored Diagnostic Evaluation
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Score Display */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/30 border space-y-2 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Official Assessment Score
            </span>
            <div className="text-4xl font-extrabold font-heading text-foreground">
              {attemptResult.score}%
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={attemptResult.isPassed ? "success" : "destructive"}>
                {attemptResult.isPassed ? "PASSED & VERIFIED" : "NEEDS PRACTICE"}
              </Badge>
              <Badge variant="purple">
                Granted Proficiency: {attemptResult.proficiencyGranted}
              </Badge>
            </div>
          </div>

          {/* Strengths & Recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border bg-emerald-500/5 space-y-2">
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Demonstrated Strengths</span>
              </h4>
              <ul className="space-y-1 text-[11px] text-muted-foreground">
                {attemptResult.strengths.map((s, i) => (
                  <li key={i}>&bull; {s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border bg-amber-500/5 space-y-2">
              <h4 className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Areas for Mastery</span>
              </h4>
              <ul className="space-y-1 text-[11px] text-muted-foreground">
                {attemptResult.weaknesses.map((w, i) => (
                  <li key={i}>&bull; {w}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Skill Passport updated with verified badge.</span>
            </div>
            <span className="font-bold text-primary">Readiness +4.2%</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button onClick={onExit} className="text-xs font-semibold">
              Return to Assessments Catalog &rarr;
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ACTIVE QUESTION RUNNER
  return (
    <Card className="max-w-3xl mx-auto border shadow-xl">
      {/* Header bar: Progress & Timer */}
      <CardHeader className="pb-3 border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
              {assessment.code}
            </span>
            <h3 className="font-semibold text-sm text-foreground">
              {assessment.title}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-background border font-mono text-xs font-bold text-foreground">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
            <span>
              Question {currentQuestionIndex + 1} of {assessment.questions.length}
            </span>
            <span>{progressPercent}% Completed</span>
          </div>
          <ProgressBar value={progressPercent} size="sm" showValue={false} />
        </div>
      </CardHeader>

      {/* Question & Options */}
      <CardContent className="p-6 space-y-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
            Difficulty: {currentQ.difficulty} &bull; Skill: {assessment.skillName}
          </span>
          <h4 className="text-base font-semibold font-heading text-foreground leading-relaxed">
            {currentQ.question}
          </h4>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQ.id] === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => selectOption(idx)}
                className={cn(
                  "w-full p-4 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between",
                  isSelected
                    ? "bg-primary/10 border-primary text-primary font-semibold shadow-sm"
                    : "bg-card hover:bg-muted/40 text-foreground border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </button>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <div className="pt-4 border-t flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="text-xs"
          >
            &larr; Previous Question
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onExit}
              className="text-xs"
            >
              Exit
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              disabled={selectedAnswers[currentQ.id] === undefined}
              className="text-xs font-semibold"
            >
              {currentQuestionIndex === assessment.questions.length - 1
                ? "Submit Assessment & Verify"
                : "Next Question \u2192"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
