"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, Compass, GraduationCap, Landmark, Lock, Mail, Plus, Search, UserRound, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getRoleDefaultRoute } from "@/lib/rbac";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ALL_SKILL_SUGGESTIONS, SKILL_CATEGORIES } from "@/data/skillTaxonomy";
import { INSTITUTION_SUGGESTIONS, LOCATION_SUGGESTIONS, QUALIFICATION_SUGGESTIONS } from "@/data/educationTaxonomy";

type PublicRole = "CANDIDATE" | "EMPLOYER" | "TRAINING_PROVIDER" | "DISTRICT_ADMIN";
type Screen = "choice" | "signin" | "signup";

const ROLE_DETAILS = {
  CANDIDATE: {
    label: "Candidate / Job Seeker",
    description: "Assess your skills, identify industry gaps, build verifiable evidence and discover relevant opportunities.",
    icon: UserRound,
  },
  EMPLOYER: {
    label: "Company",
    description: "Create your company profile, define skill requirements, discover job-ready candidates and post jobs.",
    icon: BriefcaseBusiness,
  },
  TRAINING_PROVIDER: {
    label: "Training Provider",
    description: "Register your institution and align courses, trainers, equipment and capacity with industry demand.",
    icon: GraduationCap,
  },
  DISTRICT_ADMIN: {
    label: "Government / District Planner",
    description: "Use your official identity to analyse labour-market signals and create evidence-based district training plans.",
    icon: Landmark,
  },
} satisfies Record<PublicRole, { label: string; description: string; icon: typeof UserRound }>;

function isPublicRole(value: string | null): value is PublicRole {
  return !!value && value in ROLE_DETAILS;
}

