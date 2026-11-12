import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Plus, Trash2, Pencil } from "lucide-react";
import { useJarvis } from "@/lib/jarvis-store";
import { PageTitle, DemoTag } from "@/components/jarvis/Shell";

export const Route = createFileRoute("/tarefas")({
  head: () => ({ meta: [{ title: "Tarefas — JARVIS (Protótipo)" }, { name: "description", content: "Lista de tarefas demonstrativa do JARVIS, editável localmente." }, { property: "og:title", content: "Tarefas — JARVIS" }, { property: "og:description", content: "Lista de tarefas demonstrativa do JARVIS, editável localmente." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Tarefas,
});

function Tarefas() {
  const { tasks, setTasks, log } = useJarvis();
  const [title, setTitle] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [filter, setFilter] = useState<"todas" | "abertas" | "concluídas">("todas");
  const shown = tasks.filter((t) => filter === "todas" || (filter === "abertas" ? !t.done : t.done));
  return (
    <>
      <PageTitle kicker="Execução" title="Tarefas"><DemoTag>Salvo só nesta sessão</DemoTag></PageTitle>
      <form className="glass mb-6 flex items-center gap-2 p-2" onSubmit={(e) => { e.preventDefault(); if (!title.trim()) return; setTasks((t) => [{ id: Date.now(), title: title.trim(), done: false, tag: "Nova", priority: "média" }, ...t]); log("Tarefa adicionada"); setTitle(""); }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nova tarefa…" className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground" />
        <button className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"><Plus className="h-4 w-4" />Adicionar</button>
      </form>
      <div className="mb-4 flex gap-1.5">
        {(["todas", "abertas", "concluídas"] as const).map((f) => <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3 py-1 text-xs capitalize ${filter === f ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{f}</button>)}
      </div>
      <ul className="glass divide-y divide-border">
        {shown.map((t) => (
          <li key={t.id} className="group flex items-center gap-4 px-4 py-3.5 rise">
            <button aria-label="Concluir" onClick={() => { setTasks((xs) => xs.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x))); if (!t.done) log(`Tarefa concluída: ${t.title}`); }}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${t.done ? "border-ok bg-ok/20 text-ok" : "border-muted-foreground hover:border-primary"}`}>{t.done && <Check className="h-3 w-3" />}</button>
            {editing === t.id ? (
              <input autoFocus defaultValue={t.title} onBlur={(e) => { const v = e.target.value.trim(); if (v) setTasks((xs) => xs.map((x) => (x.id === t.id ? { ...x, title: v } : x))); setEditing(null); }} onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()} className="flex-1 rounded bg-secondary/50 px-2 py-1 text-sm outline-none ring-1 ring-primary/40" />
            ) : (
              <span onDoubleClick={() => setEditing(t.id)} className={`flex-1 text-sm transition ${t.done ? "text-muted-foreground line-through" : ""}`}>{t.title}</span>
            )}
            <span className="hidden font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground sm:inline">{t.tag}</span>
            <div className="flex gap-1 opacity-60 transition group-hover:opacity-100">
              <button aria-label="Editar" onClick={() => setEditing(t.id)} className="rounded p-1.5 hover:bg-secondary"><Pencil className="h-3.5 w-3.5" /></button>
              <button aria-label="Excluir" onClick={() => setTasks((xs) => xs.filter((x) => x.id !== t.id))} className="rounded p-1.5 hover:bg-destructive/20 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </li>
        ))}
        {shown.length === 0 && <li className="px-4 py-8 text-center text-sm text-muted-foreground">Nada por aqui.</li>}
      </ul>
    </>
  );
}
