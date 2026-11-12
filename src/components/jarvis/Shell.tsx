import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { LayoutDashboard, FolderKanban, ListChecks, Brain, History, Settings, Menu, X } from "lucide-react";
import { useJarvis, type Engine } from "@/lib/jarvis-store";

const nav = [
  { to: "/", label: "Central", icon: LayoutDashboard },
  { to: "/projetos", label: "Projetos", icon: FolderKanban },
  { to: "/tarefas", label: "Tarefas", icon: ListChecks },
  { to: "/memoria", label: "Memória", icon: Brain },
  { to: "/historico", label: "Histórico", icon: History },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

function Clock() {
  const [d, setD] = useState<Date | null>(null);
  useEffect(() => { setD(new Date()); const t = setInterval(() => setD(new Date()), 1000); return () => clearInterval(t); }, []);
  if (!d) return <span className="font-mono text-sm">--:--:--</span>;
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-sm tabular-nums">{d.toLocaleTimeString("pt-BR")}</span>
      <span className="hidden text-xs text-muted-foreground md:inline">{d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</span>
    </div>
  );
}

export function EngineSwitch() {
  const { engine, setEngine } = useJarvis();
  return (
    <div className="relative flex rounded-full border border-border bg-secondary/40 p-0.5 text-xs" role="radiogroup" aria-label="Mecanismo (demonstração)">
      <span className={`absolute inset-y-0.5 w-[calc(50%-2px)] rounded-full bg-primary/15 ring-1 ring-primary/50 transition-transform duration-300 ${engine === "Qwen" ? "translate-x-full" : ""}`} />
      {(["Gemini", "Qwen"] as Engine[]).map((e) => (
        <button key={e} role="radio" aria-checked={engine === e} onClick={() => setEngine(e)}
          className={`relative z-10 w-16 rounded-full py-1 font-medium transition-colors ${engine === e ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>{e}</button>
      ))}
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const { settings } = useJarvis();
  useEffect(() => setOpen(false), [path]);
  return (
    <div className="flex min-h-screen w-full" data-accent={settings.theme}>
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-background/90 backdrop-blur-xl transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="relative h-8 w-8 rounded-full border border-primary/60 shadow-[0_0_18px_var(--color-glow)]"><div className="absolute inset-2 rounded-full bg-primary" /></div>
          <div>
            <div className="font-mono text-lg font-semibold tracking-[0.3em] glow-text">JARVIS</div>
            <div className="hud-label !text-[0.55rem]">Centro de comando</div>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setOpen(false)} aria-label="Fechar menu"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = path === to;
            return (
              <Link key={to} to={to} className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}>
                {active && <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-primary shadow-[0_0_10px_var(--color-glow)]" />}
                <Icon className="h-4 w-4" />{label}
              </Link>
            );
          })}
        </nav>
        <div className="m-3 rounded-lg border border-warn/30 bg-warn/5 p-3 text-[0.7rem] leading-relaxed text-muted-foreground">
          <span className="font-semibold text-warn">PROTÓTIPO</span> — dados, respostas, métricas e voz são fictícios. Não conectado ao JARVIS real.
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-background/60 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-background/70 px-4 backdrop-blur-xl md:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu className="h-5 w-5" /></button>
          <Clock />
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok shadow-[0_0_8px_var(--color-ok)]" />
              <span className="hud-label">Sistema nominal · simulado</span>
            </div>
            <EngineSwitch />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

export function PageTitle({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 rise">
      <div>
        <div className="hud-label mb-2">{kicker}</div>
        <h1 className="text-2xl font-light tracking-tight md:text-3xl">{title}</h1>
      </div>
      {children}
    </div>
  );
}

export function DemoTag({ children = "Demonstração" }: { children?: ReactNode }) {
  return <span className="rounded border border-warn/40 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-warn">{children}</span>;
}
