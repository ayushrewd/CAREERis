"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, Send, ShieldCheck, CheckCircle2, Play } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  groundingLabel?: "FACT" | "ANALYSIS" | "RECOMMENDATION" | "FORECAST" | "SIMULATION" | "DATA_LIMITATION";
  groundingData?: any;
  suggestedFollowUpActions?: Array<{ title: string; actionUrl: string }>;
}

export default function TrainingCopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to the **CareerIS Training Intelligence Copilot**. I am connected live to **5 Centers of Excellence & ITIs**, **82 vocational courses**, **185 trainers**, and **₹62 Cr in technical training capacity** across India.\n\nHow can I support your institute operations or training planning today?",
      groundingLabel: "FACT",
      groundingData: { sourcesUsed: ["CareerIS Training Operating Engine"] },
      suggestedFollowUpActions: [
        { title: "Which courses should we expand?", actionUrl: "" },
        { title: "Which course is becoming obsolete?", actionUrl: "" },
        { title: "Which trainers need retraining?", actionUrl: "" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim() || loading) return;

    const userMsg: Message = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/training/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.data.answer,
            groundingLabel: data.data.groundingLabel,
            groundingData: data.data.groundingData,
            suggestedFollowUpActions: data.data.suggestedFollowUpActions,
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/training-provider">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> ITI Operating System
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-heading">Training Decision Intelligence Copilot</h1>
            <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
              <Sparkles className="w-3 h-3 mr-1" /> Grounded VET AI
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Strictly grounded in empirical NCVT/DGT data &bull; Explicit response classification
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="shadow-subtle min-h-[500px] flex flex-col justify-between">
        <CardContent className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[600px]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"} space-y-1.5`}
            >
              {m.role === "assistant" && m.groundingLabel && (
                <div className="flex items-center gap-1.5 pl-1">
                  <Badge
                    variant={
                      m.groundingLabel === "FACT"
                        ? "success"
                        : m.groundingLabel === "SIMULATION"
                        ? "warning"
                        : "default"
                    }
                    className="text-[9px] font-mono"
                  >
                    LABEL: {m.groundingLabel}
                  </Badge>
                  {m.groundingData?.sourcesUsed && (
                    <span className="text-[10px] text-muted-foreground">
                      Sources: {m.groundingData.sourcesUsed.join(", ")}
                    </span>
                  )}
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                    : "bg-muted/40 border text-foreground rounded-tl-none space-y-2 whitespace-pre-line"
                }`}
              >
                {m.content}

                {m.suggestedFollowUpActions && m.suggestedFollowUpActions.length > 0 && (
                  <div className="pt-3 mt-2 border-t border-border/50 flex flex-wrap gap-1.5">
                    {m.suggestedFollowUpActions.map((s, sIdx) => (
                      <Button
                        key={sIdx}
                        size="sm"
                        variant="outline"
                        className="text-[10px] h-6 px-2 bg-card hover:bg-muted"
                        onClick={() => {
                          if (s.actionUrl) {
                            window.location.href = s.actionUrl;
                          } else {
                            handleSend(s.title);
                          }
                        }}
                      >
                        {s.title} &rarr;
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-xs text-muted-foreground italic pl-2">Consulting institutional registry...</div>
          )}
        </CardContent>

        <div className="p-3 border-t bg-card rounded-b-xl flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about course health, trainer retraining, equipment failure simulation, or capacity planning..."
            className="flex-1 px-3 py-2 text-xs rounded-xl border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button size="sm" className="gap-1 px-4 text-xs" onClick={() => handleSend()} disabled={loading}>
            <Send className="w-3.5 h-3.5" /> Send
          </Button>
        </div>
      </Card>
    </div>
  );
}
