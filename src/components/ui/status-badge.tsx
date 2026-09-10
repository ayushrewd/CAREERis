import React from "react";
import { Badge } from "./badge";
import { CheckCircle2, AlertCircle, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import { EvidenceVerificationStatus } from "@/types";

interface StatusBadgeProps {
  status: EvidenceVerificationStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  switch (status) {
    case "ASSESSMENT_VERIFIED":
      return (
        <Badge variant="success" className={className}>
          <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" />
          Proctored Verified
        </Badge>
      );
    case "INSTITUTE_VERIFIED":
      return (
        <Badge variant="info" className={className}>
          <CheckCircle2 className="w-3 h-3 mr-1 text-cyan-600 dark:text-cyan-400" />
          Institute Verified
        </Badge>
      );
    case "EMPLOYER_VERIFIED":
      return (
        <Badge variant="purple" className={className}>
          <CheckCircle2 className="w-3 h-3 mr-1 text-indigo-600 dark:text-indigo-400" />
          Employer Verified
        </Badge>
      );
    case "SELF_ATTESTED":
      return (
        <Badge variant="warning" className={className}>
          <Clock className="w-3 h-3 mr-1 text-amber-600 dark:text-amber-400" />
          Self Attested
        </Badge>
      );
    case "UNVERIFIED":
    default:
      return (
        <Badge variant="outline" className={className}>
          <HelpCircle className="w-3 h-3 mr-1 text-muted-foreground" />
          Unverified
        </Badge>
      );
  }
}
