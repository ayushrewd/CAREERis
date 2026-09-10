"use client";

import React, { useState } from "react";
import { Download, Smartphone, Check } from "lucide-react";
import { DownloadAppModal } from "./DownloadAppModal";
import { usePwaInstall } from "./usePwaInstall";
import { Button } from "@/components/ui/button";

interface DownloadAppButtonProps {
  variant?: "topbar" | "hero" | "nav" | "compact";
  className?: string;
}

export function DownloadAppButton({
  variant = "topbar",
  className = "",
}: DownloadAppButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isInstalled, isInstallable, triggerInstall } = usePwaInstall();

  const handleClick = async () => {
    // If native prompt is ready and we are not in standalone mode, try triggering it directly
    if (isInstallable && !isInstalled) {
      const result = await triggerInstall();
      if (result === "accepted") return;
    }
    // Otherwise open the multi-platform modal
    setIsModalOpen(true);
  };

  if (variant === "hero") {
    return (
      <>
        <Button
          onClick={handleClick}
          size="lg"
          className={`group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-primary px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <Download className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
            <span>Download App (iOS / Android / PC)</span>
          </div>
        </Button>
        <DownloadAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  if (variant === "nav") {
    return (
      <>
        <button
          onClick={handleClick}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-muted ${
            isInstalled ? "text-emerald-500" : "text-foreground"
          } ${className}`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {isInstalled ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-xs">
              {isInstalled ? "CAREERIS App Installed" : "Download App to Device"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {isInstalled ? "Running in native mode" : "iOS, Android, Windows & Mac"}
            </p>
          </div>
        </button>
        <DownloadAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  if (variant === "compact") {
    return (
      <>
        <button
          onClick={handleClick}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors ${className}`}
          title="Download CAREERIS App"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Get App</span>
        </button>
        <DownloadAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  // Default: topbar
  return (
    <>
      <button
        onClick={handleClick}
        className={`hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/80 hover:bg-muted/80 px-2.5 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/40 shadow-xs ${className}`}
        title="Download CAREERIS App on your phone or computer"
      >
        <Download className="h-3.5 w-3.5 text-primary" />
        <span>{isInstalled ? "App Installed" : "Download App"}</span>
      </button>
      <DownloadAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
