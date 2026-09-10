import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, GraduationCap, Landmark, UserRound } from "lucide-react";
import { CareerISLogo } from "@/components/ui/CareerISLogo";
import { DownloadAppButton } from "@/components/pwa/DownloadAppButton";

const roles = [
  {
    key: "CANDIDATE",
    title: "Job Seeker / Candidate",
    description: "Assess your skills, discover gaps, build evidence, and find relevant opportunities.",
    icon: UserRound,
    accent: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    key: "EMPLOYER",
    title: "Company",
    description: "Register your company, publish genuine jobs, define skill requirements, review applicants, and provide post-hire feedback.",
    icon: BriefcaseBusiness,
    accent: "text-blue-600 bg-blue-500/10 border-blue-500/20",
  },
  {
    key: "TRAINING_PROVIDER",
    title: "Training Provider",
    description: "Align courses, trainers, equipment and capacity with industry demand.",
    icon: GraduationCap,
    accent: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    key: "DISTRICT_ADMIN",
    title: "Government / District Planner",
    description: "Analyse labour-market signals and create evidence-based district training plans.",
    icon: Landmark,
    accent: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  },
] as const;

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-10 sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-96 bg-gradient-to-b from-indigo-500/10 via-blue-500/5 to-transparent" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <header className="mx-auto max-w-3xl text-center">
          <div className="mb-7 flex justify-center"><CareerISLogo size="lg" showText={true} showTagline={false} /></div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">Evidence-Based Skill &amp; Workforce Intelligence Platform</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Connecting Industry Demand <span className="text-primary">→</span> Skills <span className="text-primary">→</span> Training <span className="text-primary">→</span> Employment
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <DownloadAppButton variant="hero" />
          </div>
        </header>

        <section className="mt-12 sm:mt-16" aria-labelledby="role-heading">
          <div className="mb-7 text-center">
            <h2 id="role-heading" className="font-heading text-2xl font-bold text-foreground sm:text-3xl">How are you using CAREERIS?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Select your role to sign in or create your account.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {roles.map(({ key, title, description, icon: Icon, accent }) => (
              <Link key={key} href={`/login?role=${key}`} className="group rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${accent}`}><Icon className="h-6 w-6" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-heading text-base font-bold text-foreground sm:text-lg">{title}</h3>
                      <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <footer className="mt-10 text-center text-xs text-muted-foreground">Your account and profile information are securely linked to your own identity.</footer>
      </div>
    </main>
  );
}
