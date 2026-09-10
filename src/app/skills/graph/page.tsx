"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  ArrowRight,
  Briefcase,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Layers,
  ChevronRight,
  Info,
} from "lucide-react";
import { SkillGraphData, GraphNode } from "@/server/services/skill/skillGraphService";

export default function SkillGraphExplorerPage() {
  const [selectedSkillId, setSelectedSkillId] = useState("skill-bms");
  const [graphData, setGraphData] = useState<SkillGraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState<"VISUAL" | "ACCESSIBLE_TABLE">("VISUAL");

  const skillOptions = [
    { id: "skill-bms", name: "Battery Management Systems (BMS)" },
    { id: "skill-plc", name: "Programmable Logic Controllers (PLC)" },
    { id: "skill-py", name: "Python" },
    { id: "skill-sql", name: "SQL" },
    { id: "skill-ros", name: "Industrial Robotics (ROS 2)" },
    { id: "skill-pbi", name: "Power BI" },
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`/api/skills/${selectedSkillId}/graph`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setGraphData(data.data);
          const root = data.data.nodes.find((n: GraphNode) => n.id === selectedSkillId);
          setSelectedNode(root || data.data.nodes[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedSkillId]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold mb-1">
            <Network className="w-3.5 h-3.5" />
            <span>Interactive Competency Topology</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            National Skill Graph Explorer
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Visualize relationships, prerequisites, industry roles, and learning pathways connected through skills.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border bg-muted/40 p-0.5">
            <button
              onClick={() => setViewMode("VISUAL")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === "VISUAL" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
              }`}
            >
              Visual Graph
            </button>
            <button
              onClick={() => setViewMode("ACCESSIBLE_TABLE")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === "ACCESSIBLE_TABLE" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
              }`}
            >
              Accessible Table
            </button>
          </div>
        </div>
      </div>

      {/* Root Skill Selector & Graph Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border bg-card shadow-subtle">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground">Focus Competency:</span>
          {skillOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedSkillId(opt.id)}
              className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                selectedSkillId === opt.id
                  ? "bg-primary text-white border-primary font-bold shadow-xs"
                  : "bg-background text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>

        {viewMode === "VISUAL" && (
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
              className="h-8 w-8 p-0"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
              className="h-8 w-8 p-0"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoomLevel(1)}
              className="h-8 px-2 text-xs font-mono"
            >
              {Math.round(zoomLevel * 100)}%
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-muted-foreground">Computing Graph Traversal...</div>
      ) : graphData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Graph Canvas / Accessible View */}
          <div className="lg:col-span-2 space-y-4">
            {viewMode === "VISUAL" ? (
              <div className="relative min-h-[500px] rounded-2xl border bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-6 overflow-hidden flex items-center justify-center shadow-inner">
                {/* SVG Graph Grid Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />

                {/* Graph Rendering Container */}
                <div
                  className="relative z-10 w-full max-w-lg transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  {/* Central Root Node */}
                  <div className="flex flex-col items-center justify-center my-6">
                    <button
                      onClick={() => {
                        const root = graphData.nodes.find((n) => n.id === selectedSkillId);
                        if (root) setSelectedNode(root);
                      }}
                      className={`px-5 py-3 rounded-2xl border-2 shadow-2xl transition-all ${
                        selectedNode?.id === selectedSkillId
                          ? "bg-primary text-white border-white scale-110 ring-4 ring-primary/40"
                          : "bg-primary/90 text-white border-primary/40 hover:scale-105"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-heading font-extrabold text-sm tracking-tight">
                          {graphData.nodes.find((n) => n.id === selectedSkillId)?.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/80 block mt-0.5">
                        Focus Core Competency
                      </span>
                    </button>
                  </div>

                  {/* Connected Graph Relationships */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {graphData.nodes
                      .filter((n) => n.id !== selectedSkillId)
                      .map((node) => {
                        const isSelected = selectedNode?.id === node.id;
                        return (
                          <div key={node.id} className="flex flex-col items-center">
                            <div className="w-0.5 h-6 bg-indigo-500/40" />
                            <button
                              onClick={() => setSelectedNode(node)}
                              className={`w-full p-3 rounded-xl border text-left transition-all backdrop-blur-md ${
                                isSelected
                                  ? "bg-indigo-600/90 text-white border-white ring-2 ring-indigo-400/50 scale-105"
                                  : "bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700/80 hover:border-indigo-400/50"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">
                                  {node.category}
                                </span>
                                {node.isEmerging && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                                    Emerging
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-xs font-heading line-clamp-1">{node.name}</h4>
                              <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                                <span>{node.metrics.rolesCount} Roles</span>
                                <span>•</span>
                                <span>{node.metrics.jobsCount} Jobs</span>
                              </div>
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Graph Legend */}
                <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 text-[10px] text-slate-300 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span>Focus Node</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Adjacent / Prerequisite</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Emerging High-Demand</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Accessible Table Fallback */
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-bold text-sm font-heading">
                    Structured Relationship Hierarchy for {graphData.nodes.find((n) => n.id === selectedSkillId)?.name}
                  </h3>
                  <div className="rounded-lg border overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-semibold border-b">
                        <tr>
                          <th className="p-2.5">Competency</th>
                          <th className="p-2.5">Relationship Type</th>
                          <th className="p-2.5">Category</th>
                          <th className="p-2.5">Industry Roles</th>
                          <th className="p-2.5">Active Jobs</th>
                          <th className="p-2.5">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {graphData.nodes.map((n) => (
                          <tr key={n.id} className="hover:bg-muted/30">
                            <td className="p-2.5 font-bold text-foreground">{n.name}</td>
                            <td className="p-2.5">
                              <Badge variant="outline" className="text-[10px]">
                                {n.id === selectedSkillId ? "ROOT FOCUS" : "CONNECTED"}
                              </Badge>
                            </td>
                            <td className="p-2.5 text-muted-foreground">{n.category}</td>
                            <td className="p-2.5 font-mono">{n.metrics.rolesCount}</td>
                            <td className="p-2.5 font-mono">{n.metrics.jobsCount}</td>
                            <td className="p-2.5">
                              <Link href={`/skills/${n.id}`}>
                                <Button size="sm" variant="ghost" className="h-6 px-2 text-[11px]">
                                  View
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Node Inspector Panel */}
          <div className="space-y-4">
            {selectedNode ? (
              <Card className="border-primary/40 shadow-md">
                <CardContent className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-semibold">
                        Node Inspector
                      </span>
                      <Badge variant="default" className="text-[10px]">
                        {selectedNode.skillType}
                      </Badge>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-foreground">
                      {selectedNode.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedNode.category}</p>
                  </div>

                  {/* Connected Roles */}
                  <div className="space-y-2 pt-2 border-t">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-primary" />
                      Associated Industry Roles ({graphData.connectedRoles.length})
                    </span>
                    <div className="space-y-1.5">
                      {graphData.connectedRoles.map((r) => (
                        <div key={r.id} className="p-2 rounded-lg bg-muted/40 border text-xs flex items-center justify-between">
                          <span className="font-medium">{r.title}</span>
                          <Badge variant={r.isMandatory ? "destructive" : "secondary"} className="text-[9px]">
                            {r.isMandatory ? "Core Required" : "Preferred"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connected Courses */}
                  <div className="space-y-2 pt-2 border-t">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      Vocational ITI Courses ({graphData.connectedCourses.length})
                    </span>
                    <div className="space-y-1.5">
                      {graphData.connectedCourses.map((c, i) => (
                        <div key={i} className="p-2 rounded-lg bg-muted/40 border text-xs">
                          <span className="font-semibold block line-clamp-1">{c.title}</span>
                          <span className="text-[11px] text-muted-foreground">{c.providerName}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Node Actions */}
                  <div className="pt-3 border-t flex flex-col gap-2">
                    <Link href={`/skills/${selectedNode.id}`}>
                      <Button className="w-full text-xs font-bold gap-1.5">
                        <span>Open Canonical Skill Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <Link href={`/skills/${selectedNode.id}/market`}>
                      <Button variant="outline" className="w-full text-xs font-semibold gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-primary" />
                        <span>View Labour Market Demand</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-xs text-muted-foreground">
                  Select any node in the graph to inspect connected roles, jobs, and learning pathways.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
