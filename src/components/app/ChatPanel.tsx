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

  const suggestions = [
    "Coin leaderstat for my obby",
    "Daily reward with DataStore",
    "Shop GUI with buttons",
  ];

  return (
    <div className="chat-panel h-full min-h-0 bg-bg-primary/80">
      {/* ROW 1 — header */}
      <div className="relative z-20 shrink-0 border-b border-white/[0.06] px-3 py-2">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            AI Chat
          </p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-text-faint">
              {profile.requestsUsed}/{profile.requestsLimit}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[9px] uppercase",
                aiMode === "live"
                  ? "bg-success/15 text-success"
                  : "bg-warning/15 text-warning",
              )}
            >
              {aiMode === "live" ? "Live" : "Demo"}
            </span>
            {project.messages.some((m) => m.role === "assistant") && (
              <button
                type="button"
                title="Regenerate"
                className="text-text-muted hover:text-accent"
                onClick={() => {
                  const lastUser = [...project.messages]
                    .reverse()
                    .find((m) => m.role === "user");
                  if (lastUser) void runGeneration(lastUser.content);
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
        <ModelSwitcher
          selectedModelId={selectedModelId}
          plan={profile.plan}
          onSelect={setSelectedModelId}
        />
      </div>

      {/* ROW 2 — scrollable messages only */}
      <div ref={messagesRef} className="chat-panel-messages space-y-3 p-3">
        {project.messages.length === 0 && !streaming && (
          <div className="rounded-xl border border-white/[0.06] bg-bg-secondary/60 p-4">
            <div className="flex items-center gap-2 text-accent">
              <Sparkles className="h-4 w-4" />
              <p className="text-sm font-medium">What should we build?</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void runGeneration(s)}
                  className="rounded-full border border-white/[0.08] bg-bg-surface/80 px-2.5 py-1 text-xs text-text-muted hover:border-accent-border"
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
              "rounded-xl border px-3 py-2 text-sm",
              msg.role === "user"
                ? "ml-2 border-white/[0.06] bg-bg-surface/80"
                : "mr-1 border-accent-border/30 bg-bg-secondary/80",
            )}
          >
            <p className="mb-1 font-mono text-[9px] uppercase text-text-muted">
              {msg.role === "user" ? "You" : (msg.modelId ?? "AI")}
            </p>
            <div className="prose-chat">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {streaming && (
          <div className="mr-1 rounded-xl border border-accent-border/40 bg-bg-secondary/80 px-3 py-2 text-sm">
            <p className="mb-1 flex items-center gap-1 font-mono text-[9px] uppercase text-accent">
              <Loader2 className="h-3 w-3 animate-spin" />
              Generating…
            </p>
            {streamText && (
              <div className="prose-chat">
                <ReactMarkdown>{streamText}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* spacer so last message clears the input bar */}
        <div className="h-1 shrink-0" aria-hidden />
      </div>

      {/* ROW 3 — input always visible */}
      <div className="chat-panel-input border-t border-white/[0.06] bg-bg-primary px-3 py-2">
        {error && (
          <p className="mb-2 rounded-lg border border-error/40 bg-error/10 px-2 py-1 text-xs text-error">
            {error}
          </p>
        )}
        <div className="flex items-end gap-2">
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
            placeholder="Scrivi qui il prompt…"
            rows={1}
            className="max-h-24 min-h-[40px] flex-1 resize-none rounded-lg border border-white/[0.08] bg-bg-surface px-3 py-2 text-sm placeholder:text-text-faint focus:border-accent-border focus:outline-none"
          />
          <button
            type="button"
            disabled={streaming || !input.trim()}
            onClick={() => {
              void runGeneration(input);
              setInput("");
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-bg-primary disabled:opacity-40"
          >
            {streaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}