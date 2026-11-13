import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, Pencil, RotateCcw, FileText, Save } from "lucide-react";
import { useJarvis, type Memory } from "@/lib/jarvis-store";
import { PageTitle, DemoTag } from "@/components/jarvis/Shell";
import { Button } from "@/components/ui/button";
import { Workspace, Readings, SectionLabel } from "@/components/jarvis/Workspace";

export const Route = createFileRoute("/memoria")({
  head: () => ({ meta: [{ title: "Memória — JARVIS (Protótipo)" }, { name: "description", content: "Memórias sugeridas pelo JARVIS para aprovar, editar ou rejeitar (demonstração)." }, { property: "og:title", content: "Memória — JARVIS" }, { property: "og:description", content: "Memórias sugeridas pelo JARVIS para aprovar, editar ou rejeitar (demonstração)." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Memoria,
});

const badge: Record<Memory["status"],string>={pendente:"text-warn border-warn/30",aprovada:"text-ok border-ok/30",rejeitada:"text-destructive border-destructive/30"};
function Memoria(){
 const {memories,setMemories,log}=useJarvis();
 const [editing,setEditing]=useState<number|null>(null);
 const [draft,setDraft]=useState("");
 const set=(id:number,patch:Partial<Memory>)=>setMemories(m=>m.map(x=>x.id===id ? {...x,...patch} : x));
 return <Workspace>
  <PageTitle kicker="04 / Contexto pessoal" title="Memória"><DemoTag>Memórias fictícias</DemoTag></PageTitle>
  <Readings items={[{label:"Registros",value:memories.length},{label:"Aguardando revisão",value:memories.filter(m=>m.status==="pendente").length,tone:"warn"},{label:"Aprovados",value:memories.filter(m=>m.status==="aprovada").length,tone:"ok"},{label:"Armazenamento",value:"SESSÃO"}]} />
  <SectionLabel code="M / 01" detail="Arquivo de conhecimento">Registros de contexto</SectionLabel>
  <div className="grid gap-x-8 lg:grid-cols-2">{memories.map(m=><article key={m.id} className={`relative border-b border-border py-6 rise ${m.status==="rejeitada" ? "opacity-60" : ""}`}>
    <div className="mb-5 flex items-center gap-3"><FileText className="h-4 w-4 text-primary" strokeWidth={1.3}/><span className="micro">MEM / {String(m.id).padStart(3,"0")}</span><span className={`ml-auto border px-2 py-1 font-mono text-[0.6rem] uppercase ${badge[m.status]}`}>{m.status}</span></div>
    {editing===m.id ? <textarea aria-label="Editar memória" autoFocus value={draft} onChange={e=>setDraft(e.target.value)} rows={3} className="w-full resize-none rounded-sm bg-secondary/40 p-3 text-sm outline-none ring-1 ring-primary/40"/> : <p className="min-h-16 border-l border-primary/30 pl-4 text-base font-light leading-relaxed">{m.text}</p>}
    <div className="mt-5 flex flex-wrap gap-2">{editing===m.id ? <><Button size="sm" variant="console" onClick={()=>{set(m.id,{text:draft});setEditing(null);log("Memória editada");}}><Save/>Salvar</Button><Button size="sm" variant="tool" onClick={()=>setEditing(null)}>Cancelar</Button></> : <>
      {m.status==="pendente"&&<Button size="sm" variant="tool" className="border-ok/30 text-ok hover:bg-ok/10 hover:text-ok" onClick={()=>{set(m.id,{status:"aprovada"});log("Memória aprovada");}}><Check/>Aprovar</Button>}
      <Button size="sm" variant="tool" onClick={()=>{setEditing(m.id);setDraft(m.text);}}><Pencil/>Editar</Button>
      {m.status==="pendente" ? <Button size="icon" variant="tool" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" title="Rejeitar memória" aria-label="Rejeitar" onClick={()=>{set(m.id,{status:"rejeitada"});log("Memória rejeitada");}}><X/></Button> : <Button size="sm" variant="tool" onClick={()=>set(m.id,{status:"pendente"})}><RotateCcw/>Desfazer</Button>}
    </>}</div>
  </article>)}</div>
 </Workspace>;
}
