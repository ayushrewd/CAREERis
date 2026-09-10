"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare, Send, UserRound, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Identity = {
  id: string;
  fullName: string;
  roleType: string;
  avatarUrl?: string | null;
  candidateProfile?: { headline?: string | null; location?: string | null } | null;
  employerAccount?: { companyName: string } | null;
  trainingProviderAccount?: { organizationName: string } | null;
  governmentPlannerProfile?: { departmentName: string } | null;
};
type ChatMessage = { id: string; senderId: string; content: string; createdAt: string; sender: Identity };
type Conversation = { id: string; participants: { userId: string; user: Identity }[]; messages: ChatMessage[] };
type MessageData = { connections: Identity[]; conversations: Conversation[] };

function identityName(user?: Identity | null) {
  return user?.employerAccount?.companyName ||
    user?.trainingProviderAccount?.organizationName ||
    user?.governmentPlannerProfile?.departmentName ||
    user?.fullName ||
    "CAREERIS account";
}

function identityType(user?: Identity | null) {
  if (user?.employerAccount) return "Company";
  if (user?.trainingProviderAccount) return "Training Provider";
  if (user?.governmentPlannerProfile) return "Government / District Planner";
  return user?.candidateProfile?.headline || "Candidate";
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [data, setData] = useState<MessageData>({ connections: [], conversations: [] });
  const [selectedConnectionId, setSelectedConnectionId] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/social/messages", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not load messages.");
      setData(body);
      setError("");
      setSelectedConnectionId((current) => current || body.connections[0]?.id || "");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load messages.");
    }
  }, []);

  useEffect(() => {
    load();
    const refresh = window.setInterval(load, 4000);
    return () => window.clearInterval(refresh);
  }, [load]);

  const activeConnection = data.connections.find((connection) => connection.id === selectedConnectionId);
  const activeConversation = useMemo(() => data.conversations.find((conversation) =>
    conversation.participants.some((participant) => participant.userId === selectedConnectionId)
  ), [data.conversations, selectedConnectionId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages.length, selectedConnectionId]);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (!selectedConnectionId || !text.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/social/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConversation?.id,
          recipientId: selectedConnectionId,
          content: text,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not send message.");
      setText("");
      await load();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Could not send message.");
    } finally {
      setSending(false);
    }
  }

  return <main className="mx-auto max-w-6xl space-y-5 pb-16">
    <header>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Private messaging</p>
      <h1 className="mt-1 text-3xl font-extrabold">Messages</h1>
      <p className="mt-2 text-sm text-muted-foreground">Start a private conversation with any accepted CAREERIS connection.</p>
    </header>

    {error && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-600">{error}</div>}

    <div className="grid min-h-[600px] overflow-hidden rounded-2xl border bg-card shadow-sm md:grid-cols-[300px_1fr]">
      <aside className="border-b p-3 md:border-b-0 md:border-r">
        <div className="mb-3 flex items-center gap-2 px-2 py-1">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold">Connections ({data.connections.length})</h2>
        </div>
        {data.connections.length === 0 ? (
          <div className="rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
            Connect with a registered account first. Messaging becomes available after the request is accepted.
          </div>
        ) : (
          <div className="space-y-1">
            {data.connections.map((connection) => {
              const conversation = data.conversations.find((item) => item.participants.some((participant) => participant.userId === connection.id));
              const latest = conversation?.messages.at(-1);
              return <button key={connection.id} type="button" onClick={() => setSelectedConnectionId(connection.id)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${selectedConnectionId === connection.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ${selectedConnectionId === connection.id ? "bg-primary-foreground/15" : "bg-primary/10 text-primary"}`}>
                  {connection.avatarUrl ? <img src={connection.avatarUrl} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-4 w-4" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{identityName(connection)}</p>
                  <p className={`truncate text-xs ${selectedConnectionId === connection.id ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{latest?.content || identityType(connection)}</p>
                </div>
              </button>;
            })}
          </div>
        )}
      </aside>

      <section className="flex min-h-[500px] flex-col">
        {!activeConnection ? (
          <div className="grid flex-1 place-items-center p-8 text-center">
            <div><MessageSquare className="mx-auto h-10 w-10 text-muted-foreground" /><h2 className="mt-4 font-bold">Select a connection</h2><p className="mt-1 text-sm text-muted-foreground">Choose an accepted connection to start messaging.</p></div>
          </div>
        ) : <>
          <div className="border-b p-4">
            <h2 className="font-bold">{identityName(activeConnection)}</h2>
            <p className="text-xs text-muted-foreground">{identityType(activeConnection)} · Connected</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-muted/10 p-4">
            {!activeConversation?.messages.length && <div className="py-16 text-center text-sm text-muted-foreground">No messages yet. Start the conversation.</div>}
            {activeConversation?.messages.map((message) => {
              const own = message.senderId === user?.id;
              return <div key={message.id} className={`flex ${own ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm ${own ? "bg-primary text-primary-foreground" : "border bg-background"}`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`mt-1 text-[10px] ${own ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{new Date(message.createdAt).toLocaleString()}</p>
                </div>
              </div>;
            })}
            <div ref={endRef} />
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 border-t p-4">
            <Input value={text} onChange={(event) => setText(event.target.value)} placeholder={`Message ${identityName(activeConnection)}`} maxLength={5000} />
            <Button type="submit" disabled={sending || !text.trim()} className="gap-2"><Send className="h-4 w-4" />{sending ? "Sending..." : "Send"}</Button>
          </form>
        </>}
      </section>
    </div>
  </main>;
}
