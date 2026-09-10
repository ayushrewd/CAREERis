"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, ArrowLeft, Bot, User, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  groundingLabel?: "FACT" | "FORECAST" | "SIMULATION" | "RECOMMENDATION" | "INSUFFICIENT_DATA";
  sourcesUsed?: string[];
  suggestedFollowUpActions?: Array<{ title: string; actionUrl: string }>;
}

const SAMPLE_QUERIES = [
  "Which candidates best match our BMS Calibration Specialist vacancy?",
  "Which skills are hardest to hire in the Pune-Chakan corridor?",
  "Should we hire or train for our 32-technician EV expansion?",
  "Where can we find available talent for 5-Axis CNC Machining?",
];

export default function EmployerCopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your **CareerIS Recruitment Copilot**. I provide grounded recruitment, talent supply, and workforce decision intelligence backed by the live CareerIS Skill Graph and National Skill Registry data.\n\nHow can I support your talent acquisition and workforce planning today?",
      groundingLabel: "FACT",
      sourcesUsed: ["CareerIS Skill Graph", "National Skill Registry"],
      suggestedFollowUpActions: [
        { title: "Candidate Discovery", actionUrl: "/employer/candidates" },
        { title: "Hire vs Train Engine", actionUrl: "/employer/workforce" },
      ],
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg: Message = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/employer/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerId: "comp-tata-motors",
          query: q,
        }),
      }).then((r) => r.json());

      if (res.success && res.data) {
        const botMsg: Message = {
          role: "assistant",
          content: res.data.answer,
          groundingLabel: res.data.groundingLabel,
          sourcesUsed: res.data.groundingData?.sourcesUsed,
          suggestedFollowUpActions: res.data.suggestedFollowUpActions,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/employer">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Command Center
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-heading">Recruitment &amp; Talent Copilot</h1>
            <Badge variant="success" className="text-[10px] gap-1">
              <ShieldCheck className="w-3 h-3" /> Grounded in CareerIS Data
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Deterministic AI decision support for hiring managers, recruiters, and workforce planners
          </p>
        </div>
      </div>

      {/* Suggested Queries */}
      <div className="flex flex-wrap gap-2">
        {SAMPLE_QUERIES.map((sq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sq)}
            className="text-[11px] px-3 py-1.5 rounded-xl border bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all text-left"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <Card className="shadow-subtle min-h-[480px] flex flex-col justify-between">
        <CardContent className="p-6 space-y-4 overflow-y-auto max-h-[550px]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary border border-primary/20"
                }`}
              >
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs space-y-2 max-w-[85%] ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted/30 border rounded-tl-none space-y-3"
                }`}
              >
                {m.groundingLabel && (
                  <div className="flex items-center gap-2">
                    <Badge variant={m.groundingLabel === "FACT" ? "success" : "primary"} className="text-[9px]">
                      {m.groundingLabel}
                    </Badge>
                    {m.sourcesUsed && (
                      <span className="text-[10px] text-muted-foreground">
                        Sources: {m.sourcesUsed.join(", ")}
                      </span>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-line leading-relaxed">{m.content}</div>

                {m.suggestedFollowUpActions && m.suggestedFollowUpActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    {m.suggestedFollowUpActions.map((act, aIdx) => (
                      <Link key={aIdx} href={act.actionUrl}>
                        <Button size="sm" variant="outline" className="text-[11px] h-7 px-2.5">
                          {act.title}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-3">
              <Sparkles className="w-4 h-4 animate-spin text-primary" />
              <span>Analyzing Skill Graph and candidate pipeline...</span>
            </div>
          )}
        </CardContent>

        {/* Input Bar */}
        <div className="p-4 border-t bg-card/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about candidate matches, skill shortages, or hire vs train decisions..."
              className="flex-1 px-4 py-2 text-xs rounded-xl border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
            />
            <Button type="submit" size="sm" disabled={loading || !inputQuery.trim()} className="gap-1">
              <Send className="w-3.5 h-3.5" /> Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
