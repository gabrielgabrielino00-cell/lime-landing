"use client";

import { useState } from "react";
import { Copy, Download, GitCompare, RefreshCw } from "lucide-react";
import { useActiveProject, useAppStore } from "@/lib/store";
import { cn } from "@/lib/cn";

export default function OutputPanel() {
  const project = useActiveProject();
  const [activeFile, setActiveFile] = useState(0);
  const [showDiff, setShowDiff] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!project) return null;

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
        <div className="flex gap-1">
          <ToolBtn icon={Copy} label={copied ? "Copied" : "Copy"} onClick={() => void copyCode()} />
          <ToolBtn icon={Download} label="Download" onClick={downloadFile} />
          <ToolBtn icon={RefreshCw} label="Sync Studio" onClick={() => alert("Roblox Studio plugin sync (local demo).")} />
          <ToolBtn
            icon={GitCompare}
            label="Diff"
            onClick={() => setShowDiff((v) => !v)}
            active={showDiff}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        {showDiff && prevVersion ? (
          <div className="space-y-2 font-mono text-xs">
            <p className="text-text-muted">Diff vs {prevVersion.label}</p>
            <pre className="rounded-md border border-bg-elevated bg-bg-primary p-3 text-success">
              {`+ ${file.content.split("\n").slice(0, 3).join("\n+ ")}`}
            </pre>
          </div>
        ) : (
          <pre className="h-full rounded-md border border-bg-elevated bg-bg-primary p-4 font-mono text-xs leading-relaxed text-text-primary">
            <code>{file.content}</code>
          </pre>
        )}
      </div>

      {project.versions.length > 0 && (
        <div className="max-h-36 overflow-y-auto border-t border-bg-elevated p-3">
          <p className="mb-2 font-mono text-[10px] uppercase text-text-muted">Versions</p>
          <ul className="space-y-1">
            {project.versions.map((v) => (
              <li key={v.id}>
                <button
                  type="button"
                  className="w-full rounded px-2 py-1 text-left text-xs text-text-muted hover:bg-bg-surface hover:text-text-primary"
                  onClick={() =>
                    useAppStore.setState((s) => ({
                      projects: s.projects.map((p) =>
                        p.id === project.id
                          ? {
                              ...p,
                              files: p.files.map((f, i) =>
                                i === 0 ? { ...f, content: v.outputSnapshot } : f,
                              ),
                            }
                          : p,
                      ),
                    }))
                  }
                >
                  <span className="text-accent">{v.label}</span> · {v.modelId} ·{" "}
                  {new Date(v.createdAt).toLocaleString()}
                </button>
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
        "flex items-center gap-1 rounded px-2 py-1 text-xs text-text-muted hover:bg-bg-surface hover:text-text-primary",
        active && "bg-accent-dim text-accent",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden xl:inline">{label}</span>
    </button>
  );
}