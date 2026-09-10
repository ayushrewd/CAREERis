"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "hi" : "en")}
      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border bg-background/80 hover:bg-accent transition-colors shadow-sm"
      title="Switch Language (English / Hindi)"
    >
      <Languages className="w-3.5 h-3.5 text-primary" />
      <span className="font-semibold text-foreground">
        {locale === "en" ? "EN" : "हिन्दी"}
      </span>
    </button>
  );
}
