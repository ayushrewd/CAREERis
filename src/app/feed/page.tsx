"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileCode2,
  MessageSquare,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  ThumbsUp,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getRoleProfileRoute } from "@/lib/rbac/roleRoutes";

type Activity = {
  registeredAccounts: number;
  registeredCompanies: number;
  activeJobs: number;
  verifiedCourses: number;
  totalPosts: number;
};

function identityName(user: any) {
  return user?.companyName || user?.organizationName || user?.departmentName ||
    user?.employerAccount?.companyName || user?.trainingProviderAccount?.organizationName ||
    user?.fullName || "CAREERIS account";
}

function identityType(user: any) {
  if (user?.employerAccount || user?.companyName) return "Company";
  if (user?.trainingProviderAccount || user?.organizationName) return "Training Provider";
  return user?.candidateProfile?.headline || user?.headline || user?.roleType?.replaceAll("_", " ") || "Member";
}

export default function FeedPage() {
  const { user } = useAuth();
  const [data, setData] = useState<{ posts: any[]; connectionCount: number; platformActivity: Activity }>({
    posts: [],
    connectionCount: 0,
    platformActivity: { registeredAccounts: 0, registeredCompanies: 0, activeJobs: 0, verifiedCourses: 0, totalPosts: 0 },
  });
  const [text, setText] = useState("");
  const [composerMode, setComposerMode] = useState("Update");
  const [comments, setComments] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/social/feed", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not load your feed.");
      setData(body);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load your feed.");
    }
  }, []);

  useEffect(() => {
    load();
    const refresh = window.setInterval(load, 5000);
    return () => window.clearInterval(refresh);
  }, [load]);

  async function action(payload: Record<string, unknown>) {
    const response = await fetch("/api/social/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json();
    if (!response.ok) {
      setError(body.error || "Could not update the post.");
      return false;
    }
    await load();
    return true;
  }

  async function createPost(event: FormEvent) {
    event.preventDefault();
    if (!text.trim() || publishing) return;
    setPublishing(true);
    const created = await action({ action: "CREATE", content: text });
    if (created) setText("");
    setPublishing(false);
  }

  function selectComposerMode(mode: string) {
    setComposerMode(mode);
    composerRef.current?.focus();
  }

  const name = identityName(user);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part: string) => part[0]).join("").toUpperCase();
  const profileHref = getRoleProfileRoute(user?.roleType);
  const isCandidate = user?.roleType === "CANDIDATE";
  const activity = data.platformActivity;

  return <main className="mx-auto grid w-full max-w-[1180px] items-start gap-5 pb-16 lg:grid-cols-[225px_minmax(0,1fr)_280px]">
    <aside className="space-y-3 lg:sticky lg:top-[76px]">
      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="h-16 bg-gradient-to-r from-blue-200 via-indigo-100 to-cyan-100" />
        <div className="px-4 pb-4 text-center">
          <div className="mx-auto -mt-9 grid h-[72px] w-[72px] place-items-center overflow-hidden rounded-full border-4 border-card bg-primary text-xl font-extrabold text-primary-foreground shadow-sm">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt={name} className="h-full w-full object-cover" /> : initials || <UserRound className="h-6 w-6" />}
          </div>
          <Link href={profileHref} className="mt-3 block font-bold hover:text-primary hover:underline">{name}</Link>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{identityType(user)}</p>
        </div>
        <Link href="/employers" className="flex items-center justify-between border-t px-4 py-3 text-xs hover:bg-muted/50">
          <span className="font-semibold text-muted-foreground">Connections</span>
          <strong className="text-primary">{data.connectionCount}</strong>
        </Link>
      </section>

      <nav className="overflow-hidden rounded-xl border bg-card py-2 text-sm shadow-sm">
        <Link href="/messages" className="flex items-center gap-3 px-4 py-2.5 font-semibold hover:bg-muted"><MessageSquare className="h-4 w-4" /> Messages</Link>
        <Link href="/jobs" className="flex items-center gap-3 px-4 py-2.5 font-semibold hover:bg-muted"><BriefcaseBusiness className="h-4 w-4" /> Jobs</Link>
        {isCandidate && <Link href="/candidate/skill-passport" className="flex items-center gap-3 px-4 py-2.5 font-semibold hover:bg-muted"><ShieldCheck className="h-4 w-4" /> Skill Passport</Link>}
        {isCandidate && <Link href="/candidate/goals" className="flex items-center gap-3 px-4 py-2.5 font-semibold hover:bg-muted"><Target className="h-4 w-4" /> Career Goal</Link>}
        <Link href="/courses" className="flex items-center gap-3 px-4 py-2.5 font-semibold hover:bg-muted"><BookOpen className="h-4 w-4" /> Learning</Link>
      </nav>
    </aside>

    <section className="min-w-0 space-y-3">
      <section className="rounded-xl border bg-card p-4 shadow-sm">
        <form onSubmit={createPost}>
          <div className="flex gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{initials || "ME"}</div>
            <Textarea
              ref={composerRef}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={`Share a professional ${composerMode.toLowerCase()}...`}
              className="min-h-12 resize-none rounded-3xl px-5 py-3"
              maxLength={5000}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pl-0 sm:pl-14">
            <div className="flex flex-wrap gap-1">
              <button type="button" onClick={() => selectComposerMode("Achievement")} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"><Award className="h-4 w-4 text-amber-600" /> Achievement</button>
              <button type="button" onClick={() => selectComposerMode("Project")} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"><FileCode2 className="h-4 w-4 text-blue-600" /> Project</button>
              <button type="button" onClick={() => selectComposerMode("Update")} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"><Sparkles className="h-4 w-4 text-emerald-600" /> Update</button>
            </div>
            <Button type="submit" size="sm" disabled={!text.trim() || publishing} className="gap-1.5 rounded-full px-5"><Send className="h-3.5 w-3.5" />{publishing ? "Posting..." : "Post"}</Button>
          </div>
        </form>
      </section>

      {error && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-600">{error}</div>}

      {data.posts.length === 0 ? <section className="rounded-xl border bg-card p-10 text-center shadow-sm">
        <Users className="mx-auto h-9 w-9 text-muted-foreground" />
        <h2 className="mt-4 font-bold">Your connection feed is ready</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Posts from your accepted connections will appear here. Publish your first update or connect with another registered CAREERIS account.</p>
        <Link href="/employers" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">Grow your network <ChevronRight className="h-4 w-4" /></Link>
      </section> : data.posts.map((post) => <article key={post.id} className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-start justify-between p-4">
          <div className="flex gap-3">
            <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-primary/10 font-bold text-primary">
              {post.author.avatarUrl ? <img src={post.author.avatarUrl} alt="" className="h-full w-full object-cover" /> : identityName(post.author).slice(0, 2).toUpperCase()}
            </div>
            <div>
              <strong className="text-sm">{identityName(post.author)}</strong>
              <p className="text-xs text-muted-foreground">{identityType(post.author)}</p>
              <p className="text-[11px] text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </div>
          {post.authorId === user?.id && <button type="button" aria-label="Delete post" onClick={() => action({ action: "DELETE", postId: post.id })} className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
        </div>
        <p className="whitespace-pre-wrap px-4 pb-4 text-sm leading-6">{post.content}</p>
        <div className="mx-4 flex items-center justify-between border-t py-2 text-xs text-muted-foreground">
          <span>{post.reactionCount} reaction{post.reactionCount === 1 ? "" : "s"}</span>
          <span>{post.comments.length} comment{post.comments.length === 1 ? "" : "s"} · {post.shareCount} share{post.shareCount === 1 ? "" : "s"}</span>
        </div>
        <div className="grid grid-cols-3 border-y px-2 py-1 text-sm">
          <button type="button" onClick={() => action({ action: "REACT", postId: post.id })} className={`rounded-lg py-2 font-semibold hover:bg-muted ${post.liked ? "text-primary" : "text-muted-foreground"}`}><ThumbsUp className="mr-2 inline h-4 w-4" />React</button>
          <button type="button" onClick={() => document.getElementById(`comment-${post.id}`)?.focus()} className="rounded-lg py-2 font-semibold text-muted-foreground hover:bg-muted"><MessageSquare className="mr-2 inline h-4 w-4" />Comment</button>
          <button type="button" onClick={() => action({ action: "SHARE", postId: post.id })} className="rounded-lg py-2 font-semibold text-muted-foreground hover:bg-muted"><Share2 className="mr-2 inline h-4 w-4" />Share</button>
        </div>
        <div className="space-y-2 p-4">
          {post.comments.map((comment: any) => <div key={comment.id} className="rounded-xl bg-muted/60 px-3 py-2 text-xs"><strong>{identityName(comment.author)}</strong><p className="mt-1 leading-5">{comment.content}</p></div>)}
          <form onSubmit={(event) => { event.preventDefault(); const value = comments[post.id]?.trim(); if (value) action({ action: "COMMENT", postId: post.id, content: value }).then((success) => success && setComments((current) => ({ ...current, [post.id]: "" }))); }} className="flex gap-2">
            <input id={`comment-${post.id}`} className="min-w-0 flex-1 rounded-full border bg-background px-4 text-xs outline-none focus:ring-2 focus:ring-primary/20" value={comments[post.id] || ""} onChange={(event) => setComments((current) => ({ ...current, [post.id]: event.target.value }))} placeholder="Write a comment..." />
            <Button size="sm" className="rounded-full">Comment</Button>
          </form>
        </div>
      </article>)}
    </section>

    <aside className="hidden space-y-3 lg:block lg:sticky lg:top-[76px]">
      <section className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between"><h2 className="font-bold">CAREERIS activity</h2><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
        <p className="mt-1 text-xs text-muted-foreground">Live records from registered accounts only.</p>
        <div className="mt-4 divide-y">
          {[
            ["Registered accounts", activity.registeredAccounts],
            ["Registered companies", activity.registeredCompanies],
            ["Active company jobs", activity.activeJobs],
            ["Provider courses", activity.verifiedCourses],
            ["Community posts", activity.totalPosts],
          ].map(([label, value]) => <div key={String(label)} className="flex items-center justify-between py-2.5 text-xs"><span className="text-muted-foreground">{label}</span><strong>{value}</strong></div>)}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-4 shadow-sm">
        <h2 className="font-bold">Evidence status</h2>
        {activity.activeJobs > 0 ? <div className="mt-3 rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-800"><strong>Employer evidence available</strong><p className="mt-1 leading-5">Career roles and skill requirements are backed by active company jobs.</p></div> : <div className="mt-3 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-800"><strong>No employer demand evidence yet</strong><p className="mt-1 leading-5">Job intelligence will appear after a registered company publishes a job.</p></div>}
        <Link href="/jobs" className="mt-4 flex items-center justify-between text-xs font-bold text-primary hover:underline">Explore company jobs <ChevronRight className="h-4 w-4" /></Link>
      </section>

      <section className="px-2 text-[11px] leading-5 text-muted-foreground">
        <p>CAREERIS · Evidence-Based Skill &amp; Workforce Intelligence</p>
        <div className="mt-1 flex gap-3"><Link href="/about" className="hover:underline">About</Link><Link href="/trust" className="hover:underline">Trust &amp; Evidence</Link></div>
      </section>
    </aside>
  </main>;
}
