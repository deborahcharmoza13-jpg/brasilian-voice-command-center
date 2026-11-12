import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageTitle, DemoTag } from "@/components/jarvis/Shell";

export const Route = createFileRoute("/historico")({
  head: () => ({ meta: [{ title: "Histórico — JARVIS (Protótipo)" }, { name: "description", content: "Conversas demonstrativas anteriores com o JARVIS." }, { property: "og:title", content: "Histórico — JARVIS" }, { property: "og:description", content: "Conversas demonstrativas anteriores com o JARVIS." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Historico,
});

const convos = [
  { id: 1, title: "Planejamento da semana", date: "Hoje · 19:40", engine: "Gemini", msgs: [["user", "O que tenho de mais importante esta semana?"], ["jarvis", "Três prioridades: finalizar o roteiro do episódio 3, revisar o módulo de voz e organizar suas notas."], ["user", "Coloque o roteiro primeiro."], ["jarvis", "Feito. Reorganizei a lista com o roteiro no topo."]] },
  { id: 2, title: "Ideias para o Protocolo IA Dominante", date: "Ontem · 22:15", engine: "Qwen", msgs: [["user", "Sugira três temas para o próximo episódio."], ["jarvis", "1) Agentes autônomos no dia a dia; 2) Modelos locais vs. nuvem; 3) Ética na automação pessoal."]] },
  { id: 3, title: "Arquitetura do JARVIS", date: "10 nov · 15:02", engine: "Gemini", msgs: [["user", "Como devo separar os módulos de voz e memória?"], ["jarvis", "Sugiro um barramento de eventos central, com voz e memória como serviços independentes."]] },
] as const;

function Historico() {
  const [sel, setSel] = useState<number>(1);
  const c = convos.find((x) => x.id === sel)!;
  return (
    <>
      <PageTitle kicker="Registros" title="Histórico"><DemoTag>Conversas fictícias</DemoTag></PageTitle>
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <ul className="space-y-1.5">
          {convos.map((x) => (
            <li key={x.id}><button onClick={() => setSel(x.id)} className={`w-full rounded-lg border px-4 py-3 text-left transition ${sel === x.id ? "border-primary/40 bg-primary/10" : "border-transparent hover:bg-secondary/40"}`}>
              <div className="text-sm">{x.title}</div><div className="mt-1 font-mono text-[0.65rem] text-muted-foreground">{x.date} · {x.engine}</div>
            </button></li>
          ))}
        </ul>
        <div key={c.id} className="glass space-y-4 p-6 rise">
          <div className="hud-label border-b border-border pb-3">{c.title} · {c.engine}</div>
          {c.msgs.map(([who, t], i) => (
            <div key={i} className={`flex ${who === "user" ? "justify-end" : ""}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${who === "user" ? "bg-primary/15" : "border border-border bg-secondary/40"}`}>
                <div className="hud-label mb-1 !text-[0.55rem]">{who === "user" ? "Você" : "JARVIS"}</div>{t}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
