"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { User, UserRole } from "@/types";
import { hasPermission, PermissionAction } from "@/lib/rbac";

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  roleType?: "CANDIDATE" | "EMPLOYER" | "TRAINING_PROVIDER" | "DISTRICT_ADMIN";
  headline?: string;
  district?: string;
  companyName?: string;
  designation?: string;
  industry?: string;
  cinNumber?: string;
  headquarters?: string;
  organizationName?: string;
  registrationNo?: string;
  providerType?: string;
  departmentName?: string;
  officialId?: string;
  location?: string;
  education?: string;
  qualification?: string;
  experience?: string;
  currentSkills?: string[];
  targetRole?: string;
}

interface AuthContextType {
  user: User | null;
  currentRole: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (data: SignUpData) => Promise<User>;
  signIn: (email: string, password: string, roleType?: UserRole) => Promise<User>;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  can: (permission: PermissionAction) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function readJson(response: Response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Something went wrong.");
  return body;
}

function syncLocalProfile(user: User | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem("careeris_current_user_id");
    localStorage.removeItem("careeris_active_account");
    return;
  }
  const key = "careeris_db_users";
  const users = (() => {
    try { return JSON.parse(localStorage.getItem(key) || "[]") as Array<Record<string, unknown>>; }
    catch { return []; }
  })();
  const localUser = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.roleType === "EMPLOYER" ? "COMPANY" : "STUDENT",
    phoneNumber: user.phone,
    headline: user.headline,
    city: user.district,
    avatarUrl: user.avatarUrl,
  };
  const index = users.findIndex((item) => item.id === user.id);
  if (index >= 0) users[index] = { ...users[index], ...localUser };
  else users.push(localUser);
  localStorage.setItem(key, JSON.stringify(users));
  localStorage.setItem("careeris_current_user_id", user.id);
  localStorage.removeItem("careeris_active_account");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
      .then(readJson)
      .then((body) => { if (active) { syncLocalProfile(body.user); setUser(body.user); } })
      .catch(() => active && setUser(null))
      .finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, []);

  const signUp = useCallback(async (data: SignUpData) => {
    const body = await readJson(await fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }));
    syncLocalProfile(body.user);
    setUser(body.user);
    return body.user as User;
  }, []);

  const signIn = useCallback(async (email: string, password: string, roleType?: UserRole) => {
    const body = await readJson(await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, roleType }),
    }));
    syncLocalProfile(body.user);
    setUser(body.user);
    return body.user as User;
  }, []);

  const updateProfile = useCallback(async (updatedData: Partial<User>) => {
    const allowed = {
      fullName: updatedData.fullName,
      phone: updatedData.phone,
      avatarUrl: updatedData.avatarUrl,
      headline: updatedData.headline,
      district: updatedData.district,
    };
    const body = await readJson(await fetch("/api/auth/me", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(allowed),
    }));
    syncLocalProfile(body.user);
    setUser(body.user);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => undefined);
    syncLocalProfile(null);
    setUser(null);
  }, []);

  const currentRole = user?.roleType || "CANDIDATE";
  const value = useMemo<AuthContextType>(() => ({
    user,
    currentRole,
    isAuthenticated: !!user,
    isLoading,
    signUp,
    signIn,
    updateProfile,
    logout,
    can: (permission) => !!user && hasPermission(user.roleType, permission),
  }), [user, currentRole, isLoading, signUp, signIn, updateProfile, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export function usePermission(permission: PermissionAction): boolean {
  return useAuth().can(permission);
}
