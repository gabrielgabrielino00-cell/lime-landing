"use client";

import { useState } from "react";
import { Check, ChevronDown, Lock } from "lucide-react";
import { AI_MODELS, type ModelId, type ModelProvider } from "@/types/models";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/cn";

const providerColors: Record<ModelProvider, string> = {
  anthropic: "bg-violet-500/20 text-violet-300",
  openai: "bg-emerald-500/20 text-emerald-300",
  google: "bg-sky-500/20 text-sky-300",
  local: "bg-zinc-500/20 text-zinc-300",
};

export default function ModelSwitcher() {
  const [open, setOpen] = useState(false);
  const selectedModelId = useAppStore((s) => s.selectedModelId);
  const setModel = useAppStore((s) => s.setModel);
  const plan = useAppStore((s) => s.user.plan);
  const selected = AI_MODELS.find((m) => m.id === selectedModelId)!;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md border border-bg-elevated bg-bg-surface px-3 py-2 text-left text-sm transition-colors hover:border-accent-border"
      >
        <span>
          <span className="font-medium text-text-primary">{selected.name}</span>
          <span className="ml-2 font-mono text-[10px] text-text-muted">
            ~{selected.latencyMs}ms
          </span>
        </span>
        <ChevronDown className={cn("h-4 w-4 text-text-muted transition", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-bg-elevated bg-bg-secondary shadow-xl">
          <p className="border-b border-bg-elevated px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-text-muted">
            AI Model
          </p>
          {AI_MODELS.map((model) => {
            const locked = model.requiresPro && plan === "free";
            return (
              <button
                key={model.id}
                type="button"
                disabled={locked}
                onClick={() => {
                  if (locked) return;
                  setModel(model.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-bg-elevated/60 px-3 py-3 text-left last:border-0",
                  locked ? "cursor-not-allowed opacity-50" : "hover:bg-bg-surface",
                  model.id === selectedModelId && "bg-accent-dim",
                )}
              >
                <span className="mt-1 flex h-4 w-4 items-center justify-center">
                  {model.id === selectedModelId ? (
                    <Check className="h-3.5 w-3.5 text-accent" />
                  ) : (
                    <span className="h-2 w-2 rounded-full border border-text-faint" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{model.name}</span>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 font-mono text-[9px] uppercase",
                        providerColors[model.provider],
                      )}
                    >
                      {model.provider}
                    </span>
                    {locked && <Lock className="h-3 w-3 text-warning" />}
                  </span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    {model.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-bg-elevated px-1.5 py-0.5 font-mono text-[9px] text-text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                  <span className="mt-1 block text-xs text-text-muted">
                    {model.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}