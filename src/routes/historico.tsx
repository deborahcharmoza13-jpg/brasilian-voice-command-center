import {createFileRoute} from "@tanstack/react-router";
import {useJarvis} from "@/lib/jarvis-store";
import {PageTitle} from "@/components/jarvis/Shell";
import {Workspace,Readings,SectionLabel} from "@/components/jarvis/Workspace";
export const Route=createFileRoute("/historico")({component:Historico,head:()=>({meta:[{title:"Histórico — JARVIS"}]})});
function Historico(){
 const {history,loading,error,connected}=useJarvis();
 return <Workspace><PageTitle kicker="05 / Registros" title="Histórico"/><Readings items={[{label:"Registros",value:history.length},{label:"Origem",value:"BANCO REAL"},{label:"Conexão",value:connected?"LOCAL":"OFFLINE",tone:connected?"ok":"warn"},{label:"Limite",value:"100"}]}/><SectionLabel code="H / 01">Conversas registradas</SectionLabel>
 {error&&<p role="alert" className="py-3 text-sm text-destructive">{error}</p>}<ol className="divide-y divide-border border-y border-border">{history.map(item=><li key={item.id} className="py-5"><div className="micro mb-3">REGISTRO #{item.id} · {item.data_criacao||"Data não informada"}</div><p className="border-l border-border pl-4 text-sm leading-relaxed"><strong className="text-primary">Você:</strong> {item.mensagem}</p>{item.resposta&&<p className="mt-4 border-l border-primary/40 pl-4 text-sm leading-relaxed"><strong className="text-primary">JARVIS:</strong> {item.resposta}</p>}</li>)}{!history.length&&<li className="py-10 text-center text-sm text-muted-foreground">{loading?"Carregando histórico…":"Nenhuma conversa registrada no banco local."}</li>}</ol></Workspace>;
}