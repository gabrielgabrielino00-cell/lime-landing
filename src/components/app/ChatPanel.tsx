"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, RotateCcw, Send } from "lucide-react";
import ModelSwitcher from "@/components/app/ModelSwitcher";
import { extractCodeBlock } from "@/lib/mock-ai";
import { useActiveProject, useAppStore } from "@/lib/store";
import { cn } from "@/lib/cn";

export default function ChatPanel() {
  const project = useActiveProject();
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const selectedModelId = useAppStore((s) => s.selectedModelId);
  const user = useAppStore((s) => s.user);
  const addMessage = useAppStore((s) => s.addMessage);
  const setOutput = useAppStore((s) => s.setOutput);
  const incrementRequests = useAppStore((s) => s.incrementRequests);

  if (!project) return null;

  async function runGeneration(prompt: string) {
    if (!project || !prompt.trim() || streaming) return;

    setError(null);
    if (!incrementRequests()) {
      setError("Monthly request limit reached. Upgrade to Pro.");
      return;
    }

    addMessage(project.id, "user", prompt);
    setInput("");
    setStreaming(true);
    setStreamText("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          modelId: selectedModelId,
          plan: user.plan,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Generation failed.");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = "";

      if (!reader) throw new Error("No stream available.");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payload) as { text?: string; error?: string };
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) {
              full += parsed.text;
              setStreamText(full);
            }
          } catch {
            /* skip malformed */
          }
        }
      }

      addMessage(project.id, "assistant", full, selectedModelId);
      const code = extractCodeBlock(full);
      setOutput(project.id, full, code, prompt, selectedModelId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error.");
    } finally {
      setStreaming(false);
      setStreamText("");
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  const tokenEstimate = [...project.messages, { content: streamText }]
    .map((m) => Math.ceil(("content" in m ? m.content : "").length / 4))
    .reduce((a, b) => a + b, 0);

  return (
    <div className="flex h-full flex-col border-x border-bg-elevated bg-bg-primary">
      <div className="border-b border-bg-elevated p-3">
        <ModelSwitcher />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {project.messages.length === 0 && (
          <p className="text-sm text-text-muted">
            Describe a Roblox feature — LimeForge generates Luau and syncs to
            Studio.
          </p>
        )}

        {project.messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm",
              msg.role === "user"
                ? "border-bg-elevated bg-bg-surface"
                : "border-accent-border/40 bg-bg-secondary",
            )}
          >
            <p className="mb-1 font-mono text-[10px] uppercase text-text-muted">
              {msg.role === "user" ? "You" : msg.modelId ?? "AI"}
            </p>
            <div className="prose prose-invert prose-sm max-w-none text-text-primary">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {streaming && streamText && (
          <div className="rounded-lg border border-accent-border/40 bg-bg-secondary px-3 py-2 text-sm">
            <p className="mb-1 font-mono text-[10px] uppercase text-accent">
              Streaming…
            </p>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{streamText}</ReactMarkdown>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="mx-4 mb-2 rounded-md border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
          {error}
        </div>
      )}

      <div className="border-t border-bg-elevated p-3">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void runGeneration(input);
              }
            }}
            placeholder="Create a coin leaderstat system for my obby…"
            rows={2}
            className="flex-1 resize-none rounded-md border border-bg-elevated bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-faint focus:border-accent-border focus:outline-none"
          />
          <button
            type="button"
            disabled={streaming || !input.trim()}
            onClick={() => void runGeneration(input)}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-bg-primary transition hover:bg-accent-soft disabled:opacity-40"
          >
            {streaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-text-muted">
          <span>
            {user.requestsUsed}/{user.requestsLimit} requests
          </span>
          <span>~{tokenEstimate} tokens</span>
        </div>
        {project.messages.some((m) => m.role === "assistant") && (
          <button
            type="button"
            className="mt-2 flex items-center gap-1 text-xs text-text-muted hover:text-accent"
            onClick={() => {
              const lastUser = [...project.messages].reverse().find((m) => m.role === "user");
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