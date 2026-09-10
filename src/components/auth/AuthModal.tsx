"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  User,
  CheckCircle2,
  X,
  Sparkles,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { CareerISLogo } from "@/components/ui/CareerISLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [headline, setHeadline] = useState(
    user?.headline || ""
  );
  const [college, setCollege] = useState(
    user?.college || ""
  );
  const [district, setDistrict] = useState(user?.district || "");
  const [state, setState] = useState(user?.state || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      headline,
      college,
      district,
      state,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-200 relative text-xs">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <CareerISLogo size="sm" showTagline={true} />
          <h2 className="text-xl font-bold font-heading text-foreground mt-2">
            Edit Your Profile
          </h2>
          <p className="text-xs text-muted-foreground">
            Update your student details &amp; verified credentials
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Full Name</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Headline / Goal</label>
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">College / University</label>
            <Input
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">District / City</label>
              <Input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-foreground">State</label>
              <Input
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full font-bold shadow-md gap-1.5 mt-2">
            <Sparkles className="w-4 h-4" />
            <span>Save Profile</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
