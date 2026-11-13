import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, ArrowUp, Check, ArrowUpRight } from "lucide-react";
import { useJarvis, type CoreState } from "@/lib/jarvis-store";
import { HoloCore, stateLabel } from "@/components/jarvis/Core";
import { DemoTag } from "@/components/jarvis/Shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Central — JARVIS (Protótipo)" }, { name: "description", content: "Central do assistente JARVIS com núcleo holográfico e console de comunicação simulado." }, { property: "og:title", content: "Central — JARVIS" }, { property: "og:description", content: "Núcleo holográfico e console de comunicação simulado." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Central,
});

const order: CoreState[] = ["repouso", "ouvindo", "processando", "falando"];
const latency: Record<CoreState, string> = { repouso: "—", ouvindo: "38 ms", processando: "412 ms", falando: "126 ms" };

function Readout({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`absolute hidden md:block ${className}`}>
      <div className="micro">{label}</div>
      <div className="mt-1 font-mono text-xs text-foreground/90">{value}</div>
    </div>
  );
}

function Central() {
  const { core, setCore, messages, send, activity, tasks, engine } = useJarvis();
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), [messages]);
  const pending = tasks.filter((t) => !t.done);
  const done = tasks.length - pending.length;
  const cycle = () => setCore(order[(order.indexOf(core) + 1) % order.length] ?? "repouso");

  return (
    <div className="mx-auto grid max-w-[1500px] gap-10 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="flex min-w-0 flex-col">
        <div className="rise flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-3"><span className="h-px w-8 bg-primary" /><span className="micro !text-primary">Sessão ativa · {engine}</span></div>
            <h1 className="text-[2rem] font-extralight leading-tight tracking-tight md:text-5xl">Boa noite.<br /><span className="bg-gradient-to-r from-primary via-glow to-violet bg-clip-text text-transparent">Estou à sua disposição.</span></h1>
          </div>
          <DemoTag>Leituras simuladas</DemoTag>
        </div>

        {/* Núcleo com leituras orbitais */}
        <div className="relative mx-auto my-10 w-full max-w-[640px]">
          <div className="relative mx-auto w-full max-w-[440px] px-5"><HoloCore state={core} /></div>
          <Readout label="Conexão" value="Estável · demo" className="left-0 top-[8%]" />
          <Readout label="Motor ativo" value={engine} className="right-0 top-[8%] text-right" />
          <Readout label="Latência (fictícia)" value={latency[core]} className="bottom-[8%] left-0" />
          <Readout label="Canal" value="Texto · voz demo" className="bottom-[8%] right-0 text-right" />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.4em] text-primary glow-text">{stateLabel[core]}</div>
          </div>
        </div>

        {/* Controles de estado */}
        <div className="mb-8 mt-6 flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-1 rounded-full border border-border bg-background/40 p-1 backdrop-blur">
            {order.map((s, i) => (
              <Button variant="ghost" key={s} onClick={() => setCore(s)} className={`h-8 rounded-full px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wider transition-all duration-300 hover:bg-primary/10 ${core === s ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_var(--color-primary)]" : "text-muted-foreground hover:text-foreground"}`}>
                <span className="mr-1.5 opacity-50">0{i + 1}</span>{stateLabel[s]}
              </Button>
            ))}
          </div>
          <Button variant="console" onClick={cycle} className="group relative flex h-auto items-center gap-3 rounded-full border border-primary/40 bg-gradient-to-b from-primary/20 to-primary/5 py-2.5 pl-3 pr-5 text-sm text-foreground shadow-[0_0_40px_-10px_var(--color-glow)] transition hover:border-primary/70 hover:shadow-[0_0_50px_-6px_var(--color-glow)]">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground transition group-hover:scale-110"><Mic className="h-3.5 w-3.5" /></span>
            Ativar voz <span className="micro">demo</span>
          </Button>
          <p className="micro !normal-case !tracking-normal text-center">Nenhum microfone é acessado — apenas alterna o estado visual.</p>
        </div>

        {/* Console */}
        <div className="panel brackets mx-auto w-full max-w-3xl rounded-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-3"><span className="micro !text-foreground/80">Console de comunicação</span><span className="micro">canal 01</span></div>
            {core === "falando" || core === "processando" ? (
              <span className="wave flex h-3 items-center gap-[2px]">{[0, 1, 2, 3, 4].map((i) => <span key={i} style={{ height: 12, animationDelay: `${i * 0.12}s` }} />)}</span>
            ) : <span className="micro">{messages.length} msgs</span>}
          </div>
          <div className="max-h-80 overflow-y-auto px-5 py-4">
            {messages.length === 0 && <p className="py-6 text-center font-mono text-xs text-muted-foreground">&gt; aguardando comando<span className="caret">_</span></p>}
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div key={i} className="rise grid grid-cols-[4.5rem_1fr] gap-3">
                  <div className="pt-0.5"><div className={`micro ${m.from === "jarvis" ? "!text-primary" : ""}`}>{m.from === "user" ? "Você" : "JARVIS"}</div><div className="micro mt-1 opacity-60">{m.time}</div></div>
                  <p className={`border-l pl-4 text-sm leading-relaxed ${m.from === "jarvis" ? "border-primary/50 text-foreground/90" : "border-border text-foreground"}`}>{m.text}</p>
                </div>
              ))}
              {core === "processando" && <div className="grid grid-cols-[4.5rem_1fr] gap-3"><div className="micro !text-primary">JARVIS</div><div className="sweep h-4 w-40 rounded-sm bg-primary/10" /></div>}
            </div>
            <div ref={end} />
          </div>
          <form className="flex items-center gap-3 border-t border-border bg-background/30 px-4 py-3" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { send(text.trim()); setText(""); } }}>
            <span className="font-mono text-sm text-primary">&gt;</span>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enviar comando simulado ao JARVIS…" className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground/70" />
            <span className="micro hidden sm:inline">Enter ↵</span>
            <Button type="submit" size="icon" aria-label="Enviar" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:scale-105 disabled:scale-100 disabled:opacity-30" disabled={!text.trim()}><ArrowUp className="h-4 w-4" /></Button>
          </form>
        </div>
        <p className="micro mt-3 text-center !normal-case !tracking-normal">Respostas geradas localmente como simulação — nenhuma IA real é chamada.</p>
      </section>

      {/* Inteligência contextual */}
      <aside className="space-y-8 xl:border-l xl:border-border xl:pl-8">
        <div className="micro flex items-center justify-between">Inteligência contextual <DemoTag>Fictício</DemoTag></div>

        <section className="rise">
          <h2 className="mb-4 flex items-baseline justify-between text-sm font-normal">Prioridades do dia <span className="font-mono text-xs text-primary">{done}/{tasks.length}</span></h2>
          <div className="mb-4 flex gap-1">{tasks.map((t) => <span key={t.id} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${t.done ? "bg-primary shadow-[0_0_8px_var(--color-glow)]" : "bg-secondary"}`} />)}</div>
          <ul className="space-y-1">
            {tasks.slice(0, 4).map((t) => (
              <li key={t.id} className="flex items-start gap-3 py-1.5 text-[0.82rem]">
                <span className={`mt-0.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border ${t.done ? "border-primary bg-primary/20" : t.priority === "alta" ? "border-violet" : "border-muted-foreground/50"}`}>{t.done && <Check className="h-2.5 w-2.5 text-primary" />}</span>
                <span className={t.done ? "text-muted-foreground line-through" : "text-foreground/90"}>{t.title}</span>
              </li>
            ))}
          </ul>
          <Link to="/tarefas" className="micro mt-3 inline-flex items-center gap-1 !text-primary hover:gap-2 transition-all">Abrir tarefas <ArrowUpRight className="h-3 w-3" /></Link>
        </section>

        <div className="hairline" />

        <section className="rise">
          <h2 className="mb-4 text-sm font-normal">Projetos em foco</h2>
          {[{ n: "Protocolo IA Dominante", p: 62 }, { n: "JARVIS", p: 41 }].map((x) => (
            <Link to="/projetos" key={x.n} className="group mb-4 block">
              <div className="flex items-baseline justify-between text-[0.82rem]"><span className="transition-colors group-hover:text-primary">{x.n}</span><span className="font-mono text-xs text-muted-foreground">{x.p}%</span></div>
              <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-gradient-to-r from-petrol via-primary to-glow" style={{ width: `${x.p}%` }} /></div>
            </Link>
          ))}
        </section>

        <div className="hairline" />

        <section className="rise">
          <h2 className="mb-4 text-sm font-normal">Atividade recente</h2>
          <ol className="relative space-y-4 border-l border-border pl-5">
            {activity.slice(0, 6).map((a, i) => (
              <li key={i + a.text} className="rise relative">
                <span className={`absolute -left-[1.42rem] top-1.5 h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-primary shadow-[0_0_8px_var(--color-glow)]" : "bg-muted-foreground/40"}`} />
                <div className="text-[0.8rem] text-foreground/85">{a.text}</div>
                <div className="micro mt-0.5">{a.time}</div>
              </li>
            ))}
          </ol>
        </section>
      </aside>
    </div>
  );
}
