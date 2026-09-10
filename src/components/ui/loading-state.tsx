import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function LoadingState({
  message = "Loading data...",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[220px] flex-col items-center justify-center p-8 text-center",
        className
      )}
    >
      <Loader2 className="h-7 w-7 animate-spin text-primary mb-3" />
      <p className="text-xs font-medium text-muted-foreground">{message}</p>
    </div>
  );
}

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/60", className)}
      {...props}
    />
  );
}

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "info" | "warning" | "danger" | "success";
  title?: string;
  icon?: React.ReactNode;
}

export function Alert({
  variant = "default",
  title,
  icon,
  className,
  children,
  ...props
}: AlertProps) {
  const variantStyles = {
    default: "bg-muted text-foreground border-border",
    info: "bg-cyan-500/10 text-cyan-900 dark:text-cyan-200 border-cyan-500/20",
    warning: "bg-amber-500/10 text-amber-900 dark:text-amber-200 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-900 dark:text-rose-200 border-rose-500/20",
    success: "bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 border-emerald-500/20",
  };

  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 text-xs [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {icon}
      <div>
        {title && <h5 className="font-semibold leading-none tracking-tight mb-1 text-sm">{title}</h5>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
}
