import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare, ArrowUpRight } from "lucide-react";
import { PageTitle, DemoTag } from "@/components/jarvis/Shell";
import { Button } from "@/components/ui/button";
import { Workspace, Readings, SectionLabel } from "@/components/jarvis/Workspace";

export const Route = createFileRoute("/historico")({
  head: () => ({ meta: [{ title: "Histórico — JARVIS (Protótipo)" }, { name: "description", content: "Conversas demonstrativas anteriores com o JARVIS." }, { property: "og:title", content: "Histórico — JARVIS" }, { property: "og:description", content: "Conversas demonstrativas anteriores com o JARVIS." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Historico,
});

const convos = [
  { id: 1, title: "Planejamento da semana", date: "Hoje · 19:40", engine: "Gemini", msgs: [["user", "O que tenho de mais importante esta semana?"], ["jarvis", "Três prioridades: finalizar o roteiro do episódio 3, revisar o módulo de voz e organizar suas notas."], ["user", "Coloque o roteiro primeiro."], ["jarvis", "Feito. Reorganizei a lista com o roteiro no topo."]] },
  { id: 2, title: "Ideias para o Protocolo IA Dominante", date: "Ontem · 22:15", engine: "Qwen", msgs: [["user", "Sugira três temas para o próximo episódio."], ["jarvis", "1) Agentes autônomos no dia a dia; 2) Modelos locais vs. nuvem; 3) Ética na automação pessoal."]] },
  { id: 3, title: "Arquitetura do JARVIS", date: "10 nov · 15:02", engine: "Gemini", msgs: [["user", "Como devo separar os módulos de voz e memória?"], ["jarvis", "Sugiro um barramento de eventos central, com voz e memória como serviços independentes."]] },
] as const;

function Historico(){
 const [sel,setSel]=useState(1);
 const c=convos.find(x=>x.id===sel)??convos[0];
 return <Workspace>
  <PageTitle kicker="05 / Registros" title="Histórico"><DemoTag>Conversas fictícias</DemoTag></PageTitle>
  <Readings items={[{label:"Sessões",value:"03"},{label:"Mensagens",value:convos.reduce((s,c)=>s+c.msgs.length,0)},{label:"Motores",value:"02",tone:"violet"},{label:"Origem",value:"DEMO",tone:"warn"}]} />
  <div className="grid gap-8 xl:grid-cols-[290px_minmax(0,1fr)]">
   <section><SectionLabel code="H / 01">Linha do tempo</SectionLabel><ol className="ml-2 border-l border-border">{convos.map(x=><li key={x.id} className="relative pb-3 pl-5"><span className={`absolute -left-1 top-5 h-2 w-2 rounded-full ${sel===x.id ? "bg-primary" : "bg-muted-foreground/40"}`}/><Button variant={sel===x.id ? "console" : "ghost"} onClick={()=>setSel(x.id)} aria-pressed={sel===x.id} className="h-auto w-full justify-start whitespace-normal rounded-sm p-4 text-left"><div className="min-w-0 flex-1"><div className="micro mb-2">{x.date}</div><div className="text-sm font-normal leading-relaxed">{x.title}</div><div className="mt-3 flex items-center justify-between"><span className="font-mono text-[0.6rem] text-muted-foreground">{x.engine} · {x.msgs.length} msgs</span><ArrowUpRight className="h-3 w-3"/></div></div></Button></li>)}</ol></section>
   <section className="min-w-0 border-t border-border xl:border-l xl:border-t-0 xl:pl-8">
    <div className="flex items-start gap-4 border-b border-border py-5"><MessageSquare className="mt-1 h-5 w-5 shrink-0 text-primary" strokeWidth={1.3}/><div><div className="micro mb-2">Sessão / 00{c.id} · {c.engine}</div><h2 className="text-xl font-light">{c.title}</h2></div></div>
    <div key={c.id} className="space-y-8 py-8 rise">{c.msgs.map(([who,t],i)=><div key={i} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 sm:grid-cols-[4.5rem_minmax(0,1fr)]"><div className="pt-1"><div className={`font-mono text-[0.6rem] uppercase ${who==="jarvis" ? "text-primary" : "text-muted-foreground"}`}>{who==="user" ? "Você" : "JARVIS"}</div><div className="mt-2 font-mono text-[0.55rem] text-muted-foreground">0{i+1}</div></div><p className={`border-l pl-4 text-sm leading-loose ${who==="jarvis" ? "border-primary/40" : "border-border text-muted-foreground"}`}>{t}</p></div>)}</div>
    <div className="micro border-t border-border py-4">Fim do registro · simulação</div>
   </section>
  </div>
 </Workspace>;
}
