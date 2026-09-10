import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50",
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
        {icon || <SearchX className="h-6 w-6" />}
      </div>
      <h3 className="text-base font-semibold font-heading text-foreground">
        {title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" variant="outline" className="mt-4 text-xs">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
