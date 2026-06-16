"use client";

import { useState } from "react";
import { Copy, Download, GitCompare, RefreshCw } from "lucide-react";
import CodeEditor from "@/components/app/CodeEditor";
import { getStoredApiKey } from "@/lib/api-key-storage";
import type { LocalProject } from "@/lib/local-db";
import { cn } from "@/lib/cn";

export default function OutputPanel({
  project,
  onSaveFile,
}: {
  project: LocalProject;
  onSaveFile: (content: string) => Promise<void>;
}) {
  const [activeFile, setActiveFile] = useState(0);
  const [showDiff, setShowDiff] = useState(false);
  const [editable, setEditable] = useState(false);
  const [copied, setCopied] = useState(false);

  const file = project.files[activeFile];
  const prevVersion = project.versions[1];

  async function copyCode() {
    await navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function downloadFile() {
    const blob = new Blob([file.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function syncStudio() {
    const apiKey = getStoredApiKey();
    if (!apiKey) {
      alert("Generate an API key in Settings (Pro) for Studio sync.");
      return;
    }
    const res = await fetch("/api/sync/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-limeforge-key": apiKey,
      },
      body: JSON.stringify({
        projectId: project.id,
        files: project.files,
      }),
    });
    if (res.ok) {
      alert("Sync queued. Open Roblox Studio and click LimeForge → Sync.");
    } else {
      alert("Generate an API key in Settings (Pro) for Studio sync.");
    }
  }

  return (
    <div className="flex h-full flex-col bg-bg-secondary">
      <div className="flex items-center justify-between border-b border-bg-elevated px-3 py-2">
        <div className="flex gap-1">
          {project.files.map((f, i) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFile(i)}
              className={cn(
                "rounded px-2 py-1 font-mono text-xs",
                i === activeFile
                  ? "bg-accent-dim text-accent"
                  : "text-text-muted hover:text-text-primary",
              )}
            >
              {f.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEditable((v) => !v)}
            className="rounded px-2 py-1 text-xs text-text-muted hover:text-accent"
          >
            {editable ? "Lock" : "Edit"}
          </button>
          <ToolBtn icon={Copy} label={copied ? "Copied" : "Copy"} onClick={() => void copyCode()} />
          <ToolBtn icon={Download} label="Download" onClick={downloadFile} />
          <ToolBtn icon={RefreshCw} label="Sync" onClick={() => void syncStudio()} />
          <ToolBtn
            icon={GitCompare}
            label="Diff"
            onClick={() => setShowDiff((v) => !v)}
            active={showDiff}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {showDiff && prevVersion ? (
          <pre className="h-full overflow-auto p-4 font-mono text-xs text-success">
            {`--- ${prevVersion.label}\n+++ current\n+ ${file.content.split("\n").join("\n+ ")}`}
          </pre>
        ) : (
          <CodeEditor
            value={file.content}
            readOnly={!editable}
            language="lua"
            onChange={(v) => void onSaveFile(v)}
          />
        )}
      </div>

      {project.versions.length > 0 && (
        <div className="max-h-32 overflow-y-auto border-t border-bg-elevated p-3">
          <p className="mb-2 font-mono text-[10px] uppercase text-text-muted">Versions</p>
          <ul className="space-y-1">
            {project.versions.map((v) => (
              <li key={v.id} className="font-mono text-[10px] text-text-muted">
                <span className="text-accent">{v.label}</span> · {v.modelId}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ToolBtn({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={cn(
        "rounded px-2 py-1 text-xs text-text-muted hover:bg-bg-surface hover:text-text-primary",
        active && "bg-accent-dim text-accent",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}