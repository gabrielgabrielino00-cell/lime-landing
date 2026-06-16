"use client";

import dynamic from "next/dynamic";

const Monaco = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center font-mono text-xs text-text-muted">
      Loading editor…
    </div>
  ),
});

export default function CodeEditor({
  value,
  onChange,
  readOnly = true,
  language = "lua",
}: {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  language?: string;
}) {
  return (
    <Monaco
      height="100%"
      language={language}
      value={value}
      theme="vs-dark"
      onChange={(v) => onChange?.(v ?? "")}
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: "JetBrains Mono, monospace",
        scrollBeyondLastLine: false,
        padding: { top: 12 },
        lineNumbers: "on",
        renderLineHighlight: "line",
      }}
    />
  );
}