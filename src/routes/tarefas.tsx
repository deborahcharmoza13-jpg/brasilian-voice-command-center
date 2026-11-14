import {createFileRoute} from "@tanstack/react-router";
import {useState} from "react";
import {Check,Plus} from "lucide-react";
import {useJarvis} from "@/lib/jarvis-store";
import {PageTitle} from "@/components/jarvis/Shell";
import {Button} from "@/components/ui/button";
import {Workspace,Readings,SectionLabel} from "@/components/jarvis/Workspace";
export const Route=createFileRoute("/tarefas")({component:Tarefas,head:()=>({meta:[{title:"Tarefas — JARVIS"}]})});
function Tarefas(){
 const {tasks,addTask,completeTask,connected,loading,error}=useJarvis();
 const [title,setTitle]=useState(""),[busy,setBusy]=useState(false),[notice,setNotice]=useState("");
 const [filter,setFilter]=useState<"todas"|"abertas"|"concluídas">("todas");
 const shown=tasks.filter(t=>filter==="todas"||(filter==="abertas"?!t.done:t.done));
 async function create(e:React.FormEvent){e.preventDefault();if(!title.trim())return;setBusy(true);setNotice("");try{await addTask(title.trim());setTitle("");setNotice("Tarefa salva no banco local.");}catch(x){setNotice(x instanceof Error?x.message:"Falha ao salvar.");}finally{setBusy(false);}}
 async function finish(id:number){setBusy(true);setNotice("");try{await completeTask(id);setNotice("Conclusão registrada no banco local.");}catch(x){setNotice(x instanceof Error?x.message:"Falha ao concluir.");}finally{setBusy(false);}}
 return <Workspace><PageTitle kicker="03 / Execução" title="Tarefas"/><Readings items={[{label:"Na fila",value:tasks.filter(t=>!t.done).length},{label:"Concluídas",value:tasks.filter(t=>t.done).length,tone:"ok"},{label:"Conexão",value:connected?"LOCAL":"OFFLINE",tone:connected?"ok":"warn"},{label:"Origem",value:"BANCO REAL"}]}/>
 <form onSubmit={create} className="flex gap-3 border-b border-primary/40 bg-primary/5 p-3 sm:p-4"><span className="self-center font-mono text-primary">&gt;</span><input aria-label="Nova tarefa" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Nova tarefa…" className="min-w-0 flex-1 bg-transparent text-sm outline-none"/><Button size="sm" variant="console" type="submit" disabled={!connected||busy||!title.trim()}><Plus/>Adicionar</Button></form>
 {notice&&<p role="status" className="py-3 text-sm text-primary">{notice}</p>}{error&&<p role="alert" className="py-3 text-sm text-destructive">{error}</p>}
 <div className="flex flex-wrap items-center justify-between gap-3"><SectionLabel code="T / 01">Fila de execução</SectionLabel><div className="flex gap-1">{(["todas","abertas","concluídas"] as const).map(f=><Button key={f} size="sm" variant={filter===f?"console":"tool"} onClick={()=>setFilter(f)}>{f}</Button>)}</div></div>
 <ul className="divide-y divide-border border-y border-border">{shown.map((t,i)=><li key={t.id} className="flex items-center gap-4 py-5"><span className="font-mono text-xs text-muted-foreground">{String(i+1).padStart(2,"0")}</span><Button size="icon" variant="tool" disabled={busy||!connected||t.done} aria-label="Concluir tarefa" onClick={()=>void finish(t.id)} className={t.done?"text-ok":""}>{t.done?<Check/>:null}</Button><div className="min-w-0 flex-1"><p className={t.done?"text-sm text-muted-foreground line-through":"text-sm"}>{t.title}</p><p className="micro mt-2">{t.tag} · {t.priority}</p></div>{t.done&&<span className="micro text-ok">CONCLUÍDA</span>}</li>)}{!shown.length&&<li className="py-10 text-center text-sm text-muted-foreground">{loading?"Carregando dados…":"Nenhuma tarefa registrada."}</li>}</ul>
 <p className="micro mt-4">A API atual permite criar e concluir tarefas. Edição e exclusão não estão disponíveis no backend.</p></Workspace>;
}