"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CareerISLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showTagline?: boolean;
  variant?: "light" | "dark" | "auto";
}

export function CareerISLogo({
  className,
  size = "md",
  showText = true,
  showTagline = false,
}: CareerISLogoProps) {
  const iconDimensions = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textDimensions = {
    sm: "text-lg tracking-tight",
    md: "text-2xl tracking-tight",
    lg: "text-3xl tracking-tight",
    xl: "text-4xl tracking-tight",
  };

  return (
    <div className={cn("inline-flex items-center gap-3 select-none", className)}>
      {/* 1. THE EMBEDDED VECTOR ICON MARK (Bold, Filled, High-Visibility) */}
      <div className={cn("relative flex-shrink-0 drop-shadow-sm", iconDimensions[size])}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cArcGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            <linearGradient id="iPillarGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Outer 'C' Dynamic Shape */}
          <path
            d="M 120 18 
               C 56 18 14 62 14 124 
               C 14 182 60 226 120 226 
               C 156 226 186 212 208 188 
               L 174 154 
               C 158 172 140 182 120 182 
               C 80 182 50 152 50 124 
               C 50 82 80 52 120 52 
               C 144 52 166 66 178 86 
               L 210 60 
               C 188 32 156 18 120 18 Z"
            fill="url(#cArcGradFull)"
            transform="scale(0.85) translate(14, 12)"
          />

          {/* The 'i' Dot */}
          <circle cx="150" cy="68" r="16" fill="#0284c7" />

          {/* The 'i' Ascending Pillar / Arrow Stem */}
          <path
            d="M 132 102 
               L 168 78 
               L 168 178 
               L 132 178 Z"
            fill="url(#iPillarGradFull)"
          />
        </svg>
      </div>

      {/* 2. THE BOLD PROMINENT TYPOGRAPHY */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "font-heading font-black text-foreground tracking-tight drop-shadow-xs",
                textDimensions[size]
              )}
            >
              Career
            </span>
            <span
              className={cn(
                "font-heading font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent tracking-tight",
                textDimensions[size]
              )}
            >
              IS
            </span>
          </div>

          {showTagline && (
            <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-bold font-mono mt-1">
              NATIONAL SKILL INTELLIGENCE
            </span>
          )}
        </div>
      )}
    </div>
  );
}
