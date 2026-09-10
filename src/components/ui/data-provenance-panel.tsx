import * as React from "react";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { ShieldCheck, Database, Clock, FileCheck } from "lucide-react";

export interface DataProvenancePanelProps {
  sources: string[];
  timePeriod: string;
  confidenceScore: number;
  methodology: string;
}

export function DataProvenancePanel({
  sources,
  timePeriod,
  confidenceScore,
  methodology,
}: DataProvenancePanelProps) {
  return (
    <Card className="border-border/60 bg-muted/20 shadow-none">
      <CardContent className="p-4 space-y-2 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-foreground">Data Provenance &amp; Verification Grounding</span>
          </div>
          <Badge variant="success" className="text-[10px]">
            Confidence: {confidenceScore}% Grounded
          </Badge>
        </div>

        <p className="text-[11px] text-muted-foreground">{methodology}</p>

        <div className="flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground pt-1 border-t">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-primary" /> Sources: {sources.join(" • ")}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-500" /> Cycle: {timePeriod}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
