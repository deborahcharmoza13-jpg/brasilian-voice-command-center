import type { ReactNode } from "react";

export function Workspace({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[1400px] space-y-8">{children}</div>;
}

export function Readings({ items }: { items: { label: string; value: string | number; tone?: "primary" | "ok" | "warn" | "violet" }[] }) {
  const tones = { primary: "text-primary", ok: "text-ok", warn: "text-warn", violet: "text-violet" };
  return (
    <div className="grid grid-cols-2 gap-y-5 border-y border-border py-5 sm:grid-cols-4">
      {items.map((item, i) => <div key={item.label} className={`px-4 sm:px-6 ${i % 2 ? "border-l border-border" : ""} ${i > 0 ? "sm:border-l" : ""}`}>
        <div className="micro">{item.label}</div>
        <div className={`mt-2 font-mono text-2xl font-light tabular-nums ${tones[item.tone ?? "primary"]}`}>{item.value}</div>
      </div>)}
    </div>
  );
}

export function SectionLabel({ code, children, detail }: { code: string; children: ReactNode; detail?: ReactNode }) {
  return <div className="mb-5 flex flex-wrap items-center gap-3"><span className="font-mono text-xs text-primary">{code}</span><h2 className="flex items-center gap-2 text-sm font-normal">{children}</h2><div className="h-px min-w-4 flex-1 bg-border" />{detail && <span className="micro">{detail}</span>}</div>;
}