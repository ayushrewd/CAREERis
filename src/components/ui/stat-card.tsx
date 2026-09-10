import * as React from "react";
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Info } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral" | string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  confidenceScore?: number;
  dataSourceName?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  change,
  changeType,
  isPositive = true,
  icon,
  confidenceScore,
  dataSourceName,
  className,
}: StatCardProps) {
  const computedIsPositive = changeType !== undefined ? changeType === "positive" : isPositive;
  return (
    <Card className={cn("overflow-hidden relative group hover:border-primary/40 transition-all", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          {icon && (
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <div className="text-2xl font-bold font-heading tracking-tight text-foreground">
            {value}
          </div>
          {change && (
            <div
              className={cn(
                "inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded",
                computedIsPositive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              )}
            >
              {computedIsPositive ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {change}
            </div>
          )}
        </div>

        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}

        {(confidenceScore !== undefined || dataSourceName) && (
          <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="truncate max-w-[170px] flex items-center gap-1">
              <Info className="w-3 h-3 flex-shrink-0 text-muted-foreground/70" />
              {dataSourceName || "Verified Source"}
            </span>
            {confidenceScore !== undefined && (
              <span className="font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded text-[10px]">
                {confidenceScore}% Conf.
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
