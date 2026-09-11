"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Requirement = { name: string; proficiency: string; mandatory: boolean };
type SkillOption = { name: string; aliases?: string[] };

const SKILL_CATALOG: SkillOption[] = [
  { name: "Artificial Intelligence", aliases: ["ai", "aiml"] },
  { name: "Machine Learning", aliases: ["ml", "aiml"] },
  { name: "Deep Learning", aliases: ["dl", "neural networks"] },
  { name: "Generative AI", aliases: ["genai", "gen ai"] },
  { name: "Agentic AI", aliases: ["ai agents", "agentic systems"] },
  { name: "AI Agents", aliases: ["agents", "multi agent"] },
  { name: "Large Language Models", aliases: ["llm", "llms"] },
  { name: "Natural Language Processing", aliases: ["nlp"] },
  { name: "Computer Vision", aliases: ["cv", "opencv"] },
  { name: "Retrieval-Augmented Generation", aliases: ["rag"] },
  { name: "Prompt Engineering", aliases: ["prompting"] },
  { name: "Python" }, { name: "R" }, { name: "C" }, { name: "C++", aliases: ["cpp"] },
  { name: "C#", aliases: ["csharp"] }, { name: "Java" }, { name: "JavaScript", aliases: ["js"] },
  { name: "TypeScript", aliases: ["ts"] }, { name: "Go", aliases: ["golang"] }, { name: "Rust" },
  { name: "TensorFlow" }, { name: "PyTorch" }, { name: "Keras" }, { name: "Scikit-learn", aliases: ["sklearn"] },
  { name: "Pandas" }, { name: "NumPy" }, { name: "Matplotlib" }, { name: "Hugging Face" },
  { name: "LangChain" }, { name: "LlamaIndex" }, { name: "CrewAI" }, { name: "AutoGen" },
  { name: "Vector Databases" }, { name: "Pinecone" }, { name: "ChromaDB" }, { name: "MLflow" },
  { name: "MLOps" }, { name: "Model Deployment" }, { name: "Data Engineering" }, { name: "Data Science" },
  { name: "Data Analytics" }, { name: "Data Visualization" }, { name: "Statistics" },
  { name: "SQL" }, { name: "PostgreSQL" }, { name: "MySQL" }, { name: "MongoDB" }, { name: "Redis" },
  { name: "Power BI", aliases: ["powerbi"] }, { name: "DAX" }, { name: "Tableau" }, { name: "Microsoft Excel", aliases: ["excel"] },
  { name: "Apache Spark" }, { name: "Hadoop" }, { name: "React" }, { name: "Next.js", aliases: ["nextjs"] },
  { name: "Angular" }, { name: "Vue.js", aliases: ["vue"] }, { name: "HTML" }, { name: "CSS" },
  { name: "Tailwind CSS" }, { name: "Node.js", aliases: ["nodejs"] }, { name: "Express.js", aliases: ["express"] },
  { name: "NestJS" }, { name: "Django" }, { name: "Flask" }, { name: "FastAPI" }, { name: "Spring Boot" },
  { name: ".NET" }, { name: "REST APIs" }, { name: "GraphQL" }, { name: "Android Development" },
  { name: "Kotlin" }, { name: "iOS Development" }, { name: "Swift" }, { name: "Flutter" }, { name: "React Native" },
  { name: "Git" }, { name: "GitHub" }, { name: "Linux" }, { name: "Docker" }, { name: "Kubernetes" },
  { name: "Jenkins" }, { name: "CI/CD" }, { name: "Terraform" }, { name: "Ansible" },
  { name: "Amazon Web Services", aliases: ["aws"] }, { name: "Microsoft Azure", aliases: ["azure"] },
  { name: "Google Cloud Platform", aliases: ["gcp"] }, { name: "Cloud Computing" }, { name: "Microservices" },
  { name: "Cybersecurity" }, { name: "Network Security" }, { name: "Ethical Hacking" },
  { name: "Penetration Testing" }, { name: "SOC Operations" }, { name: "SIEM" }, { name: "Cryptography" },
  { name: "Blockchain" }, { name: "Smart Contracts" }, { name: "Solidity" },
  { name: "Battery Management Systems", aliases: ["bms"] }, { name: "CAN Communication", aliases: ["can bus"] },
  { name: "Battery Diagnostics" }, { name: "Thermal Management" }, { name: "Electric Vehicles", aliases: ["ev"] },
  { name: "Embedded Systems" }, { name: "Internet of Things", aliases: ["iot"] }, { name: "MATLAB" },
  { name: "Simulink" }, { name: "PLC Programming" }, { name: "Robotics" }, { name: "VLSI" },
  { name: "Verilog" }, { name: "PCB Design" }, { name: "AutoCAD" }, { name: "SolidWorks" },
  { name: "CATIA" }, { name: "Mechanical Design" }, { name: "Finite Element Analysis", aliases: ["fea"] },
  { name: "Civil Engineering" }, { name: "Structural Analysis" }, { name: "Building Information Modeling", aliases: ["bim"] },
  { name: "Revit" }, { name: "Quantity Surveying" }, { name: "Project Management" }, { name: "Agile" },
  { name: "Scrum" }, { name: "Jira" }, { name: "Product Management" }, { name: "Business Analysis" },
  { name: "Digital Marketing" }, { name: "SEO" }, { name: "Financial Analysis" }, { name: "Communication" },
  { name: "Problem Solving" }, { name: "Team Leadership" }, { name: "Customer Relationship Management", aliases: ["crm"] },
];

