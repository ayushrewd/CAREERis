"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, Send, ShieldCheck, ArrowRight, BookOpen, Layers, Scale } from "lucide-react";
import Link from "next/link";

interface Message {
  sender: "user" | "copilot";
  text: string;
  groundingLabel?: "FACT" | "ANALYSIS" | "FORECAST" | "SIMULATION" | "RECOMMENDATION" | "DATA_LIMITATION";
  groundingData?: any;
  suggestedFollowUpActions?: any[];
  policyOptions?: string[];
}

export default function GovernmentCopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "copilot",
      text: "Welcome to the **CareerIS Policy Decision Copilot**. I provide evidence-grounded intelligence across 28 States and 8 UTs for skill shortages, training capacity, What-If simulations, and public scheme ROI.\n\n*All insights are strictly grounded in canonical ontology and live labour-market feeds.*",
      groundingLabel: "FACT",
      groundingData: {
        sourcesUsed: ["CareerIS Unified Labour-Market Engine", "National Skill Registry"],
      },
      suggestedFollowUpActions: [
        { title: "What are the largest skill shortages nationally?", actionUrl: "" },
        { title: "Which districts need immediate intervention?", actionUrl: "" },
        { title: "What happens if we add 30% BMS seats in Pune?", actionUrl: "" },
        { title: "Which schemes have the highest placement ROI?", actionUrl: "" },
      ],
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg: Message = { sender: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/government/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (data.success) {
        const botMsg: Message = {
          sender: "copilot",
          text: data.data.answer,
          groundingLabel: data.data.groundingLabel,
          groundingData: data.data.groundingData,
          suggestedFollowUpActions: data.data.suggestedFollowUpActions,
          policyOptions: data.data.policyOptions,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/government">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Command Center
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-heading">Grounded AI Policy Decision Copilot</h1>
            <Badge variant="success" className="text-xs gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Deterministically Grounded
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Strict factual, analytical, and simulation categorization for government policy decisions
          </p>
        </div>
      </div>

      {/* Chat Messages Container */}
      <Card className="shadow-subtle min-h-[500px] flex flex-col justify-between">
        <CardContent className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[600px]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"} space-y-1.5`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground">
                  {m.sender === "user" ? "Policy Officer" : "CareerIS Copilot"}
                </span>
                {m.groundingLabel && (
                  <Badge
                    variant={
                      m.groundingLabel === "SIMULATION"
                        ? "warning"
                        : m.groundingLabel === "FACT"
                        ? "success"
                        : "outline"
                    }
                    className="text-[9px] font-mono"
                  >
                    LABEL: {m.groundingLabel}
                  </Badge>
                )}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs max-w-2xl leading-relaxed ${
                  m.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted/40 border text-foreground rounded-tl-none space-y-3"
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {/* Grounding Data & Sources */}
                {m.groundingData?.sourcesUsed && (
                  <div className="p-2 rounded bg-background/60 border text-[10px] text-muted-foreground space-y-0.5 mt-2">
                    <span className="font-semibold text-foreground block">Verified Sources:</span>
                    <span>{m.groundingData.sourcesUsed.join(" • ")}</span>
                  </div>
                )}

                {/* Policy Options */}
                {m.policyOptions && (
                  <div className="space-y-1 pt-1 border-t">
                    <span className="text-[10px] font-bold text-primary block">Policy Actions for Human Review:</span>
                    {m.policyOptions.map((opt: string, optIdx: number) => (
                      <div key={optIdx} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary font-bold">&bull;</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Follow-up Actions */}
                {m.suggestedFollowUpActions && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {m.suggestedFollowUpActions.map((act: any, actIdx: number) => (
                      <Button
                        key={actIdx}
                        size="sm"
                        variant="outline"
                        className="text-[10px] h-6 px-2 bg-background/80"
                        onClick={() => {
                          if (act.actionUrl) {
                            window.location.href = act.actionUrl;
                          } else {
                            handleSend(act.title);
                          }
                        }}
                      >
                        {act.title}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Analyzing labour market evidence &amp; ontology...</span>
            </div>
          )}
        </CardContent>

        {/* Input Bar */}
        <div className="p-3 border-t bg-card flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask a policy question (e.g. 'What are the largest skill shortages nationally?')..."
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button size="sm" onClick={() => handleSend()} disabled={loading || !inputQuery.trim()} className="text-xs h-9 px-4 gap-1.5">
            <Send className="w-3.5 h-3.5" />
            Ask
          </Button>
        </div>
      </Card>
    </div>
  );
}
