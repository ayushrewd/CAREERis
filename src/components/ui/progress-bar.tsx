import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: "primary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  variant = "primary",
  size = "md",
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantStyles = {
    primary: "bg-primary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    info: "bg-cyan-500",
  };

  const heightStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full space-y-1", className)}>
      {(label || showValue) && (
        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-secondary rounded-full overflow-hidden",
          heightStyles[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            variantStyles[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface ProgressRingProps {
  value: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 6,
  label,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("inline-flex flex-col items-center justify-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-muted/40"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="text-primary transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold font-heading">
          {Math.round(percentage)}%
        </div>
      </div>
      {label && <span className="mt-1 text-[11px] text-muted-foreground">{label}</span>}
    </div>
  );
}
