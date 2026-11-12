import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, Pencil, RotateCcw } from "lucide-react";
import { useJarvis, type Memory } from "@/lib/jarvis-store";
import { PageTitle, DemoTag } from "@/components/jarvis/Shell";

export const Route = createFileRoute("/memoria")({
  head: () => ({ meta: [{ title: "Memória — JARVIS (Protótipo)" }, { name: "description", content: "Memórias sugeridas pelo JARVIS para aprovar, editar ou rejeitar (demonstração)." }, { property: "og:title", content: "Memória — JARVIS" }, { property: "og:description", content: "Memórias sugeridas pelo JARVIS para aprovar, editar ou rejeitar (demonstração)." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Memoria,
});

const badge: Record<Memory["status"], string> = { pendente: "text-warn border-warn/40", aprovada: "text-ok border-ok/40", rejeitada: "text-destructive border-destructive/40" };

function Memoria() {
  const { memories, setMemories, log } = useJarvis();
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const set = (id: number, patch: Partial<Memory>) => setMemories((m) => m.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  return (
    <>
      <PageTitle kicker="Contexto pessoal" title="Memória"><DemoTag>Memórias fictícias</DemoTag></PageTitle>
      <div className="grid gap-4">
        {memories.map((m) => (
          <div key={m.id} className={`glass flex flex-col gap-4 p-5 transition sm:flex-row sm:items-center rise ${m.status === "rejeitada" ? "opacity-50" : ""}`}>
            <div className="flex-1">
              {editing === m.id ? (
                <textarea autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} className="w-full resize-none rounded-md bg-secondary/50 p-2 text-sm outline-none ring-1 ring-primary/40" />
              ) : <p className="text-sm">{m.text}</p>}
              <span className={`mt-2 inline-block rounded border px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest ${badge[m.status]}`}>{m.status}</span>
            </div>
            <div className="flex gap-2">
              {editing === m.id ? (
                <>
                  <button onClick={() => { set(m.id, { text: draft }); setEditing(null); log("Memória editada"); }} className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground">Salvar</button>
                  <button onClick={() => setEditing(null)} className="rounded-md border border-border px-3 py-1.5 text-xs">Cancelar</button>
                </>
              ) : m.status === "pendente" ? (
                <>
                  <button onClick={() => { set(m.id, { status: "aprovada" }); log("Memória aprovada"); }} className="flex items-center gap-1 rounded-md border border-ok/40 px-3 py-1.5 text-xs text-ok hover:bg-ok/10"><Check className="h-3.5 w-3.5" />Aprovar</button>
                  <button onClick={() => { setEditing(m.id); setDraft(m.text); }} className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary"><Pencil className="h-3.5 w-3.5" />Editar</button>
                  <button onClick={() => { set(m.id, { status: "rejeitada" }); log("Memória rejeitada"); }} className="flex items-center gap-1 rounded-md border border-destructive/40 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"><X className="h-3.5 w-3.5" />Rejeitar</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setEditing(m.id); setDraft(m.text); }} className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary"><Pencil className="h-3.5 w-3.5" />Editar</button>
                  <button onClick={() => set(m.id, { status: "pendente" })} className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"><RotateCcw className="h-3.5 w-3.5" />Desfazer</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
