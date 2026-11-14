import { createContext,useCallback,useContext,useEffect,useState,type ReactNode } from "react";
import { jarvisApi,type ApiStatus,type ApiHistory } from "./jarvis-api";
export type CoreState="repouso"|"ouvindo"|"processando"|"falando";
export type Engine="Gemini"|"Qwen";
export type Task={id:number;title:string;done:boolean;tag:string;priority:"alta"|"média"|"baixa"};
export type Memory={id:number;text:string;status:"pendente"|"aprovada"|"rejeitada"};
export type Msg={from:"user"|"jarvis";text:string;time:string};
export type Activity={text:string;time:string};
export type Settings={theme:"Ciano"|"Azul elétrico"|"Âmbar";sound:boolean;volume:number;listen:"Manual"|"Pressionar para falar"|"Palavra de ativação"};
const now=()=>new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
const priority=(p?:string):Task["priority"]=>{const v=(p||"").toLowerCase();return v.includes("alta")?"alta":v.includes("baixa")?"baixa":"média";};
const rowText=(m:any)=>String(m?.informacao??m?.conteudo??m?.texto??(Array.isArray(m)?m.slice(1).join(" — "):JSON.stringify(m)));
const rowId=(m:any,i:number)=>Number(m?.id??(Array.isArray(m)?m[0]:i+1));
function useJarvisState(){
 const [core,setCore]=useState<CoreState>("repouso"),[engine,setEngineState]=useState<Engine>("Gemini");
 const [status,setStatus]=useState<ApiStatus|null>(null),[connected,setConnected]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState<string|null>(null);
 const [tasks,setTasks]=useState<Task[]>([]),[memories,setMemories]=useState<Memory[]>([]),[messages,setMessages]=useState<Msg[]>([]),[activity,setActivity]=useState<Activity[]>([]);
 const [history,setHistory]=useState<ApiHistory[]>([]);
 const [settings,setSettings]=useState<Settings>({theme:"Ciano",sound:true,volume:60,listen:"Manual"});
 const log=useCallback((text:string)=>setActivity(a=>[{text,time:now()},...a].slice(0,8)),[]);
 const refresh=useCallback(async()=>{
  setLoading(true);
  try{
   const [s,ts,saved,pending,hist]=await Promise.all([jarvisApi.status(),jarvisApi.tasks(),jarvisApi.memories(),jarvisApi.pendingMemories(),jarvisApi.history()]);
   setStatus(s);setConnected(s.servidor==="ativo");setError(null);
   setTasks(ts.map(t=>({id:t.id,title:t.titulo,done:Boolean(t.concluida),tag:t.prazo||"JARVIS",priority:priority(t.prioridade)})));
   setMemories([...pending.map((m:any,i)=>({id:rowId(m,i),text:rowText(m),status:"pendente" as const})),...saved.map((m:any,i)=>({id:rowId(m,i),text:rowText(m),status:"aprovada" as const}))]);
   setHistory(hist);log("Dados sincronizados com o JARVIS local");
  }catch(e){setConnected(false);setStatus(null);setError(e instanceof Error?e.message:"Falha ao conectar ao JARVIS local.");}
  finally{setLoading(false);}
 },[log]);
 useEffect(()=>{void refresh();},[refresh]);
 const setEngine=(e:Engine)=>{setEngineState(e);log("Motor selecionado: "+e);};
 const send=async(text:string)=>{const clean=text.trim();if(!clean)return;setMessages(m=>[...m,{from:"user",text:clean,time:now()}]);setCore("processando");setError(null);
  try{const r=await jarvisApi.chat(clean,engine==="Gemini"?"gemini":"qwen");setMessages(m=>[...m,{from:"jarvis",text:r.resposta,time:now()}]);setCore("falando");log("Resposta recebida do motor real");void refresh();}
  catch(e){setError(e instanceof Error?e.message:"Falha ao consultar o motor.");setMessages(m=>[...m,{from:"jarvis",text:"Não consegui concluir a solicitação. Verifique a conexão e tente novamente.",time:now()}]);}
  finally{setCore("repouso");}
 };
 const addTask=async(title:string)=>{const r=await jarvisApi.addTask(title);if(!r.sucesso||!r.id)throw new Error("O servidor não confirmou a criação da tarefa.");await refresh();};
 const completeTask=async(id:number)=>{const r=await jarvisApi.completeTask(id);if(!r.sucesso)throw new Error("O servidor não confirmou a conclusão.");await refresh();};
 const suggestMemory=async(text:string)=>{const r=await jarvisApi.suggestMemory(text);if(!r.sucesso)throw new Error(r.mensagem||"Não foi possível criar a sugestão.");await refresh();};
 const approveMemory=async(id:number)=>{const r=await jarvisApi.approveMemory(id);if(!r.sucesso)throw new Error("A memória não foi aprovada.");await refresh();};
 const rejectMemory=async(id:number)=>{const r=await jarvisApi.rejectMemory(id);if(!r.sucesso)throw new Error("A rejeição não foi confirmada.");await refresh();};
 const editMemory=async(id:number,text:string)=>{const r=await jarvisApi.editMemory(id,text);if(!r.sucesso)throw new Error("A edição não foi confirmada.");await refresh();};
 return {core,setCore,engine,setEngine,status,connected,loading,error,setError,refresh,tasks,memories,messages,send,addTask,completeTask,approveMemory,rejectMemory,editMemory,suggestMemory,history,activity,log,settings,setSettings};
}
const Ctx=createContext<ReturnType<typeof useJarvisState>|null>(null);
export function JarvisProvider({children}:{children:ReactNode}){return <Ctx.Provider value={useJarvisState()}>{children}</Ctx.Provider>;}
export function useJarvis(){const c=useContext(Ctx);if(!c)throw new Error("JarvisProvider ausente");return c;}
