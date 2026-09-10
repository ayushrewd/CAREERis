"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, ShieldCheck, HelpCircle, ArrowRight, Bot, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content?: string;
  response?: any;
}

const SAMPLE_QUESTIONS = [
  "What skills are growing fastest across India?",
  "Which districts have the largest future skill gaps?",
  "Which courses should be modernized?",
  "What happens if training capacity increases by 25%?",
];

export default function GlobalCopilotPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to the **CareerIS National Predictive Intelligence Copilot**. How can I assist you with labour-market foresight, skill forecasting, or scenario modeling today?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (qText?: string) => {
    const textToSend = qText || query;
    if (!textToSend.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: textToSend }];
    setMessages(newMessages);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/intelligence/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToSend }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...newMessages, { role: "assistant", response: data.data }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "Apologies, I encountered an error processing your query." }]);
      }
    } catch (e: any) {
      setMessages([...newMessages, { role: "assistant", content: "Network error processing copilot query." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-heading">CareerIS Intelligence Copilot</h1>
            <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
              <Sparkles className="w-3 h-3 mr-1" /> Grounded &bull; Role-Aware
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Empirical labour intelligence, predictive forecasting &amp; explainable decision support
          </p>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="flex flex-wrap gap-1.5">
        {SAMPLE_QUESTIONS.map((q, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            className="text-[11px] h-7 px-2.5 bg-card/60 hover:bg-primary/5 hover:border-primary/40 text-muted-foreground hover:text-foreground"
            onClick={() => handleSend(q)}
          >
            {q}
          </Button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 text-xs ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border shadow-subtle text-foreground"}`}>
              {m.content && <p className="leading-relaxed whitespace-pre-line">{m.content}</p>}

              {m.response && (
                <div className="space-y-3">
                  {/* Classification & Confidence */}
                  <div className="flex items-center justify-between border-b pb-2">
                    <Badge variant="outline" className="text-[9px] font-mono">
                      {m.response.classification}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Confidence: {(m.response.confidenceScore * 100).toFixed(0)}%
                    </span>
                  </div>

                  {/* Main Answer */}
                  <div className="text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: m.response.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />

                  {/* Why */}
                  {m.response.why?.length > 0 && (
                    <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground block">Why This Is Happening:</span>
                      {m.response.why.map((w: string, i: number) => (
                        <p key={i} className="text-[11px] text-muted-foreground">&bull; {w}</p>
                      ))}
                    </div>
                  )}

                  {/* Evidence Table */}
                  {m.response.evidence?.length > 0 && (
                    <div className="p-2.5 rounded-lg border bg-muted/20 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground block">Empirical Evidence Sources:</span>
                      {m.response.evidence.map((ev: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-[10px] text-muted-foreground py-0.5 border-b border-border/50 last:border-0">
                          <span>{ev.dataset} ({ev.geography})</span>
                          <span className="font-mono text-foreground font-semibold">{ev.metric}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* What It Means & Recommended Action */}
                  <div className="p-2.5 rounded-lg border bg-primary/5 border-primary/20 space-y-1">
                    <span className="text-[10px] font-bold text-primary block">Recommended Strategic Action:</span>
                    <p className="text-[11px] text-foreground">{m.response.recommendedAction}</p>
                  </div>

                  {/* Limitations */}
                  {m.response.limitations?.length > 0 && (
                    <span className="text-[9px] text-muted-foreground italic block">
                      Limitations: {m.response.limitations.join("; ")}
                    </span>
                  )}
                </div>
              )}
            </div>

            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex gap-2 sticky bottom-4 bg-background/80 backdrop-blur p-2 rounded-2xl border shadow-lg">
        <Input
          placeholder="Ask anything (e.g. Which skills are growing fastest? What happens if training capacity increases by 25%?)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="text-xs h-10 border-0 focus-visible:ring-0 shadow-none"
        />
        <Button size="sm" onClick={() => handleSend()} disabled={loading || !query.trim()} className="h-10 px-4">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
