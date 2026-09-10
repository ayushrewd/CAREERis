"use client";

import React, { useState } from "react";
import { Job, CandidateProfile } from "@/types";
import { platformStore } from "@/lib/store/platformStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle2, ShieldCheck, Briefcase, FileText, Send, Sparkles } from "lucide-react";

interface ApplicationModalProps {
  job: Job;
  candidate: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApplicationModal({
  job,
  candidate,
  isOpen,
  onClose,
  onSuccess,
}: ApplicationModalProps) {
  const [coverNote, setCoverNote] = useState(
    "I have reviewed the required competencies for this role and attach my assessment-verified skill credentials and practical lab project repository."
  );
  const [attachedEvidences, setAttachedEvidences] = useState<string[]>([
    "Verified_Skill_Passport.pdf",
    "CAN_Bus_Diagnostic_v2.py",
    "Govt_Polytechnic_Pune_Diploma.pdf",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      platformStore.applyForJob({
        jobId: job.id,
        coverNote,
        attachedEvidences,
      });
      setIsSubmitting(false);
      onSuccess();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card border rounded-2xl shadow-2xl p-6 z-10 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-0.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Skill-Verified Application</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-foreground">
              Apply to {job.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {job.companyName} &bull; {job.district}, {job.state}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Candidate Dossier Summary */}
          <div className="p-3.5 rounded-xl bg-muted/30 border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">
                Applicant: Rohit Sharma
              </span>
              <Badge variant="success" className="text-[10px] gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Skill Profile
              </Badge>
            </div>
            <p className="text-muted-foreground text-[11px] leading-tight">
              {candidate.headline}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-bold text-primary">
                Readiness Score: {candidate.readinessScore}%
              </span>
              <span className="text-muted-foreground">&bull;</span>
              <span className="text-[10px] text-muted-foreground">
                Location: {candidate.currentDistrict}, {candidate.currentState}
              </span>
            </div>
          </div>

          {/* Attached Verified Evidences */}
          <div className="space-y-2">
            <label className="font-semibold text-foreground block">
              Attached Verified Evidences &amp; Lab Records:
            </label>
            <div className="space-y-1.5">
              {attachedEvidences.map((ev, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border bg-background text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span className="font-medium text-foreground font-mono">{ev}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ Verified
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Message / Cover Note */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground block">
              Note to Hiring Team (Optional):
            </label>
            <Textarea
              rows={3}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              className="text-xs"
              placeholder="Highlight any specific equipment, test rig, or software competencies..."
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t flex items-center justify-between">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5 font-semibold">
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? "Submitting Application..." : "Submit Verified Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
