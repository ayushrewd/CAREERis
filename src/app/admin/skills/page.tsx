"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  Search,
  Plus,
  GitMerge,
  Tag,
  Network,
  Check,
  X,
  AlertTriangle,
  ArrowRight,
  Layers,
  Sparkles,
} from "lucide-react";
import { CanonicalSkill, UnresolvedSkillRecord } from "@/types/skills";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<CanonicalSkill[]>([]);
  const [unresolved, setUnresolved] = useState<UnresolvedSkillRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"REGISTRY" | "UNRESOLVED" | "MERGE">("REGISTRY");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // New Skill Form
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("cat-prog");
  const [newSkillType, setNewSkillType] = useState("TECHNICAL");
  const [newSkillDesc, setNewSkillDesc] = useState("");

  // Merge tool state
  const [primaryId, setPrimaryId] = useState("skill-py");
  const [secondaryId, setSecondaryId] = useState("skill-sql");
  const [mergePreview, setMergePreview] = useState<any>(null);
  const [merging, setMerging] = useState(false);
  const [mergeSuccess, setMergeSuccess] = useState(false);

  // Unresolved resolution modal
  const [selectedUnres, setSelectedUnres] = useState<UnresolvedSkillRecord | null>(null);
  const [resolveTargetId, setResolveTargetId] = useState("skill-bms");

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/skills").then((r) => r.json()),
      fetch("/api/admin/skills/unresolved").then((r) => r.json()),
    ])
      .then(([skillsRes, unresRes]) => {
        if (skillsRes.data) setSkills(skillsRes.data);
        if (unresRes.data) setUnresolved(unresRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      const res = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-role": "PLATFORM_ADMIN" },
        body: JSON.stringify({
          name: newSkillName,
          categoryId: newSkillCategory,
          skillType: newSkillType,
          description: newSkillDesc,
        }),
      });
      if (res.ok) {
        setNewSkillName("");
        setNewSkillDesc("");
        loadData();
      }
    } catch (err) {}
  };

  const handlePreviewMerge = async () => {
    try {
      const res = await fetch("/api/admin/skills/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-role": "PLATFORM_ADMIN" },
        body: JSON.stringify({ primarySkillId: primaryId, secondarySkillId: secondaryId, action: "preview" }),
      });
      const data = await res.json();
      setMergePreview(data.data);
      setMergeSuccess(false);
    } catch (err) {}
  };

  const handleExecuteMerge = async () => {
    setMerging(true);
    try {
      const res = await fetch("/api/admin/skills/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-role": "PLATFORM_ADMIN" },
        body: JSON.stringify({ primarySkillId: primaryId, secondarySkillId: secondaryId }),
      });
      if (res.ok) {
        setMergeSuccess(true);
        setMergePreview(null);
        loadData();
      }
    } catch (err) {} finally {
      setMerging(false);
    }
  };

  const handleResolveUnresolved = async (unresId: string) => {
    try {
      const res = await fetch(`/api/admin/skills/unresolved/${unresId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-role": "PLATFORM_ADMIN" },
        body: JSON.stringify({ targetCanonicalSkillId: resolveTargetId }),
      });
      if (res.ok) {
        setSelectedUnres(null);
        loadData();
      }
    } catch (err) {}
  };

  const handleRejectUnresolved = async (unresId: string) => {
    try {
      const res = await fetch(`/api/admin/skills/unresolved/${unresId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-role": "PLATFORM_ADMIN" },
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {}
  };

  const filteredSkills = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Platform Administration</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Skill Taxonomy &amp; Graph Governance Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Administer canonical skill definitions, moderate unmapped raw strings, manage aliases, and merge duplicate competencies with impact review.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple" className="text-xs">
            {skills.length} Canonical Skills
          </Badge>
          <Badge variant="warning" className="text-xs">
            {unresolved.filter((u) => u.status === "UNRESOLVED" || u.status === "REVIEW_REQUIRED").length} In Quarantine
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl border bg-muted/30 p-1">
        <button
          onClick={() => setActiveTab("REGISTRY")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "REGISTRY" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Canonical Registry ({skills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("UNRESOLVED")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "UNRESOLVED" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Unresolved Queue ({unresolved.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("MERGE")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "MERGE" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
          }`}
        >
          <GitMerge className="w-3.5 h-3.5 text-indigo-500" />
          <span>Safe Skill Merge Tool</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "REGISTRY" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skills List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-3.5 rounded-xl border bg-card">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search canonical registry by name, code..."
                icon={<Search className="w-4 h-4" />}
                className="text-xs bg-background"
              />
            </div>

            <div className="space-y-2">
              {filteredSkills.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-xl border bg-card hover:border-primary/50 transition-all flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground">{s.code}</span>
                      <Badge variant="outline" className="text-[10px]">{s.skillType}</Badge>
                      {s.isEmerging && <Badge variant="warning" className="text-[9px]">Emerging</Badge>}
                    </div>
                    <h4 className="font-bold text-sm font-heading text-foreground">{s.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                    {s.aliases && s.aliases.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {s.aliases.map((a) => (
                          <span key={a.id} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted border">
                            {a.alias}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link href={`/skills/${s.id}`}>
                    <Button size="sm" variant="ghost" className="text-xs h-7">
                      Dossier
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Register New Canonical Skill */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Register New Canonical Competency
              </h3>
              <form onSubmit={handleCreateSkill} className="space-y-3 text-xs">
                <div>
                  <label className="text-muted-foreground font-semibold block mb-1">Canonical Name</label>
                  <Input
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g. Autonomous Vehicle Perception"
                    required
                    className="text-xs bg-background"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-semibold block mb-1">Taxonomy Category</label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    className="w-full p-2 rounded-lg border bg-background text-xs"
                  >
                    <option value="cat-ev">Electric Vehicles &amp; Clean Tech</option>
                    <option value="cat-auto">Industrial Automation &amp; Robotics</option>
                    <option value="cat-data">Data Science &amp; Business Intelligence</option>
                    <option value="cat-prog">Software Development &amp; Programming</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-semibold block mb-1">Skill Classification</label>
                  <select
                    value={newSkillType}
                    onChange={(e) => setNewSkillType(e.target.value)}
                    className="w-full p-2 rounded-lg border bg-background text-xs"
                  >
                    <option value="TECHNICAL">TECHNICAL</option>
                    <option value="EMERGING">EMERGING</option>
                    <option value="TOOLS">TOOLS</option>
                    <option value="DOMAIN">DOMAIN</option>
                    <option value="GREEN">GREEN</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-semibold block mb-1">Description</label>
                  <textarea
                    value={newSkillDesc}
                    onChange={(e) => setNewSkillDesc(e.target.value)}
                    placeholder="Detailed standard competency description..."
                    rows={3}
                    className="w-full p-2 rounded-lg border bg-background text-xs"
                  />
                </div>

                <Button type="submit" className="w-full text-xs font-bold gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Canonical Skill</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "UNRESOLVED" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border bg-amber-50/40 dark:bg-amber-950/20 text-xs">
            <h4 className="font-bold text-amber-900 dark:text-amber-300">Quarantine Resolution Queue</h4>
            <p className="text-amber-800 dark:text-amber-400 mt-0.5">
              These raw skill terms were entered by employers or candidates but did not match an existing alias. Review and map them to a canonical skill to enrich the alias dictionary.
            </p>
          </div>

          <div className="space-y-3">
            {unresolved.map((u) => (
              <Card key={u.id}>
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                        &quot;{u.rawText}&quot;
                      </code>
                      <Badge variant={u.status === "RESOLVED" ? "success" : u.status === "REJECTED" ? "destructive" : "warning"} className="text-[10px]">
                        {u.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-mono">Source: {u.sourceEntity}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{u.context}</p>
                  </div>

                  {u.status !== "RESOLVED" && u.status !== "REJECTED" && (
                    <div className="flex items-center gap-2">
                      <select
                        value={resolveTargetId}
                        onChange={(e) => setResolveTargetId(e.target.value)}
                        className="p-1.5 rounded-lg border bg-background text-xs font-medium"
                      >
                        {skills.map((s) => (
                          <option key={s.id} value={s.id}>
                            Map to: {s.name}
                          </option>
                        ))}
                      </select>
                      <Button size="sm" onClick={() => handleResolveUnresolved(u.id)} className="h-8 text-xs font-bold gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Alias</span>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRejectUnresolved(u.id)} className="h-8 text-xs text-destructive hover:bg-destructive/10">
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "MERGE" && (
        <Card>
          <CardContent className="p-6 space-y-5 max-w-3xl">
            <div>
              <h3 className="font-heading font-extrabold text-base text-foreground flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-primary" />
                Safe Canonical Skill Merge Tool
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Merge duplicate skills while automatically migrating candidates, requisitions, ITI courses, and aliases without data loss.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                <label className="font-bold text-foreground block">Primary Canonical Skill (Target)</label>
                <select
                  value={primaryId}
                  onChange={(e) => setPrimaryId(e.target.value)}
                  className="w-full p-2 rounded-lg border bg-background text-xs"
                >
                  {skills.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-muted-foreground">This skill will retain canonical identity.</p>
              </div>

              <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                <label className="font-bold text-foreground block">Secondary Duplicate Skill (To Absorb)</label>
                <select
                  value={secondaryId}
                  onChange={(e) => setSecondaryId(e.target.value)}
                  className="w-full p-2 rounded-lg border bg-background text-xs"
                >
                  {skills.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-muted-foreground">This skill name will become an alias of the primary.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handlePreviewMerge} className="text-xs font-semibold">
                Preview Merge Impact
              </Button>
            </div>

            {mergePreview && (
              <div className="p-4 rounded-xl border bg-background space-y-3 animate-fade-in text-xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h4 className="font-bold text-foreground">Pre-Merge Impact Analysis</h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-center">
                  <div className="p-2 rounded bg-muted/40 border">
                    <span className="text-[10px] text-muted-foreground block">Candidates Affected</span>
                    <span className="font-bold text-sm">{mergePreview.affectedCandidatesCount}</span>
                  </div>
                  <div className="p-2 rounded bg-muted/40 border">
                    <span className="text-[10px] text-muted-foreground block">Jobs Affected</span>
                    <span className="font-bold text-sm">{mergePreview.affectedJobsCount}</span>
                  </div>
                  <div className="p-2 rounded bg-muted/40 border">
                    <span className="text-[10px] text-muted-foreground block">Courses Affected</span>
                    <span className="font-bold text-sm">{mergePreview.affectedCoursesCount}</span>
                  </div>
                  <div className="p-2 rounded bg-muted/40 border">
                    <span className="text-[10px] text-muted-foreground block">Aliases Merged</span>
                    <span className="font-bold text-sm">{mergePreview.mergedAliasesCount}</span>
                  </div>
                </div>

                <p className="text-muted-foreground">
                  Confirming this merge will re-point all active references to <strong>{mergePreview.primarySkill.name}</strong>.
                </p>

                <Button
                  size="sm"
                  onClick={handleExecuteMerge}
                  disabled={merging}
                  className="w-full text-xs font-bold gap-1.5 bg-primary text-white"
                >
                  <GitMerge className="w-3.5 h-3.5" />
                  <span>{merging ? "Executing Merge..." : "Confirm & Execute Merge"}</span>
                </Button>
              </div>
            )}

            {mergeSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Skills successfully merged. All aliases and references updated.</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