function AutocompleteInput({ value, onChange, placeholder, suggestions }: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions: readonly string[];
}) {
  const [focused, setFocused] = useState(false);
  const query = value.trim().toLowerCase();
  const compact = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const compactQuery = compact(query);
  const queryTokens = query.split(/\s+/).map(compact).filter(Boolean);
  const matches = query ? suggestions
    .filter((item) => {
      const searchable = compact(item)
        .replace("artificialintelligenceandmachinelearning", "artificialintelligenceandmachinelearningaiml")
        .replace("artificialintelligence", "artificialintelligenceai")
        .replace("datascience", "datascienceds");
      return item.toLowerCase().includes(query) || searchable.includes(compactQuery) || queryTokens.every((token) => searchable.includes(token));
    })
    .sort((a, b) => {
      const aCompact = compact(a);
      const bCompact = compact(b);
      const preferBTech = compactQuery === "b" || compactQuery.startsWith("bt") || compactQuery.startsWith("btech");
      const aRank = (preferBTech && aCompact.startsWith("btech") ? 0 : aCompact.startsWith(compactQuery) ? 1 : 2);
      const bRank = (preferBTech && bCompact.startsWith("btech") ? 0 : bCompact.startsWith(compactQuery) ? 1 : 2);
      return aRank - bRank || a.localeCompare(b);
    })
    .slice(0, 80) : [];
  return (
    <div className="relative">
      <Input required autoComplete="off" placeholder={placeholder} value={value} onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => setFocused(false), 120)} onChange={(event) => onChange(event.target.value)} />
      {focused && query && matches.length > 0 && (
        <div className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border bg-popover p-1 shadow-xl">
          {matches.map((item) => (
            <button key={item} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(item); setFocused(false); }} className="block w-full rounded-lg px-3 py-2 text-left text-xs text-popover-foreground hover:bg-muted">
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  const { user, isLoading, signIn, signUp } = useAuth();
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("choice");
  const [roleType, setRoleType] = useState<PublicRole>("CANDIDATE");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [education, setEducation] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [skillQuery, setSkillQuery] = useState("");
  const [showSkillBrowser, setShowSkillBrowser] = useState(false);
  const [skillFeedback, setSkillFeedback] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [designation, setDesignation] = useState("");
  const [industry, setIndustry] = useState("");
  const [cinNumber, setCinNumber] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [providerType, setProviderType] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [officialId, setOfficialId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.replace(getRoleDefaultRoute(user.roleType));
  }, [isLoading, router, user]);

  useEffect(() => {
    const requestedRole = new URLSearchParams(window.location.search).get("role");
    if (isPublicRole(requestedRole)) setRoleType(requestedRole);
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const account = screen === "signup"
        ? await signUp({
            fullName, email, password, phone, roleType, district, location: district,
            education, qualification, experience, currentSkills, targetRole,
            companyName, designation, industry, cinNumber, headquarters,
            organizationName, registrationNo, providerType,
            departmentName, officialId,
          })
        : await signIn(email, password, roleType);
      router.replace(getRoleDefaultRoute(account.roleType));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue.");
    } finally {
      setSubmitting(false);
    }
  }

  const role = ROLE_DETAILS[roleType];
  const RoleIcon = role.icon;

  function addSkill(rawSkill: string) {
    const skill = rawSkill.trim();
    if (!skill) {
      setShowSkillBrowser(true);
      setSkillFeedback("Choose a skill below or type one in the search box.");
      return;
    }
    if (currentSkills.some((item) => item.toLowerCase() === skill.toLowerCase())) {
      setSkillFeedback(`${skill} is already added.`);
      return;
    }
    setCurrentSkills((items) => [...items, skill]);
    setSkillQuery("");
    setSkillFeedback(`${skill} added as a declared skill.`);
  }

  if (screen === "choice") {
    return (
      <main className="min-h-screen px-4 py-12 grid place-items-center bg-gradient-to-b from-primary/5 to-background">
        <Card className="w-full max-w-lg shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><RoleIcon className="h-7 w-7" /></div>
            <div>
              <CardTitle className="font-heading text-2xl">Continue as {role.label}</CardTitle>
              <CardDescription className="mt-3 text-sm leading-6">{role.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button size="lg" className="w-full font-semibold" onClick={() => setScreen("signin")}>Sign In</Button>
            <Button size="lg" variant="outline" className="w-full font-semibold" onClick={() => setScreen("signup")}>Create Account</Button>
            <button onClick={() => router.push("/")} className="mt-2 flex w-full items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Choose a different role
            </button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10 grid place-items-center">
      <div className="w-full max-w-lg space-y-5">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mx-auto shadow-md"><Compass className="w-6 h-6" /></div>
          <h1 className="text-2xl font-bold font-heading text-foreground">{screen === "signin" ? `Sign in as ${role.label}` : `Create ${role.label} account`}</h1>
          <p className="text-xs text-muted-foreground">{role.description}</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">{screen === "signin" ? "Welcome back" : `${role.label} details`}</CardTitle>
            <CardDescription className="text-xs">These details belong only to this role and account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleSubmit}>
              {screen === "signup" && (
                <>
                  <Input required placeholder={roleType === "EMPLOYER" ? "Authorised person’s full name" : "Full name"} icon={<UserRound className="w-4 h-4" />} value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  <Input required type="email" autoComplete="email" placeholder={roleType === "EMPLOYER" || roleType === "DISTRICT_ADMIN" ? "Official email address" : "Email address"} icon={<Mail className="w-4 h-4" />} value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />

                  {roleType === "CANDIDATE" && (
                    <div className="space-y-3 rounded-xl border bg-muted/20 p-3">
                      <AutocompleteInput placeholder="Location (city / district, state)" value={district} onChange={setDistrict} suggestions={LOCATION_SUGGESTIONS} />
                      <AutocompleteInput placeholder="Education (school / college / university)" value={education} onChange={setEducation} suggestions={INSTITUTION_SUGGESTIONS} />
                      <AutocompleteInput placeholder="Qualification (e.g. B.Tech CSE, BBA, BCA)" value={qualification} onChange={setQualification} suggestions={QUALIFICATION_SUGGESTIONS} />
                      <Input required placeholder="Experience (e.g. Fresher, 2 years)" value={experience} onChange={(e) => setExperience(e.target.value)} />
                      <Input required placeholder="Target career / role" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground">Current skills</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              value={skillQuery}
                              onChange={(e) => setSkillQuery(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") { e.preventDefault(); addSkill(skillQuery); }
                              }}
                              placeholder="Search or type a skill"
                              icon={<Search className="h-4 w-4" />}
                              list="candidate-skill-suggestions"
                            />
                            <datalist id="candidate-skill-suggestions">
                              {ALL_SKILL_SUGGESTIONS.filter((skill) => skill.toLowerCase().includes(skillQuery.toLowerCase())).map((skill) => <option key={skill} value={skill} />)}
                            </datalist>
                          </div>
                          <Button type="button" variant="outline" size="sm" onClick={() => addSkill(skillQuery)} aria-label={skillQuery.trim() ? `Add ${skillQuery}` : "Browse all skills"} title={skillQuery.trim() ? "Add typed skill" : "Browse all skills"}><Plus className="h-4 w-4" /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {currentSkills.map((skill) => (
                            <span key={skill.toLowerCase()} className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-xs text-foreground">
                              {skill}
                              <button type="button" onClick={() => setCurrentSkills((items) => items.filter((item) => item !== skill))} aria-label={`Remove ${skill}`}><X className="h-3 w-3 text-muted-foreground" /></button>
                            </span>
                          ))}
                        </div>
                        {skillQuery.trim() && (
                          <div className="flex flex-wrap gap-1.5 rounded-lg border bg-background p-2">
                            {ALL_SKILL_SUGGESTIONS
                              .filter((skill) => skill.toLowerCase().includes(skillQuery.trim().toLowerCase()) && !currentSkills.some((item) => item.toLowerCase() === skill.toLowerCase()))
                              .slice(0, 12)
                              .map((skill) => <button key={skill} type="button" onClick={() => addSkill(skill)} className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary/20">+ {skill}</button>)}
                          </div>
                        )}
                        {showSkillBrowser && !skillQuery.trim() && (
                          <div className="max-h-72 space-y-4 overflow-y-auto rounded-xl border bg-background p-3 shadow-inner">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-xs font-bold text-foreground">Browse all skill categories</p>
                              <button type="button" onClick={() => setShowSkillBrowser(false)} className="rounded-md p-1 text-muted-foreground hover:bg-muted" aria-label="Close skill browser"><X className="h-4 w-4" /></button>
                            </div>
                            {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                              <section key={category} className="space-y-2">
                                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{category}</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {skills.filter((skill) => !currentSkills.some((item) => item.toLowerCase() === skill.toLowerCase())).map((skill) => (
                                    <button key={skill} type="button" onClick={() => addSkill(skill)} className="rounded-full border bg-card px-2.5 py-1 text-[11px] hover:border-primary hover:text-primary">+ {skill}</button>
                                  ))}
                                </div>
                              </section>
                            ))}
                          </div>
                        )}
                        {!skillQuery && currentSkills.length === 0 && !showSkillBrowser && (
                          <div className="space-y-2">
                            <p className="text-[11px] font-semibold text-muted-foreground">Popular AI &amp; data skills</p>
                            <div className="flex flex-wrap gap-1.5">
                              {[...SKILL_CATEGORIES["AI, ML & Agentic AI"].slice(0, 8), "Power BI", "TensorFlow", "PyTorch", "LangChain"].map((skill) =>
                                <button key={skill} type="button" onClick={() => addSkill(skill)} className="rounded-full border bg-background px-2.5 py-1 text-[11px] hover:border-primary hover:text-primary">+ {skill}</button>)}
                            </div>
                          </div>
                        )}
                        <p className="text-[11px] leading-4 text-muted-foreground">Skills added here are self-declared and saved as <strong>Unverified</strong>. Verification requires assessment or evidence.</p>
                        {skillFeedback && <p role="status" className="rounded-lg bg-primary/10 px-3 py-2 text-[11px] font-medium text-primary">{skillFeedback}</p>}
                      </div>
                    </div>
                  )}

                  {roleType === "EMPLOYER" && (
                    <div className="space-y-3 rounded-xl border bg-muted/20 p-3">
                      <Input required placeholder="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                      <Input placeholder="Your designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                      <Input placeholder="Industry / sector" value={industry} onChange={(e) => setIndustry(e.target.value)} />
                      <Input placeholder="CIN / registration number" value={cinNumber} onChange={(e) => setCinNumber(e.target.value)} />
                      <Input placeholder="Company headquarters" value={headquarters} onChange={(e) => setHeadquarters(e.target.value)} />
                    </div>
                  )}

                  {roleType === "TRAINING_PROVIDER" && (
                    <div className="space-y-3 rounded-xl border bg-muted/20 p-3">
                      <Input required placeholder="Institution / organization name" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} />
                      <Input placeholder="Registration / accreditation number" value={registrationNo} onChange={(e) => setRegistrationNo(e.target.value)} />
                      <Input placeholder="Provider type (ITI, university, private...)" value={providerType} onChange={(e) => setProviderType(e.target.value)} />
                      <Input placeholder="Headquarters" value={headquarters} onChange={(e) => setHeadquarters(e.target.value)} />
                    </div>
                  )}

                  {roleType === "DISTRICT_ADMIN" && (
                    <div className="space-y-3 rounded-xl border bg-muted/20 p-3">
                      <Input required placeholder="Department / government body" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} />
                      <Input placeholder="Official designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                      <Input placeholder="District / jurisdiction" value={district} onChange={(e) => setDistrict(e.target.value)} />
                      <Input placeholder="Official employee ID" value={officialId} onChange={(e) => setOfficialId(e.target.value)} />
                    </div>
                  )}
                </>
              )}

              {screen === "signin" && <Input required type="email" autoComplete="email" placeholder={roleType === "EMPLOYER" || roleType === "DISTRICT_ADMIN" ? "Official email address" : "Email address"} icon={<Mail className="w-4 h-4" />} value={email} onChange={(e) => setEmail(e.target.value)} />}
              <Input required type="password" minLength={screen === "signup" ? 8 : undefined} autoComplete={screen === "signin" ? "current-password" : "new-password"} placeholder={screen === "signup" ? "Password (minimum 8 characters)" : "Password"} icon={<Lock className="w-4 h-4" />} value={password} onChange={(e) => setPassword(e.target.value)} />
              {error && <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600">{error}</p>}
              <Button type="submit" disabled={submitting || isLoading} className="w-full text-xs font-semibold">{submitting ? "Please wait..." : screen === "signin" ? "Sign In" : "Create Account"}</Button>
              <button type="button" onClick={() => { setScreen("choice"); setError(""); }} className="flex w-full items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Back</button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
