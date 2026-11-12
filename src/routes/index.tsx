import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, Send, CircleCheck, Circle } from "lucide-react";
import { useJarvis, type CoreState } from "@/lib/jarvis-store";
import { HoloCore } from "@/components/jarvis/Core";
import { DemoTag } from "@/components/jarvis/Shell";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Central — JARVIS (Protótipo)" }, { name: "description", content: "Central do assistente JARVIS com núcleo holográfico e conversa simulada." }, { property: "og:title", content: "Central — JARVIS" }, { property: "og:description", content: "Central do assistente JARVIS com núcleo holográfico e conversa simulada." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Central,
});

const labels: Record<CoreState, string> = { repouso: "Em repouso", ouvindo: "Ouvindo…", processando: "Processando…", falando: "Respondendo" };
const order: CoreState[] = ["repouso", "ouvindo", "processando", "falando"];

function Central() {
  const { core, setCore, messages, send, activity, tasks, engine } = useJarvis();
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), [messages]);
  const pending = tasks.filter((t) => !t.done);
  const cycle = () => setCore(order[(order.indexOf(core) + 1) % order.length] ?? "repouso");

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
      <section className="flex flex-col items-center">
        <div className="text-center rise">
          <div className="hud-label mb-3">Mecanismo ativo · {engine}</div>
          <h1 className="text-3xl font-extralight tracking-tight md:text-4xl">Boa noite. <span className="text-primary glow-text">Estou à sua disposição.</span></h1>
        </div>
        <div className="my-8 w-[min(70vw,360px)]"><HoloCore state={core} /></div>
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2"><span className="font-mono text-sm uppercase tracking-[0.25em] text-primary">{labels[core]}</span><DemoTag /></div>
          <div className="flex gap-1.5">
            {order.map((s) => (
              <button key={s} onClick={() => setCore(s)} className={`rounded-full border px-3 py-1 text-xs capitalize transition-all ${core === s ? "border-primary/60 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>{s}</button>
            ))}
          </div>
          <button onClick={cycle} className="mt-2 flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm text-primary shadow-[0_0_24px_-6px_var(--color-glow)] transition hover:bg-primary/20">
            <Mic className="h-4 w-4" /> Ativar voz (demonstração)
          </button>
          <p className="text-[0.7rem] text-muted-foreground">Nenhum microfone é acessado — o botão apenas alterna o estado visual.</p>
        </div>

        <div className="glass w-full max-w-2xl">
          {messages.length > 0 && (
            <div className="max-h-72 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div key={i} className={`rise flex ${m.from === "user" ? "justify-end" : ""}`}>
                  <div className={`max-w-[85%] rounded-lg px-3.5 py-2 text-sm ${m.from === "user" ? "bg-primary/15 text-foreground" : "border border-border bg-secondary/40"}`}>
                    {m.text}<div className="mt-1 font-mono text-[0.6rem] text-muted-foreground">{m.time}</div>
                  </div>
                </div>
              ))}
              <div ref={end} />
            </div>
          )}
          <form className="flex items-center gap-2 border-t border-border p-2 first:border-t-0" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { send(text.trim()); setText(""); } }}>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Digite uma mensagem simulada para o JARVIS…" className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground" />
            <button aria-label="Enviar" className="rounded-md bg-primary p-2 text-primary-foreground transition hover:opacity-90 disabled:opacity-40" disabled={!text.trim()}><Send className="h-4 w-4" /></button>
          </form>
        </div>
        <p className="mt-2 text-[0.7rem] text-muted-foreground">Respostas são simuladas localmente. Nenhuma IA real é chamada.</p>
      </section>

      <aside className="space-y-6">
        <div className="glass p-5 rise">
          <div className="mb-4 flex items-center justify-between"><span className="hud-label">Atividade recente</span><DemoTag>Fictício</DemoTag></div>
          <ul className="space-y-3">
            {activity.map((a, i) => (
              <li key={i + a.text} className="flex gap-3 text-sm rise"><span className="font-mono text-xs text-muted-foreground">{a.time}</span><span className="text-foreground/90">{a.text}</span></li>
            ))}
          </ul>
        </div>
        <div className="glass p-5 rise">
          <div className="mb-4 flex items-center justify-between"><span className="hud-label">Tarefas</span><span className="font-mono text-xs text-primary">{tasks.length - pending.length}/{tasks.length}</span></div>
          <div className="mb-4 h-1 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-primary transition-all duration-500" style={{ width: `${((tasks.length - pending.length) / tasks.length) * 100}%` }} /></div>
          <ul className="space-y-2.5">
            {tasks.slice(0, 4).map((t) => (
              <li key={t.id} className="flex items-center gap-2.5 text-sm">{t.done ? <CircleCheck className="h-4 w-4 text-ok" /> : <Circle className="h-4 w-4 text-muted-foreground" />}<span className={t.done ? "text-muted-foreground line-through" : ""}>{t.title}</span></li>
            ))}
          </ul>
          <Link to="/tarefas" className="mt-4 inline-block text-xs text-primary hover:underline">Ver todas →</Link>
        </div>
      </aside>
    </div>
  );
}
