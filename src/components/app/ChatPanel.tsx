"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, RotateCcw, Send, Sparkles } from "lucide-react";
import ModelSwitcher from "@/components/app/ModelSwitcher";
import type { LocalProfile } from "@/lib/local-db";
import type { LocalProject } from "@/lib/local-db";
import { consumeSSEStream } from "@/lib/sse";
import { cn } from "@/lib/cn";
import type { ModelId } from "@/types/models";

export default function ChatPanel({
  project,
  profile,
  onComplete,
}: {
  project: LocalProject;
  profile: LocalProfile;
  onComplete: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedModelId, setSelectedModelId] = useState<ModelId>(project.modelId);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState<"live" | "demo">("demo");
  const messagesRef = useRef<HTMLDivElement>(null);
  const quickPromptRan = useRef(false);

  useEffect(() => {
    void fetch("/api/ai/status")
      .then((r) => r.json())
      .then((d: { mode?: "live" | "demo" }) => setAiMode(d.mode ?? "demo"));
  }, []);

  function scrollMessagesToBottom() {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }

  useEffect(() => {
    scrollMessagesToBottom();
  }, [project.messages.length, streamText]);

  async function runGeneration(prompt: string) {
    if (!prompt.trim() || streaming) return;

    setError(null);
    setStreaming(true);
    setStreamText("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          modelId: selectedModelId,
          projectId: project.id,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Generation failed.");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream.");

      await consumeSSEStream(reader, (text) => {
        setStreamText((t) => t + text);
      });

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error.");
    } finally {
      setStreaming(false);
      setStreamText("");
      requestAnimationFrame(scrollMessagesToBottom);
    }
  }

  useEffect(() => {
    const q = searchParams.get("q");
    if (!q || quickPromptRan.current || project.messages.length > 0) return;
    quickPromptRan.current = true;
    router.replace(`/app/${project.id}`);
    void runGeneration(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once for dashboard quick prompt
  }, [searchParams, project.id, project.messages.length]);

  const tokenEstimate = project.messages.reduce(
    (acc, m) => acc + Math.ceil(m.content.length / 4),
    Math.ceil(streamText.length / 4),
  );

  const suggestions = [
    "Create a coin leaderstat system for my obby",
    "Add a daily reward with DataStore",
    "Build a shop GUI with purchase buttons",
  ];

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg-primary/80">
      {/* Header — fixed height */}
      <div className="relative z-20 shrink-0 border-b border-white/[0.06] p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            AI Chat
          </p>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-mono text-[9px] uppercase",
              aiMode === "live"
                ? "bg-success/15 text-success"
                : "bg-warning/15 text-warning",
            )}
          >
            {aiMode === "live" ? "Live AI" : "Demo mode"}
          </span>
        </div>
        <ModelSwitcher
          selectedModelId={selectedModelId}
          plan={profile.plan}
          onSelect={setSelectedModelId}
        />
      </div>

      {/* Messages — scrollable middle */}
      <div
        ref={messagesRef}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4"
      >
        {project.messages.length === 0 && !streaming && (
          <div className="rounded-2xl border border-white/[0.06] bg-bg-secondary/60 p-5">
            <div className="flex items-center gap-2 text-accent">
              <Sparkles className="h-4 w-4" />
              <p className="text-sm font-medium">What should we build?</p>
            </div>
            <p className="mt-2 text-sm text-text-muted">
              Describe a Roblox feature — LimeForge writes Luau and syncs to
              Studio.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void runGeneration(s)}
                  className="rounded-full border border-white/[0.08] bg-bg-surface/80 px-3 py-1.5 text-xs text-text-muted transition hover:border-accent-border hover:text-text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {project.messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              msg.role === "user"
                ? "ml-4 border-white/[0.06] bg-bg-surface/80"
                : "mr-2 border-accent-border/30 bg-bg-secondary/80",
            )}
          >
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-muted">
              {msg.role === "user" ? "You" : (msg.modelId ?? "AI")}
            </p>
            <div className="prose-chat">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {streaming && (
          <div className="mr-2 rounded-2xl border border-accent-border/40 bg-bg-secondary/80 px-4 py-3 text-sm">
            <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-accent">
              <Loader2 className="h-3 w-3 animate-spin" />
              Generating…
            </p>
            {streamText ? (
              <div className="prose-chat">
                <ReactMarkdown>{streamText}</ReactMarkdown>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input — pinned bottom */}
      <div className="shrink-0 border-t border-white/[0.06] bg-bg-primary/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {error && (
          <div className="mb-3 rounded-xl border border-error/40 bg-error/10 px-4 py-2 text-sm text-error">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void runGeneration(input);
                setInput("");
              }
            }}
            placeholder="Create a round-based lobby system…"
            rows={2}
            className="flex-1 resize-none rounded-xl border border-white/[0.08] bg-bg-surface/90 px-4 py-3 text-sm placeholder:text-text-faint focus:border-accent-border focus:outline-none focus:ring-1 focus:ring-accent-border/50"
          />
          <button
            type="button"
            disabled={streaming || !input.trim()}
            onClick={() => {
              void runGeneration(input);
              setInput("");
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-bg-primary shadow-[0_0_24px_var(--glow)] transition hover:bg-accent-soft disabled:opacity-40"
          >
            {streaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-text-muted">
          <span>
            {profile.requestsUsed}/{profile.requestsLimit} requests
          </span>
          <span>~{tokenEstimate} tokens</span>
        </div>
        {project.messages.some((m) => m.role === "assistant") && (
          <button
            type="button"
            className="mt-1 flex items-center gap-1 text-xs text-text-muted hover:text-accent"
            onClick={() => {
              const lastUser = [...project.messages]
                .reverse()
                .find((m) => m.role === "user");
              if (lastUser) void runGeneration(lastUser.content);
            }}
          >
            <RotateCcw className="h-3 w-3" /> Regenerate last
          </button>
        )}
      </div>
    </div>
  );
}