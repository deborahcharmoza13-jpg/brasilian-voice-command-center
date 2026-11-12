import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Pause, Plus } from "lucide-react";
import { useJarvis } from "@/lib/jarvis-store";
import { PageTitle, DemoTag } from "@/components/jarvis/Shell";

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
  const update = (id: number, f: (p: (typeof initial)[0]) => Partial<(typeof initial)[0]>) => setItems((xs) => xs.map((p) => (p.id === id ? { ...p, ...f(p) } : p)));
  return (
    <>
      <PageTitle kicker="Operações" title="Projetos"><DemoTag>Progresso fictício</DemoTag></PageTitle>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((p) => {
          const stage = Math.min(3, Math.floor(p.progress / 25));
          return (
            <article key={p.id} className="glass group p-6 transition hover:border-primary/30 rise">
              <div className="flex items-start justify-between gap-4">
                <div><h2 className="text-lg font-medium">{p.name}</h2><p className="mt-1 text-sm text-muted-foreground">{p.desc}</p></div>
                <span className={`flex items-center gap-1.5 text-xs ${p.active ? "text-ok" : "text-muted-foreground"}`}><span className={`h-1.5 w-1.5 rounded-full ${p.active ? "bg-ok" : "bg-muted-foreground"}`} />{p.active ? "Ativo" : "Pausado"}</span>
              </div>
              <div className="mt-6 flex items-end justify-between"><span className="hud-label">Progresso</span><span className="font-mono text-3xl font-light text-primary glow-text">{p.progress}%</span></div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-primary shadow-[0_0_12px_var(--color-glow)] transition-all duration-700" style={{ width: `${p.progress}%` }} /></div>
              <div className="mt-5 grid grid-cols-4 gap-2">
                {p.steps.map((s, i) => <div key={s} className={`border-t-2 pt-2 text-xs ${i <= stage ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}>{s}</div>)}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <button onClick={() => { update(p.id, (x) => ({ progress: Math.min(100, x.progress + 5) })); log(`Progresso de ${p.name} avançado`); }} className="flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-primary hover:bg-primary/20"><Plus className="h-3.5 w-3.5" />Avançar 5%</button>
                <button onClick={() => { update(p.id, (x) => ({ active: !x.active })); log(`${p.name} ${p.active ? "pausado" : "retomado"}`); }} className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">{p.active ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}{p.active ? "Pausar" : "Retomar"}</button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
