"use client";

import React, { useState, useEffect } from "react";
import { db, DBUser } from "@/lib/store/careerisDB";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  ShieldCheck,
  Search,
  RefreshCw,
  Building2,
  GraduationCap,
  Sparkles,
  MapPin,
  Mail,
  Award,
  Lock,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<DBUser[]>([]);
  const [search, setSearch] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadUsers = () => {
    setUsers(db.getUsers());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin2026" || passcode === "sih2026" || passcode.toLowerCase() === "ayush" || passcode === "admin") {
      setIsUnlocked(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Invalid Admin Passcode. Access denied.");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.college && u.college.toLowerCase().includes(search.toLowerCase())) ||
      (u.role && u.role.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-2xl border bg-gradient-to-r from-card via-card/95 to-rose-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-subtle">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Platform Creator &amp; Master Admin
            </Badge>
            <Badge variant="outline" className="text-xs font-mono">
              Total Registered IDs: {users.length}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground">
            Live User Accounts &amp; Registration Database
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            Real-time registry of all students, companies, and government officials registered across the CareerIS platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isUnlocked && (
            <Button onClick={loadUsers} size="sm" variant="outline" className="gap-1.5 text-xs">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Database</span>
            </Button>
          )}
        </div>
      </div>

      {/* ADMIN PASSCODE GATEWAY (If Locked) */}
      {!isUnlocked ? (
        <Card className="max-w-md mx-auto border shadow-xl p-6 text-center space-y-4 bg-card animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="font-heading font-bold text-lg text-foreground">
              Master Admin Passcode Required
            </h3>
            <p className="text-xs text-muted-foreground">
              Only the platform creator/admin has permission to inspect all registered user databases and proctored records.
            </p>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-3">
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-semibold text-muted-foreground">Admin Passcode</label>
              <Input
                type="password"
                placeholder="Enter master passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full font-bold text-xs gap-2 shadow-md">
              <KeyRound className="w-4 h-4" />
              <span>Unlock Master Registry</span>
            </Button>
          </form>
        </Card>
      ) : (
        /* UNLOCKED: LIVE REGISTRY VIEW */
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Search Input */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:max-w-md">
              <Input
                placeholder="Search registered users by name, email, role, or college..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="text-xs text-muted-foreground self-start sm:self-auto font-mono">
              Displaying {filtered.length} Live Records
            </span>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((u) => (
              <Card
                key={u.id}
                className="border hover:border-primary/50 transition-all shadow-subtle bg-card flex flex-col justify-between"
              >
                <CardContent className="p-5 space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-indigo-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                          {u.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-sm text-foreground">
                            {u.fullName}
                          </h3>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {u.email}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant={
                          u.role === "STUDENT"
                            ? "default"
                            : u.role === "COMPANY"
                            ? "info"
                            : "warning"
                        }
                        className="text-[10px] font-mono"
                      >
                        {u.role}
                      </Badge>
                    </div>

                    <div className="p-2.5 rounded-lg bg-muted/30 text-xs space-y-1 mt-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Dream Job / Org:</span>
                        <span className="font-semibold text-foreground truncate max-w-[140px]">
                          {u.dreamJob || u.college || "AI Developer"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="text-muted-foreground">
                          {u.city || "Greater Noida"}, {u.state || "UP"}
                        </span>
                      </div>
                      {u.assessmentScore && (
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t">
                          <span className="text-muted-foreground">Verified Score:</span>
                          <span className="font-bold text-emerald-600 font-mono">
                            {u.assessmentScore}/100
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Skills Tags */}
                  {u.skills && u.skills.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                        Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {u.skills.slice(0, 4).map((sk) => (
                          <span
                            key={sk}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-foreground font-mono"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