const ROLE_SKILL_GROUPS = [
  { keywords: ["ai", "artificial intelligence", "machine learning", "ml engineer", "data scientist"], skills: ["Python", "Artificial Intelligence", "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "Scikit-learn", "Pandas", "MLOps"] },
  { keywords: ["generative", "genai", "llm", "agentic", "ai agent"], skills: ["Generative AI", "Large Language Models", "Agentic AI", "AI Agents", "Retrieval-Augmented Generation", "LangChain", "LlamaIndex", "Prompt Engineering", "Vector Databases"] },
  { keywords: ["data analyst", "business intelligence", "bi analyst", "analytics"], skills: ["SQL", "Power BI", "Microsoft Excel", "DAX", "Tableau", "Data Analytics", "Data Visualization", "Statistics"] },
  { keywords: ["frontend", "front end", "react developer", "web developer"], skills: ["JavaScript", "TypeScript", "React", "Next.js", "HTML", "CSS", "Tailwind CSS", "Git"] },
  { keywords: ["backend", "back end", "api developer", "software engineer"], skills: ["REST APIs", "SQL", "Git", "Docker", "Node.js", "Java", "Python", "Microservices"] },
  { keywords: ["full stack", "fullstack"], skills: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "REST APIs", "PostgreSQL", "Git", "Docker"] },
  { keywords: ["devops", "cloud engineer", "site reliability", "sre"], skills: ["Linux", "Docker", "Kubernetes", "CI/CD", "Jenkins", "Terraform", "Amazon Web Services", "Microsoft Azure", "Git"] },
  { keywords: ["cyber", "security analyst", "soc analyst", "penetration"], skills: ["Cybersecurity", "Network Security", "Ethical Hacking", "Penetration Testing", "SOC Operations", "SIEM", "Linux"] },
  { keywords: ["android", "mobile developer"], skills: ["Android Development", "Kotlin", "Java", "REST APIs", "Git"] },
  { keywords: ["flutter"], skills: ["Flutter", "REST APIs", "Git"] },
  { keywords: ["ev", "battery", "bms"], skills: ["Electric Vehicles", "Battery Management Systems", "CAN Communication", "Battery Diagnostics", "Thermal Management", "Embedded Systems", "Python", "MATLAB", "Simulink"] },
  { keywords: ["embedded", "iot", "electronics", "ece"], skills: ["Embedded Systems", "Internet of Things", "C", "C++", "PCB Design", "VLSI", "Verilog", "Python"] },
  { keywords: ["civil", "structural", "construction"], skills: ["Civil Engineering", "AutoCAD", "Structural Analysis", "Building Information Modeling", "Revit", "Quantity Surveying", "Project Management"] },
  { keywords: ["mechanical", "design engineer", "manufacturing"], skills: ["Mechanical Design", "AutoCAD", "SolidWorks", "CATIA", "Finite Element Analysis", "Project Management"] },
  { keywords: ["product manager", "project manager", "business analyst"], skills: ["Product Management", "Project Management", "Business Analysis", "Agile", "Scrum", "Jira", "Communication", "Team Leadership"] },
];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9+#.]/g, "");

function contextIncludesKeyword(context: string, keyword: string) {
  if (keyword.length > 3 || keyword.includes(" ")) return context.includes(keyword);
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(context);
}

function findSkillSuggestions(query: string, contextSkills: string[]) {
  const q = normalize(query);
  return SKILL_CATALOG.map((skill) => {
    const values = [skill.name, ...(skill.aliases || [])].map(normalize);
    const prefix = q && values.some((value) => value.startsWith(q));
    const contains = q && values.some((value) => value.includes(q) || q.includes(value));
    return { skill, score: prefix ? 4 : contains ? 3 : contextSkills.includes(skill.name) ? 2 : 0 };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.skill.name.localeCompare(b.skill.name)).slice(0, 8).map((item) => item.skill.name);
}

export default function CreateJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", location: "", sector: "", qualification: "", jobType: "FULL_TIME", minExperience: "0", maxExperience: "", minSalaryINR: "", maxSalaryINR: "", openPositions: "1" });
  const [requirements, setRequirements] = useState<Requirement[]>([{ name: "", proficiency: "INTERMEDIATE", mandatory: true }]);
  const [activeSkill, setActiveSkill] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const contextualSkills = useMemo(() => {
    const context = `${form.title} ${form.description} ${form.sector}`.toLowerCase();
    const result: string[] = [];
    ROLE_SKILL_GROUPS.forEach((group) => {
      if (group.keywords.some((keyword) => contextIncludesKeyword(context, keyword))) result.push(...group.skills);
    });
    return [...new Set(result)].slice(0, 12);
  }, [form.title, form.description, form.sector]);

  function setRequirement(index: number, changes: Partial<Requirement>) {
    setRequirements((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...changes } : item));
  }

  function addSuggestedSkill(name: string, index?: number) {
    if (requirements.some((item, itemIndex) => normalize(item.name) === normalize(name) && itemIndex !== index)) return;
    if (typeof index === "number") {
      setRequirement(index, { name });
      setActiveSkill(null);
      return;
    }
    const emptyIndex = requirements.findIndex((item) => !item.name.trim());
    if (emptyIndex >= 0) setRequirement(emptyIndex, { name });
    else setRequirements((current) => [...current, { name, proficiency: "INTERMEDIATE", mandatory: true }]);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
    const response = await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, requirements }) });
    const body = await response.json();
    if (!response.ok) {
      setError(typeof body.error === "string" ? body.error : body.error?.message || "Could not publish this job.");
      setSaving(false);
      return;
    }
    router.push("/employer/jobs");
    router.refresh();
    } catch {
      setError("Could not reach the server. Your form is preserved; please try again.");
    } finally {
      setSaving(false);
    }
  }

  return <main className="mx-auto max-w-4xl space-y-6 pb-16">
    <header><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Company job publishing</p><h1 className="mt-1 text-3xl font-extrabold">Publish a company job</h1><p className="mt-2 text-sm text-muted-foreground">Only the signed-in registered company can publish this record. It becomes a demand signal under that company&apos;s identity.</p></header>
    {error && <div className="rounded-xl border border-red-500/30 p-4 text-sm text-red-600">{error}</div>}
    <Card><CardHeader><CardTitle>Job details</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold">Job title<Input required className="mt-1" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Example: AI/ML Engineer" /></label>
        <label className="text-sm font-semibold">Location<Input required className="mt-1" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></label>
        <label className="text-sm font-semibold">Sector<Input className="mt-1" value={form.sector} onChange={(event) => setForm({ ...form, sector: event.target.value })} /></label>
        <label className="text-sm font-semibold">Qualification<Input className="mt-1" value={form.qualification} onChange={(event) => setForm({ ...form, qualification: event.target.value })} /></label>
        <label className="text-sm font-semibold">Minimum experience<Input type="number" min="0" className="mt-1" value={form.minExperience} onChange={(event) => setForm({ ...form, minExperience: event.target.value })} /></label>
        <label className="text-sm font-semibold">Maximum experience<Input type="number" min="0" className="mt-1" value={form.maxExperience} onChange={(event) => setForm({ ...form, maxExperience: event.target.value })} /></label>
        <label className="text-sm font-semibold">Minimum salary (optional)<Input type="number" min="0" className="mt-1" value={form.minSalaryINR} onChange={(event) => setForm({ ...form, minSalaryINR: event.target.value })} /></label>
        <label className="text-sm font-semibold">Maximum salary (optional)<Input type="number" min="0" className="mt-1" value={form.maxSalaryINR} onChange={(event) => setForm({ ...form, maxSalaryINR: event.target.value })} /></label>
      </div>
      <label className="text-sm font-semibold">Job description<Textarea required rows={7} className="mt-1" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
      <section className="space-y-3">
        <div className="flex items-center justify-between"><h2 className="font-bold">Required skills and proficiency</h2><Button type="button" variant="outline" size="sm" onClick={() => setRequirements([...requirements, { name: "", proficiency: "INTERMEDIATE", mandatory: true }])}><Plus className="mr-1 h-4 w-4" />Add skill</Button></div>
        {contextualSkills.length > 0 && <div className="rounded-xl border border-primary/20 bg-primary/5 p-3"><p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-primary"><Sparkles className="h-3.5 w-3.5" />Suggested for this job</p><div className="flex flex-wrap gap-2">{contextualSkills.map((skill) => { const added = requirements.some((item) => normalize(item.name) === normalize(skill)); return <button key={skill} type="button" disabled={added} onClick={() => addSuggestedSkill(skill)} className="rounded-full border bg-background px-3 py-1 text-xs font-medium transition-colors hover:border-primary hover:text-primary disabled:cursor-default disabled:opacity-45">{added ? "✓ " : "+ "}{skill}</button>; })}</div></div>}
        {requirements.map((item, index) => {
          const suggestions = findSkillSuggestions(item.name, contextualSkills).filter((skill) => !requirements.some((requirement, requirementIndex) => requirementIndex !== index && normalize(requirement.name) === normalize(skill)));
          return <div key={index} className="grid gap-2 rounded-xl border p-3 sm:grid-cols-[1fr_180px_120px_40px]">
            <div className="relative"><Input required autoComplete="off" placeholder="Type to search skills" value={item.name} onFocus={() => setActiveSkill(index)} onChange={(event) => { setRequirement(index, { name: event.target.value }); setActiveSkill(index); }} onBlur={() => window.setTimeout(() => setActiveSkill((current) => current === index ? null : current), 120)} />{activeSkill === index && suggestions.length > 0 && <div className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border bg-popover p-1 shadow-xl">{suggestions.map((skill) => <button key={skill} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => addSuggestedSkill(skill, index)} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"><span className="font-medium">{skill}</span>{contextualSkills.includes(skill) && <span className="ml-2 text-[10px] font-bold uppercase text-primary">Recommended</span>}</button>)}</div>}</div>
            <select className="rounded-md border bg-background px-3 text-sm" value={item.proficiency} onChange={(event) => setRequirement(index, { proficiency: event.target.value })}><option>FOUNDATIONAL</option><option>INTERMEDIATE</option><option>ADVANCED</option><option>EXPERT</option></select>
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={item.mandatory} onChange={(event) => setRequirement(index, { mandatory: event.target.checked })} />Mandatory</label>
            <Button type="button" variant="ghost" size="sm" disabled={requirements.length === 1} aria-label={`Remove ${item.name || "skill"}`} onClick={() => setRequirements(requirements.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="h-4 w-4" /></Button>
          </div>;
        })}
      </section>
      <Button disabled={saving} type="submit">{saving ? "Publishing…" : "Publish company job"}</Button>
    </form></CardContent></Card>
  </main>;
}
