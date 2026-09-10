"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Search,
  Sparkles,
  Leaf,
  TrendingUp,
  Network,
  BarChart3,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Tag,
  Layers,
} from "lucide-react";
import { CanonicalSkill, NormalizationResult } from "@/types/skills";

export default function SkillsPage() {
  const [skills, setSkills] = useState<CanonicalSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [filterType, setFilterType] = useState<"ALL" | "EMERGING" | "GREEN">("ALL");

  // Normalizer tester widget state
  const [testInput, setTestInput] = useState("");
  const [normResult, setNormResult] = useState<NormalizationResult | null>(null);
  const [normalizing, setNormalizing] = useState(false);

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setSkills(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleTestNormalize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;
    setNormalizing(true);
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "normalize", rawText: testInput }),
      });
      const data = await res.json();
      setNormResult(data.data);
    } catch (err) {
      // error
    } finally {
      setNormalizing(false);
    }
  };

  const categories = [
    { id: "ALL", name: "All Categories" },
    { id: "cat-ev", name: "Electric Vehicles" },
    { id: "cat-auto", name: "Automation & Robotics" },
    { id: "cat-data", name: "Data & AI" },
    { id: "cat-prog", name: "Software Development" },
  ];

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.aliases?.some((a) => a.alias.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "ALL" || skill.categoryId === selectedCategory;

    if (filterType === "EMERGING") return matchesSearch && matchesCategory && skill.isEmerging;
    if (filterType === "GREEN") return matchesSearch && matchesCategory && skill.isGreenSkill;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unified National Skill Graph</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Canonical Skills &amp; Competency Graph
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Every candidate, job requisition, ITI curriculum, and assessment connects through canonical skill identities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/skills/graph">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold shadow-xs">
              <Network className="w-3.5 h-3.5 text-primary" />
              <span>Interactive Skill Graph</span>
            </Button>
          </Link>
          <Badge variant="purple" className="text-xs">
            1,420 Standardized Units
          </Badge>
        </div>
      </div>

      {/* Live Skill Normalization Tester Tool */}
      <div className="p-4 rounded-xl border bg-gradient-to-r from-primary/5 via-indigo-50/50 to-background dark:from-primary/10 dark:via-background dark:to-background">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-bold font-heading text-foreground uppercase tracking-wider">
                Deterministic Skill Normalization Engine
              </h2>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Try entering any raw employer or resume variant (e.g. &quot;Python programming&quot;, &quot;PowerBI&quot;, &quot;PLC&quot;, &quot;ROS2&quot;).
            </p>
          </div>
          <div className="flex gap-1.5">
            {["Python 3", "PowerBI", "PLC Programming", "ROS2"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTestInput(preset)}
                className="text-[10px] px-2 py-0.5 rounded bg-background border hover:border-primary text-muted-foreground hover:text-foreground font-mono transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleTestNormalize} className="flex gap-2">
          <Input
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="Type a raw skill name..."
            className="text-xs bg-background"
          />
          <Button type="submit" size="sm" disabled={normalizing} className="text-xs px-4">
            {normalizing ? "Resolving..." : "Normalize"}
          </Button>
        </form>

        {normResult && (
          <div className="mt-3 p-3 rounded-lg bg-background border text-xs flex flex-wrap items-center justify-between gap-2 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Input:</span>
              <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground font-semibold">
                &quot;{normResult.rawInput}&quot;
              </code>
              <span className="text-primary font-bold">→</span>
              <span className="text-muted-foreground">Canonical:</span>
              {normResult.canonicalSkill ? (
                <Link
                  href={`/skills/${normResult.canonicalSkill.id}`}
                  className="font-bold text-primary hover:underline inline-flex items-center gap-1"
                >
                  {normResult.canonicalSkill.name}
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              ) : (
                <span className="text-amber-600 font-semibold">Unresolved (Quarantined for Review)</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {normResult.matchedBy && (
                <Badge variant="outline" className="text-[10px] font-mono">
                  Matched By: {normResult.matchedBy}
                </Badge>
              )}
              <Badge
                variant={normResult.confidence > 0.8 ? "success" : "warning"}
                className="text-[10px] font-mono font-bold"
              >
                Confidence: {Math.round(normResult.confidence * 100)}%
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border bg-card shadow-subtle">
        <div className="w-full md:max-w-md">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by canonical name, alias, code..."
            icon={<Search className="w-4 h-4" />}
            className="text-xs bg-background"
          />
        </div>

        {/* Category & Badge Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex rounded-lg border bg-muted/30 p-0.5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                  selectedCategory === c.id
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5">
            <Button
              variant={filterType === "EMERGING" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(filterType === "EMERGING" ? "ALL" : "EMERGING")}
              className="text-xs h-8 gap-1"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
              <span>Emerging</span>
            </Button>
            <Button
              variant={filterType === "GREEN" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(filterType === "GREEN" ? "ALL" : "GREEN")}
              className="text-xs h-8 gap-1"
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-500" />
              <span>Green Skills</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground">Loading Canonical Skill Graph...</div>
      ) : filteredSkills.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8 text-muted-foreground" />}
          title="No standardized skills match criteria"
          description="Try broadening your search term or selecting a different category."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <Card
              key={skill.id}
              className="hover:border-primary/50 transition-all hover:shadow-md group flex flex-col justify-between"
            >
              <CardContent className="p-4 space-y-3">
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-semibold">
                      {skill.code}
                    </span>
                    <h3 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {skill.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      {skill.categoryName}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {skill.isEmerging && (
                      <Badge variant="warning" className="text-[10px] gap-1 py-0.5">
                        <TrendingUp className="w-2.5 h-2.5" />
                        Emerging
                      </Badge>
                    )}
                    {skill.isGreenSkill && (
                      <Badge variant="success" className="text-[10px] gap-1 py-0.5">
                        <Leaf className="w-2.5 h-2.5" />
                        Green Skill
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {skill.description}
                </p>

                {/* Canonical Aliases */}
                {skill.aliases && skill.aliases.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] text-muted-foreground font-medium block mb-1">
                      Known Aliases:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {skill.aliases.slice(0, 3).map((a) => (
                        <span
                          key={a.id || a.alias}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border"
                        >
                          {a.alias}
                        </span>
                      ))}
                      {skill.aliases.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{skill.aliases.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Card Actions */}
                <div className="pt-3 border-t flex items-center justify-between gap-2">
                  <Link href={`/skills/${skill.id}/market`} className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 font-medium">
                    <BarChart3 className="w-3 h-3 text-primary" />
                    Market Signals
                  </Link>

                  <Link href={`/skills/${skill.id}`}>
                    <Button size="sm" variant="ghost" className="text-xs font-semibold group-hover:bg-primary group-hover:text-white transition-all gap-1 h-7">
                      <span>View Dossier</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
