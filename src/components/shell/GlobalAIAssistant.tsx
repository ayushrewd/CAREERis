"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Sparkles,
  X,
  Send,
  Minimize2,
  Maximize2,
  Compass,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  BookOpen,
  Layers,
  Building2,
  GraduationCap,
  Briefcase,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  links?: { label: string; url: string; icon?: string }[];
  category?: string;
  suggestedPrompts?: string[];
  timestamp: string;
}

const QUICK_PROMPTS = [
  "Tell me about CareerIS & SIH26134",
  "How does Explainable Job Matching work?",
  "How does the Skill Passport & Evidence work?",
  "How does ITI curriculum & lab equipment tracking work?",
  "Explain the District Planning & DSDO engine",
  "Guide me around the website",
];

export function GlobalAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const pathname = usePathname();
  const { currentRole } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-01",
      role: "assistant",
      content: `### CareerIS Copilot
The Copilot answers only from records your account is authorized to access. If no LLM provider is configured, it will report that it is unavailable rather than returning a simulated answer.`,
      category: "Introduction",
      links: [
        { label: "Community Feed", url: "/feed" },
        { label: "Jobs & Matching", url: "/jobs" },
        { label: "Skill Passport", url: "/candidate/skill-passport" },
        { label: "ITI Curriculum Hub", url: "/training-provider" },
        { label: "District Admin Hub", url: "/district-admin" },
      ],
      suggestedPrompts: [
        "Tell me about CareerIS & SIH26134",
        "How does Explainable Job Matching work?",
        "How does ITI curriculum & lab equipment tracking work?",
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          currentPath: pathname,
          userRole: currentRole,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const botMsg: ChatMessage = {
          id: "bot-" + Date.now(),
          role: "assistant",
          content: data.data.answer,
          links: data.data.links,
          category: data.data.category,
          suggestedPrompts: data.data.suggestedPrompts,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);

        if (ttsEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
          const plainText = data.data.answer.replace(/[#*`_\[\]()]/g, "");
          const utterance = new SpeechSynthesisUtterance(plainText.slice(0, 200));
          window.speechSynthesis.speak(utterance);
        }
      } else {
        throw new Error(data.error || "Failed to generate answer");
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "assistant",
          content: err instanceof Error ? err.message : "AI Copilot unavailable — no LLM provider configured.",
          suggestedPrompts: ["Tell me about CareerIS & SIH26134", "Guide me around the website"],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: `Chat session refreshed. What would you like to explore about **CareerIS**?`,
        suggestedPrompts: QUICK_PROMPTS.slice(0, 4),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const renderFormattedContent = (content: string) => {
    // Basic Markdown formatting helper for lines
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h3 key={idx} className="font-heading font-bold text-sm text-foreground mt-2 mb-1">
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={idx} className="font-semibold text-foreground my-1">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (line.startsWith("* ") || line.startsWith("- ")) {
        const itemText = line.replace(/^[\*\-]\s+/, "");
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-1 my-1">
            <span className="text-primary text-xs">•</span>
            <span className="text-xs text-foreground/90">{parseBoldAndCode(itemText)}</span>
          </div>
        );
      }
      if (/^\d+\.\s+/.test(line)) {
        const num = line.match(/^(\d+\.)\s+/)?.[1] || "•";
        const itemText = line.replace(/^\d+\.\s+/, "");
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-1 my-1">
            <span className="text-primary font-semibold text-xs">{num}</span>
            <span className="text-xs text-foreground/90">{parseBoldAndCode(itemText)}</span>
          </div>
        );
      }
      if (line.startsWith("```")) {
        return null;
      }
      if (line.includes("➔") || line.includes("->")) {
        return (
          <div key={idx} className="p-2 rounded-lg bg-muted/60 font-mono text-[10px] text-foreground my-1.5 border leading-relaxed">
            {line}
          </div>
        );
      }
      if (line.startsWith("|") && line.endsWith("|")) {
        // Simple table line display
        return (
          <div key={idx} className="font-mono text-[10px] text-muted-foreground my-0.5 whitespace-pre">
            {line}
          </div>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs text-foreground/90 my-1 leading-relaxed">
          {parseBoldAndCode(line)}
        </p>
      );
    });
  };

  const parseBoldAndCode = (text: string) => {
    // Helper to render bold **text**, `code` and [link](/path)
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} className="px-1 py-0.5 rounded bg-muted font-mono text-[11px] text-primary border">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          return (
            <Link
              key={i}
              href={match[2]}
              onClick={() => setIsOpen(false)}
              className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5 mx-0.5"
            >
              {match[1]}
              <ChevronRight className="w-3 h-3 inline" />
            </Link>
          );
        }
      }
      return part;
    });
  };

  return (
    <>
      {/* 1. FLOATING ACTION BUTTON */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border bg-background/95 backdrop-blur-md shadow-lg text-xs font-semibold text-foreground animate-in fade-in slide-in-from-right-4 duration-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Need help with CareerIS?</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open CareerIS AI Assistant"
          className="relative w-13 h-13 p-3 rounded-full bg-gradient-to-tr from-primary via-indigo-600 to-cyan-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center group"
        >
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping pointer-events-none" />
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative">
              <Bot className="w-6 h-6 text-white" />
              <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-bounce" />
            </div>
          )}
        </button>
      </div>

      {/* 2. EXPANDABLE CHAT PANEL */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col shadow-2xl border rounded-2xl bg-card/98 backdrop-blur-xl overflow-hidden ${
            isExpanded
              ? "bottom-4 right-4 left-4 top-4 sm:left-auto sm:right-6 sm:bottom-6 sm:top-12 sm:w-[680px]"
              : "bottom-20 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[460px] h-[580px] max-h-[82vh]"
          }`}
        >
          {/* Header */}
          <div className="p-3.5 px-4 border-b bg-muted/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-cyan-500 text-white flex items-center justify-center shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-heading font-extrabold text-sm text-foreground">
                    CareerIS AI Guide
                  </h2>
                  <Badge variant="outline" className="text-[9px] font-mono py-0 px-1 border-primary/40 text-primary">
                    SIH26134 Engine
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Grounded in authorized CAREERIS records
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                title={ttsEnabled ? "Disable Voice" : "Enable Voice Readout"}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  ttsEnabled ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={handleReset}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted text-xs transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse" : "Expand"}
                className="hidden sm:block p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted text-xs transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted text-xs transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-xs shadow-md"
                      : "bg-muted/70 text-foreground border rounded-bl-xs shadow-xs"
                  }`}
                >
                  {msg.role === "assistant" && msg.category && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      <span>{msg.category}</span>
                    </div>
                  )}

                  <div className="leading-relaxed">
                    {msg.role === "user" ? msg.content : renderFormattedContent(msg.content)}
                  </div>

                  {/* Navigation Links */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-border/50">
                      <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">
                        Direct Page Shortcuts:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.links.map((link, lIdx) => (
                          <Link
                            key={lIdx}
                            href={link.url}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium bg-background border hover:border-primary/50 text-foreground hover:text-primary transition-all shadow-xs"
                          >
                            <span>{link.label}</span>
                            <ArrowRight className="w-3 h-3 text-primary" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Prompts */}
                  {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-border/50">
                      <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">
                        Suggested Follow-ups:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {msg.suggestedPrompts.map((p, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSend(p)}
                            className="text-left px-2 py-1 rounded text-[10px] bg-primary/5 hover:bg-primary/15 text-primary border border-primary/20 transition-colors"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-muted-foreground mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border text-xs text-muted-foreground w-fit animate-pulse">
                <Bot className="w-4 h-4 text-primary animate-spin" />
                <span>Retrieving authorized evidence and requesting the configured LLM…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2 border-t bg-muted/20 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
            {QUICK_PROMPTS.map((prompt, qIdx) => (
              <button
                key={qIdx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-medium bg-card border hover:border-primary/40 hover:text-primary transition-colors flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t bg-card flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your authorized CAREERIS records…"
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-muted/50 border focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || loading}
              className="px-3 rounded-xl h-9 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
