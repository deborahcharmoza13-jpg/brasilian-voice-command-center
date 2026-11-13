import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Plus, Trash2, Pencil } from "lucide-react";
import { useJarvis } from "@/lib/jarvis-store";
import { PageTitle, DemoTag } from "@/components/jarvis/Shell";
import { Button } from "@/components/ui/button";
import { Workspace, Readings, SectionLabel } from "@/components/jarvis/Workspace";

export const Route = createFileRoute("/tarefas")({
  head: () => ({ meta: [{ title: "Tarefas — JARVIS (Protótipo)" }, { name: "description", content: "Lista de tarefas demonstrativa do JARVIS, editável localmente." }, { property: "og:title", content: "Tarefas — JARVIS" }, { property: "og:description", content: "Lista de tarefas demonstrativa do JARVIS, editável localmente." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Tarefas,
});

function Tarefas() {
  const { tasks, setTasks, log } = useJarvis();
  const [title,setTitle]=useState("");
  const [editing,setEditing]=useState<number|null>(null);
  const [filter,setFilter]=useState<"todas"|"abertas"|"concluídas">("todas");
  const shown=tasks.filter(t=>filter==="todas"||(filter==="abertas" ? !t.done : t.done));
  return <Workspace>
    <PageTitle kicker="03 / Execução" title="Tarefas"><DemoTag>Salvo só nesta sessão</DemoTag></PageTitle>
    <Readings items={[{label:"Na fila",value:tasks.filter(t=>!t.done).length},{label:"Alta prioridade",value:tasks.filter(t=>!t.done&&t.priority==="alta").length,tone:"violet"},{label:"Concluídas",value:tasks.filter(t=>t.done).length,tone:"ok"},{label:"Execução",value:`${tasks.length ? Math.round(tasks.filter(t=>t.done).length/tasks.length*100) : 0}%`}]} />
    <form className="flex items-center gap-3 border-b border-primary/40 bg-primary/5 p-3 sm:p-4" onSubmit={e=>{e.preventDefault();if(!title.trim())return;setTasks(t=>[{id:Date.now(),title:title.trim(),done:false,tag:"Nova",priority:"média"},...t]);log("Tarefa adicionada");setTitle("");}}>
      <span className="font-mono text-primary">&gt;</span><input aria-label="Nova tarefa" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Nova tarefa…" className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"/><Button size="sm" variant="console" type="submit" disabled={!title.trim()}><Plus/><span className="hidden sm:inline">Adicionar</span><span className="sr-only sm:hidden">Adicionar</span></Button>
    </form>
    <div className="flex flex-wrap items-center justify-between gap-4"><SectionLabel code="T / 01">Fila de execução</SectionLabel><div className="flex gap-1" role="group" aria-label="Filtrar tarefas">{(["todas","abertas","concluídas"] as const).map(f=><Button key={f} size="sm" variant={filter===f ? "console" : "tool"} aria-pressed={filter===f} onClick={()=>setFilter(f)} className="capitalize">{f}</Button>)}</div></div>
    <ul className="divide-y divide-border border-y border-border">
      {shown.map((t,i)=><li key={t.id} className="group flex items-start gap-3 py-5 sm:items-center sm:gap-5 rise">
        <span className="hidden w-6 font-mono text-xs text-muted-foreground sm:block">{String(i+1).padStart(2,"0")}</span>
        <Button size="icon" variant="tool" aria-label={t.done ? "Reabrir" : "Concluir"} onClick={()=>{setTasks(xs=>xs.map(x=>x.id===t.id ? {...x,done:!x.done} : x));if(!t.done)log(`Tarefa concluída: ${t.title}`);}} className={`h-7 w-7 shrink-0 rounded-full ${t.done ? "border-ok/40 bg-ok/10 text-ok" : ""}`}>{t.done&&<Check/>}</Button>
        <div className="min-w-0 flex-1">{editing===t.id ? <input aria-label="Editar tarefa" autoFocus defaultValue={t.title} onBlur={e=>{const v=e.target.value.trim();if(v)setTasks(xs=>xs.map(x=>x.id===t.id ? {...x,title:v} : x));setEditing(null);}} onKeyDown={e=>{if(e.key==="Enter")e.currentTarget.blur();}} className="w-full rounded-sm bg-secondary/50 px-2 py-1 text-sm outline-none ring-1 ring-primary/40"/> : <span onDoubleClick={()=>setEditing(t.id)} className={`block break-words text-sm leading-relaxed ${t.done ? "text-muted-foreground line-through" : ""}`}>{t.title}</span>}
          <div className="mt-2 flex items-center gap-3"><span className="micro">{t.tag}</span><span className={`flex items-center gap-1.5 font-mono text-[0.6rem] ${t.priority==="alta" ? "text-violet" : t.priority==="média" ? "text-warn" : "text-muted-foreground"}`}><span className="h-1 w-1 rounded-full bg-current"/>{t.priority}</span></div>
        </div>
        <div className="flex shrink-0 gap-1"><Button size="icon" variant="ghost" title="Editar tarefa" aria-label="Editar" onClick={()=>setEditing(t.id)} className="h-8 w-8 text-muted-foreground"><Pencil/></Button><Button size="icon" variant="ghost" title="Excluir tarefa" aria-label="Excluir" onClick={()=>setTasks(xs=>xs.filter(x=>x.id!==t.id))} className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2/></Button></div>
      </li>)}
      {shown.length===0&&<li className="py-12 text-center font-mono text-xs text-muted-foreground">Nenhuma tarefa nesta fila.</li>}
    </ul>
  </Workspace>;
}
