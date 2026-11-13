import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Pause, Plus, Radio, Terminal, AudioLines } from "lucide-react";
import { useJarvis } from "@/lib/jarvis-store";
import { PageTitle, DemoTag } from "@/components/jarvis/Shell";
import { Button } from "@/components/ui/button";
import { Workspace, Readings, SectionLabel } from "@/components/jarvis/Workspace";

export const Route = createFileRoute("/projetos")({
  head: () => ({ meta: [{ title: "Projetos — JARVIS (Protótipo)" }, { name: "description", content: "Projetos acompanhados pelo JARVIS, com progresso demonstrativo." }, { property: "og:title", content: "Projetos — JARVIS" }, { property: "og:description", content: "Projetos acompanhados pelo JARVIS, com progresso demonstrativo." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Projetos,
});

const initial = [
  { id: 1, name: "Protocolo IA Dominante", desc: "Série de conteúdo sobre uso estratégico de IA.", progress: 62, active: true, steps: ["Roteiros", "Gravação", "Edição", "Publicação"] },
  { id: 2, name: "JARVIS", desc: "Assistente pessoal em Python com voz e memória.", progress: 41, active: true, steps: ["Núcleo", "Voz", "Memória", "Interface"] },
];
function Projetos() {
  const { log } = useJarvis();
  const [items, setItems] = useState(initial);
  const update = (id: number, f: (p: (typeof initial)[0]) => Partial<(typeof initial)[0]>) => setItems((xs) => xs.map((p) => p.id === id ? { ...p, ...f(p) } : p));
  return <Workspace>
    <PageTitle kicker="02 / Operações" title="Projetos"><DemoTag>Progresso fictício</DemoTag></PageTitle>
    <Readings items={[{label:"Em operação",value:items.filter(p=>p.active).length,tone:"ok"},{label:"Portfólio",value:"02"},{label:"Progresso médio",value:`${Math.round(items.reduce((s,p)=>s+p.progress,0)/items.length)}%`},{label:"Ambiente",value:"DEMO",tone:"warn"}]} />
    <SectionLabel code="P / 01" detail="Acompanhamento simulado">Missões em andamento</SectionLabel>
    <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
      {items.map((p,idx) => <article key={p.id} className="panel brackets overflow-hidden rounded-md rise lift">
        <div className={`mission-visual ${idx === 0 ? "mission-signal" : "mission-code"}`} aria-hidden="true">
          <div className="absolute left-5 top-4 micro">OP / 0{p.id}</div>
          {idx === 0 ? <AudioLines className="h-20 w-20 text-violet" strokeWidth={0.8}/> : <Terminal className="h-20 w-20 text-primary" strokeWidth={0.8}/>}
          <div className="absolute bottom-4 right-5 micro">{idx === 0 ? "Content intelligence" : "Personal intelligence"}</div>
        </div>
        <div className="p-5 sm:p-7">
          <div className="mb-4 flex items-center justify-between"><span className="micro">Projeto 0{p.id}</span><span className={`flex items-center gap-2 font-mono text-xs ${p.active ? "text-ok" : "text-muted-foreground"}`}><Radio className="h-3 w-3" />{p.active ? "Ativo" : "Pausado"}</span></div>
          <h2 className="text-xl font-light">{p.name}</h2><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
          <div className="mb-3 mt-8 flex items-end justify-between"><span className="micro">Progresso</span><span className="font-mono text-4xl font-light text-primary">{p.progress}<span className="text-base text-muted-foreground">%</span></span></div>
          <div className="h-1 bg-secondary"><div className="h-full bg-primary transition-all duration-700" style={{width:`${p.progress}%`}} /></div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">{p.steps.map((s,i)=><div key={s} className={`border-t pt-3 ${i<=Math.min(3,Math.floor(p.progress/25)) ? "border-primary/50 text-foreground" : "border-border text-muted-foreground"}`}><div className="mb-1 font-mono text-[0.6rem] text-muted-foreground">0{i+1}</div><div className="text-xs">{s}</div></div>)}</div>
          <div className="mt-7 flex flex-wrap gap-2 border-t border-border pt-5"><Button size="sm" variant="console" onClick={()=>{update(p.id,x=>({progress:Math.min(100,x.progress+5)}));log(`Progresso de ${p.name} avançado`);}}><Plus/>Avançar 5%</Button><Button size="sm" variant="tool" onClick={()=>{update(p.id,x=>({active:!x.active}));log(`${p.name} ${p.active ? "pausado" : "retomado"}`);}}>{p.active ? <Pause/> : <Play/>}{p.active ? "Pausar" : "Retomar"}</Button></div>
        </div>
      </article>)}
    </div>
  </Workspace>;
}
