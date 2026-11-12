import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useJarvis, type Settings } from "@/lib/jarvis-store";
import { PageTitle, DemoTag, EngineSwitch } from "@/components/jarvis/Shell";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — JARVIS (Protótipo)" }, { name: "description", content: "Preferências visuais do JARVIS: tema, mecanismo, som e modo de escuta." }, { property: "og:title", content: "Configurações — JARVIS" }, { property: "og:description", content: "Preferências visuais do JARVIS: tema, mecanismo, som e modo de escuta." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Config,
});

function Row({ label, hint, children }: { label: ReactNode; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-6 py-5 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div><div className="text-sm">{label}</div>{hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}</div>
      {children}
    </div>
  );
}

function Seg<T extends string>({ value, options, onChange }: { value: T; options: readonly T[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-border p-0.5">
      {options.map((o) => <button key={o} onClick={() => onChange(o)} className={`rounded-md px-3 py-1.5 text-xs transition ${value === o ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{o}</button>)}
    </div>
  );
}

function Config() {
  const { settings, setSettings } = useJarvis();
  const set = (p: Partial<Settings>) => setSettings((s) => ({ ...s, ...p }));
  return (
    <>
      <PageTitle kicker="Sistema" title="Configurações"><DemoTag>Somente visual</DemoTag></PageTitle>
      <div className="glass max-w-3xl rise">
        <Row label="Tema de destaque" hint="Prévia visual — não altera o JARVIS real."><Seg value={settings.theme} options={["Ciano", "Azul elétrico", "Âmbar"] as const} onChange={(theme) => set({ theme })} /></Row>
        <Row label="Mecanismo preferido" hint="Seleção demonstrativa entre Gemini e Qwen."><EngineSwitch /></Row>
        <Row label="Sons de interface" hint="Nenhum som é reproduzido neste protótipo.">
          <button role="switch" aria-checked={settings.sound} onClick={() => set({ sound: !settings.sound })} className={`relative h-6 w-11 rounded-full transition ${settings.sound ? "bg-primary" : "bg-secondary"}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-all ${settings.sound ? "left-[22px]" : "left-0.5"}`} /></button>
        </Row>
        <Row label="Volume da voz" hint={`${settings.volume}%`}>
          <input type="range" min={0} max={100} value={settings.volume} disabled={!settings.sound} onChange={(e) => set({ volume: +e.target.value })} className="w-48 accent-primary disabled:opacity-40" />
        </Row>
        <Row label="Modo de escuta"><Seg value={settings.listen} options={["Manual", "Pressionar para falar", "Palavra de ativação"] as const} onChange={(listen) => set({ listen })} /></Row>
        <Row label={<span className="flex items-center gap-2">Palavra de ativação “JARVIS” <DemoTag /></span>} hint="Recurso planejado. Este protótipo NÃO escuta o microfone.">
          <span className="font-mono text-xs text-muted-foreground">{settings.listen === "Palavra de ativação" ? "Selecionado (simulado)" : "Inativo"}</span>
        </Row>
      </div>
    </>
  );
}
