"use client";

import React, { useState } from "react";
import { MapPin, ChevronDown, Check, Globe } from "lucide-react";
import { INDIA_STATES_UT, INDIA_DISTRICTS } from "@/lib/geography/indiaData";
import { cn } from "@/lib/utils";

export function GeographicSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGeo, setSelectedGeo] = useState<{
    type: "ALL_INDIA" | "STATE" | "DISTRICT";
    name: string;
    code?: string;
    isPilot?: boolean;
  }>({
    type: "STATE",
    name: "Maharashtra",
    code: "MH",
    isPilot: true,
  });

  const selectGeo = (geo: typeof selectedGeo) => {
    setSelectedGeo(geo);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border bg-background/80 hover:bg-accent transition-colors shadow-sm"
        title="Active Geographic Scope"
      >
        <MapPin className="w-3.5 h-3.5 text-primary" />
        <span className="truncate max-w-[120px] sm:max-w-[160px] text-foreground font-semibold">
          {selectedGeo.name}
        </span>
        {selectedGeo.isPilot && (
          <span className="hidden md:inline-block text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.2 rounded">
            SIH Pilot
          </span>
        )}
        <ChevronDown className="w-3 h-3 text-muted-foreground ml-0.5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 rounded-xl border bg-card p-2 shadow-xl z-50 animate-in fade-in-0 zoom-in-95 text-xs">
            <div className="px-2 py-1.5 border-b mb-1">
              <p className="font-semibold text-foreground">Select Geographic Vantage</p>
              <p className="text-[10px] text-muted-foreground">
                Pan-India scope with Maharashtra reference pilot
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-0.5">
              {/* All India */}
              <button
                onClick={() =>
                  selectGeo({ type: "ALL_INDIA", name: "All India (National)" })
                }
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors",
                  selectedGeo.type === "ALL_INDIA"
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" />
                  <span>All India (National)</span>
                </div>
                {selectedGeo.type === "ALL_INDIA" && (
                  <Check className="w-3.5 h-3.5" />
                )}
              </button>

              <div className="px-2 pt-2 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                States & Union Territories
              </div>

              {INDIA_STATES_UT.map((st) => (
                <button
                  key={st.id}
                  onClick={() =>
                    selectGeo({
                      type: "STATE",
                      name: st.name,
                      code: st.code,
                      isPilot: st.isPilotArea,
                    })
                  }
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors",
                    selectedGeo.name === st.name
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{st.name}</span>
                    {st.isPilotArea && (
                      <span className="text-[9px] bg-primary/15 text-primary font-bold px-1 rounded">
                        SIH Pilot
                      </span>
                    )}
                  </div>
                  {selectedGeo.name === st.name && (
                    <Check className="w-3.5 h-3.5" />
                  )}
                </button>
              ))}

              <div className="px-2 pt-2 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Key Industrial Districts
              </div>

              {INDIA_DISTRICTS.slice(0, 8).map((dist) => (
                <button
                  key={dist.id}
                  onClick={() =>
                    selectGeo({
                      type: "DISTRICT",
                      name: `${dist.name} District`,
                      code: dist.code,
                    })
                  }
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors",
                    selectedGeo.name === `${dist.name} District`
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <div className="flex flex-col">
                    <span>{dist.name}</span>
                    <span className="text-[10px] text-muted-foreground">{dist.stateName}</span>
                  </div>
                  {selectedGeo.name === `${dist.name} District` && (
                    <Check className="w-3.5 h-3.5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
