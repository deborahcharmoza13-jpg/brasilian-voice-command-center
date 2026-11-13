import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Cpu, AudioLines, Palette, Mic } from "lucide-react";
import { useJarvis, type Settings } from "@/lib/jarvis-store";
import { PageTitle, DemoTag, EngineSwitch } from "@/components/jarvis/Shell";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Workspace, Readings, SectionLabel } from "@/components/jarvis/Workspace";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — JARVIS (Protótipo)" }, { name: "description", content: "Preferências visuais do JARVIS: tema, mecanismo, som e modo de escuta." }, { property: "og:title", content: "Configurações — JARVIS" }, { property: "og:description", content: "Preferências visuais do JARVIS: tema, mecanismo, som e modo de escuta." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Config,
});

function Row({label,hint,children}:{label:ReactNode;hint?:string;children:ReactNode}){
 return <div className="flex flex-col gap-4 border-b border-border py-6 last:border-0 sm:flex-row sm:items-center sm:justify-between"><div className="max-w-sm"><div className="text-sm">{label}</div>{hint&&<div className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{hint}</div>}</div>{children}</div>;
}
function Config(){
 const {settings,setSettings,engine}=useJarvis();
 const set=(p:Partial<Settings>)=>setSettings(s=>({...s,...p}));
 const swatches={Ciano:"bg-primary", "Azul elétrico":"bg-accent", "Âmbar":"bg-amber"};
 return <Workspace>
  <PageTitle kicker="06 / Sistema" title="Configurações"><DemoTag>Somente visual</DemoTag></PageTitle>
  <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_260px]">
   <div className="min-w-0">
    <SectionLabel code="C / 01"><Palette className="h-4 w-4 text-primary"/>Identidade visual</SectionLabel>
    <Row label="Tema de destaque" hint="Prévia visual — não altera o JARVIS real."><div className="flex flex-wrap gap-2" role="group" aria-label="Tema de destaque">{(["Ciano","Azul elétrico","Âmbar"] as const).map(theme=><Button key={theme} variant={settings.theme===theme ? "console" : "tool"} size="sm" aria-pressed={settings.theme===theme} onClick={()=>set({theme})}><span className={`h-2.5 w-2.5 rounded-full ${swatches[theme]}`}/>{theme}</Button>)}</div></Row>
    <div className="mt-8"><SectionLabel code="C / 02"><Cpu className="h-4 w-4 text-primary"/>Processamento</SectionLabel><Row label="Mecanismo preferido" hint="Seleção demonstrativa entre Gemini e Qwen."><EngineSwitch/></Row></div>
    <div className="mt-8"><SectionLabel code="C / 03"><AudioLines className="h-4 w-4 text-primary"/>Áudio e voz</SectionLabel>
     <Row label="Sons de interface" hint="Nenhum som é reproduzido neste protótipo."><Switch aria-label="Sons de interface" checked={settings.sound} onCheckedChange={sound=>set({sound})}/></Row>
     <Row label="Volume da voz"><div className="flex items-center gap-4"><input aria-label="Volume da voz" type="range" min={0} max={100} value={settings.volume} disabled={!settings.sound} onChange={e=>set({volume:+e.target.value})} className="w-40 accent-primary disabled:opacity-40"/><span className="w-10 font-mono text-xs text-primary">{settings.volume}%</span></div></Row>
     <Row label="Modo de escuta"><div className="flex flex-wrap gap-1" role="group" aria-label="Modo de escuta">{(["Manual","Pressionar para falar","Palavra de ativação"] as const).map(listen=><Button key={listen} size="sm" variant={settings.listen===listen ? "console" : "tool"} aria-pressed={settings.listen===listen} onClick={()=>set({listen})}>{listen}</Button>)}</div></Row>
     <Row label={<span className="flex flex-wrap items-center gap-2">Palavra de ativação “JARVIS” <DemoTag/></span>} hint="Recurso planejado. Este protótipo NÃO escuta o microfone."><span className="font-mono text-xs text-muted-foreground">{settings.listen==="Palavra de ativação" ? "Selecionado (simulado)" : "Inativo"}</span></Row>
    </div>
   </div>
   <aside className="border-t border-border pt-6 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
    <SectionLabel code="SYS">Estado da sessão</SectionLabel>
    <div className="settings-spectrum relative mb-6 flex h-28 items-center justify-center overflow-hidden border-y border-border" aria-hidden="true"><AudioLines className="h-12 w-12 text-primary" strokeWidth={1}/></div>
    <dl className="space-y-5 text-xs">{[["Tema",settings.theme],["Motor",engine],["Áudio",settings.sound ? "Ativo · demo" : "Desativado"],["Volume",`${settings.volume}%`],["Escuta",settings.listen]].map(([label,value])=><div key={label}><dt className="micro mb-1.5">{label}</dt><dd className="font-mono text-foreground">{value}</dd></div>)}</dl>
    <div className="mt-8 flex items-start gap-2 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground"><Mic className="mt-0.5 h-4 w-4 shrink-0 text-warn"/>Microfone desconectado. Preferências apenas nesta sessão.</div>
   </aside>
  </div>
 </Workspace>;
}
