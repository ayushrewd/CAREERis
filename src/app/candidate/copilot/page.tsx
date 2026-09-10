"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataProvenancePanel } from "@/components/intelligence/DataProvenancePanel";
import { Bot, Send, User, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  content: string;
  supportingData?: any;
  suggestedActions?: string[];
  confidence?: number;
  timestamp: string;
}

export default function CandidateCopilotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-01",
      sender: "copilot",
      content: "Hello Rohit! I am your CareerIS AI Career Copilot. I analyze your profile against Battery Management System (BMS) Calibration Specialist requirements and live employer demand in Chakan & Pune industrial clusters. How can I assist your career progression today?",
      supportingData: {
        relevantSkills: ["Battery Management Systems (BMS)", "CAN Bus Communication", "PLC Automation & SCADA"],
        readinessScore: 89,
        matchingJobsCount: 6,
      },
      suggestedActions: [
        "What skill should I learn next?",
        "Which jobs match my verified credentials?",
        "How do I transition to EV Battery tech?",
      ],
      confidence: 0.96,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(textToSend?: string) {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/candidate/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: "cand-rohit-01",
          message: text,
        }),
      }).then((r) => r.json());

      if (res.success) {
        const copilotMsg: ChatMessage = {
          id: `copilot-${Date.now()}`,
          sender: "copilot",
          content: res.data.answer,
          supportingData: res.data.supportingData,
          suggestedActions: res.data.suggestedNextActions,
          confidence: res.data.confidence,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, copilotMsg]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border bg-gradient-to-r from-card via-card/95 to-primary/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary font-mono text-[10px] border-primary/30">
                Deterministic Grounding
              </Badge>
              <Badge variant="success" className="text-[10px] font-mono">
                Live Data Connected
              </Badge>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold font-heading text-foreground mt-1">
              AI Career Copilot
            </h1>
            <p className="text-xs text-muted-foreground">
              Directly answers questions using your Skill Passport, course health metrics, and verified regional employer demand.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {[
          "What skill should I learn next?",
          "Which jobs match my verified credentials?",
          "Why is my readiness score 89%?",
          "How do I transition to EV Battery tech?",
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="px-3 py-1.5 rounded-full border bg-card/80 hover:bg-primary/10 hover:border-primary/40 text-xs text-foreground transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-primary" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <Card className="min-h-[450px] max-h-[600px] flex flex-col justify-between bg-card/80 border-border/80 shadow-subtle overflow-hidden">
        <div className="p-4 md:p-6 overflow-y-auto space-y-4 flex-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "copilot" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs space-y-3 leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground font-medium rounded-tr-none ml-12"
                    : "bg-background border border-border/70 text-foreground rounded-tl-none mr-12 shadow-sm"
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Supporting Data Pill if Copilot */}
                {msg.supportingData && (
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-2 text-[11px] text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Grounded Supporting Evidence:</span>
                      {msg.confidence && (
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          Confidence: {Math.round(msg.confidence * 100)}%
                        </span>
                      )}
                    </div>
                    {msg.supportingData.relevantSkills && (
                      <div className="flex flex-wrap gap-1">
                        {msg.supportingData.relevantSkills.map((s: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Suggested Next Action Buttons */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Recommended Next Actions:
                    </span>
                    <div className="space-y-1">
                      {msg.suggestedActions.map((action, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`text-[10px] ${msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"} text-right`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-muted-foreground animate-pulse p-2">
              <Bot className="w-4 h-4 text-primary animate-spin" />
              AI Copilot is analyzing Skill Graph and employer requisitions...
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-muted/20 border-t border-border/80 flex items-center gap-2">
          <Input
            placeholder="Ask anything about your career path, missing skills, or employer requirements..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
            className="text-xs bg-background"
          />
          <Button onClick={() => handleSend()} disabled={loading || !inputMessage.trim()} size="sm" className="gap-1.5 shrink-0">
            <Send className="w-3.5 h-3.5" />
            Send
          </Button>
        </div>
      </Card>

      <DataProvenancePanel
        sources={["CareerIS Skill Graph Knowledge Engine", "National Occupational Standards", "Enterprise Requisition Telemetry"]}
        timePeriod="2026-Q2 Live"
        confidenceScore={96}
        methodology="Deterministic Provider Fallback with Semantic Grounding in Live Relational Store"
        isSyntheticPilotData={false}
      />
    </div>
  );
}
