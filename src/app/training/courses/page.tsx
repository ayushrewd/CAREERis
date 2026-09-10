"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, ArrowRight, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function TrainingCoursesRadarPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/training/courses")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCourses(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center gap-3">
        <Link href="/training-provider">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> ITI Operating System
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-heading">Course Health &amp; Obsolescence Radar</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            7-dimension course health diagnostics, oversupply checks, and portfolio optimization recommendations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.slice(0, 9).map((c) => (
          <Card key={c.id} className="shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs font-mono">{c.code}</Badge>
                <Badge
                  variant={c.healthScore >= 85 ? "success" : c.healthScore >= 70 ? "default" : "warning"}
                  className="text-[10px]"
                >
                  Health: {c.healthScore || 85}/100
                </Badge>
              </div>
              <CardTitle className="text-base font-bold pt-1">{c.title}</CardTitle>
              <CardDescription className="text-xs">{c.trainingProviderName}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <p className="text-[11px] text-muted-foreground line-clamp-2">{c.description}</p>

              <div className="flex items-center justify-between pt-2 border-t text-[11px]">
                <span className="text-muted-foreground">Capacity: {c.capacity || 40} Seats</span>
                <Link href={`/training/courses/${c.id}`}>
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 gap-1">
                    Health Dossier <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
