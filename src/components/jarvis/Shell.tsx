import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { LayoutDashboard, FolderKanban, ListChecks, Brain, History, Settings, Menu, X } from "lucide-react";
import { useJarvis, type Engine } from "@/lib/jarvis-store";
import { stateLabel } from "./Core";

const nav = [
  { to: "/", label: "Central", code: "01", icon: LayoutDashboard },
  { to: "/projetos", label: "Projetos", code: "02", icon: FolderKanban },
  { to: "/tarefas", label: "Tarefas", code: "03", icon: ListChecks },
  { to: "/memoria", label: "Memória", code: "04", icon: Brain },
  { to: "/historico", label: "Histórico", code: "05", icon: History },
  { to: "/configuracoes", label: "Configurações", code: "06", icon: Settings },
] as const;

function Clock() {
  const [d, setD] = useState<Date | null>(null);
  useEffect(() => { setD(new Date()); const t = setInterval(() => setD(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-[0.95rem] font-light tabular-nums tracking-wider">{d ? d.toLocaleTimeString("pt-BR") : "--:--:--"}</span>
      <span className="hidden h-4 w-px bg-border md:block" />
      <span className="micro hidden md:inline">{d ? d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }) : ""}</span>
    </div>
  );
}

export function EngineSwitch() {
  const { engine, setEngine } = useJarvis();
  return (
    <div className="relative flex items-center rounded-full border border-border bg-background/60 p-0.5 text-xs" role="radiogroup" aria-label="Mecanismo (demonstração)">
      <span className={`absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-gradient-to-r from-primary/25 to-primary/5 ring-1 ring-primary/50 shadow-[0_0_16px_-4px_var(--color-glow)] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${engine === "Qwen" ? "translate-x-full" : ""}`} />
      {(["Gemini", "Qwen"] as Engine[]).map((e) => (
        <button key={e} role="radio" aria-checked={engine === e} onClick={() => setEngine(e)}
          className={`relative z-10 flex w-[4.5rem] items-center justify-center gap-1.5 rounded-full py-1.5 font-mono text-[0.68rem] uppercase tracking-wider transition-colors ${engine === e ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
          <span className={`h-1 w-1 rounded-full ${engine === e ? "bg-primary" : "bg-muted-foreground/50"}`} />{e}
        </button>
      ))}
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const { settings, core, engine, tasks } = useJarvis();
  useEffect(() => setOpen(false), [path]);
  const pending = tasks.filter((t) => !t.done).length;
  return (
    <div className="atmos relative flex min-h-screen w-full" data-accent={settings.theme}>
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-background/80 backdrop-blur-2xl transition-transform duration-500 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-6 pb-6 pt-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative grid h-9 w-9 place-items-center">
                <span className="absolute inset-0 rounded-full border border-primary/40" />
                <span className="absolute inset-1 animate-[spin_8s_linear_infinite] rounded-full border border-transparent border-t-primary" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_var(--color-glow)]" />
              </div>
              <div>
                <div className="font-mono text-[1.05rem] font-medium tracking-[0.42em] glow-text">JARVIS</div>
                <div className="micro mt-0.5 !text-[0.5rem]">Centro de comando · v0.9</div>
              </div>
            </div>
            <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Fechar menu"><X className="h-5 w-5" /></button>
          </div>
        </div>
        <div className="hairline mx-6 mb-4" />
        <div className="micro px-6 pb-2">Navegação</div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3">
          {nav.map(({ to, label, code, icon: Icon }) => {
            const active = path === to;
            return (
              <Link key={to} to={to} className={`group relative flex items-center gap-3 overflow-hidden rounded-md px-3 py-2.5 text-[0.85rem] transition-all duration-300 ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                <span className={`absolute inset-0 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`} />
                <span className={`absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_var(--color-glow)] transition-all duration-300 ${active ? "opacity-100" : "h-0 opacity-0"}`} />
                <Icon className={`relative h-[1.05rem] w-[1.05rem] transition-colors ${active ? "text-primary" : ""}`} strokeWidth={1.5} />
                <span className="relative">{label}</span>
                {to === "/tarefas" && pending > 0 && <span className="relative ml-auto rounded bg-primary/10 px-1.5 font-mono text-[0.6rem] text-primary">{pending}</span>}
                <span className={`micro relative ${to === "/tarefas" && pending > 0 ? "" : "ml-auto"} transition-opacity ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>{code}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mx-4 mb-3 space-y-2.5 rounded-md border border-border bg-secondary/20 p-3.5">
          <div className="flex items-center justify-between"><span className="micro">Núcleo</span><span className="font-mono text-[0.65rem] text-primary">{stateLabel[core]}</span></div>
          <div className="flex items-center justify-between"><span className="micro">Motor</span><span className="font-mono text-[0.65rem]">{engine}</span></div>
          <div className="flex items-center justify-between"><span className="micro">Uptime</span><span className="font-mono text-[0.65rem]">04:12:37</span></div>
        </div>
        <div className="mx-4 mb-4 flex gap-2 text-[0.65rem] leading-relaxed text-muted-foreground">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warn" />
          <span><b className="font-medium text-warn">Protótipo.</b> Dados, métricas e voz são simulados e não conectados ao JARVIS real.</span>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />}

      <div className="relative z-10 flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/50 px-4 backdrop-blur-2xl md:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu className="h-5 w-5" /></button>
          <Clock />
          <div className="ml-auto flex items-center gap-5">
            <div className="hidden items-center gap-2.5 sm:flex">
              <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-ok/60" /><span className="relative h-2 w-2 rounded-full bg-ok" /></span>
              <span className="micro !text-foreground/80">Online</span><span className="micro">· simulado</span>
            </div>
            <span className="hidden h-6 w-px bg-border sm:block" />
            <EngineSwitch />
          </div>
        </header>
        <main className="flex-1 px-4 py-8 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}

export function PageTitle({ kicker, title, sub, children }: { kicker: string; title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6 rise">
      <div>
        <div className="mb-3 flex items-center gap-3"><span className="h-px w-8 bg-primary" /><span className="micro !text-primary">{kicker}</span></div>
        <h1 className="text-3xl font-extralight tracking-tight md:text-[2.6rem] md:leading-tight">{title}</h1>
        {sub && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export function DemoTag({ children = "Demonstração" }: { children?: ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-sm border border-warn/30 bg-warn/5 px-1.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-warn/90"><span className="h-1 w-1 rounded-full bg-warn" />{children}</span>;
}
