import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { jarvisApi, type ApiStatus } from "./jarvis-api";

export type CoreState = "repouso" | "ouvindo" | "processando" | "falando";
export type Engine = "Gemini" | "Qwen";
export type Task = { id: number; title: string; done: boolean; tag: string; priority: "alta" | "média" | "baixa" };
export type Memory = { id: number; text: string; status: "pendente" | "aprovada" | "rejeitada" };
export type Msg = { from: "user" | "jarvis"; text: string; time: string };
export type Activity = { text: string; time: string };
export type Settings = { theme: "Ciano" | "Azul elétrico" | "Âmbar"; sound: boolean; volume: number; listen: "Manual" | "Pressionar para falar" | "Palavra de ativação" };
const now = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
const priority = (p?: string): Task["priority"] => {
  const v = (p || "").toLowerCase();
  return v.includes("alta") ? "alta" : v.includes("baixa") ? "baixa" : "média";
};

function useJarvisState() {
  const [core, setCore] = useState<CoreState>("repouso");
  const [engine, setEngineState] = useState<Engine>("Gemini");
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [settings, setSettings] = useState<Settings>({ theme: "Ciano", sound: true, volume: 60, listen: "Manual" });

  const log = useCallback((text: string) => setActivity(a => [{ text, time: now() }, ...a].slice(0, 8)), []);
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [s, ts, saved, pending] = await Promise.all([
        jarvisApi.status(), jarvisApi.tasks(), jarvisApi.memories(), jarvisApi.pendingMemories(),
      ]);
      setStatus(s); setConnected(s.servidor === "ativo"); setError(null);
      setTasks(ts.map(t => ({ id: t.id, title: t.titulo, done: Boolean(t.concluida), tag: "JARVIS", priority: priority(t.prioridade) })));
      const savedRows = saved.map((m: any, i) => ({ id: Number(m.id ?? i + 1), text: String(m.informacao ?? m.conteudo ?? m.texto ?? (Array.isArray(m) ? m.join(" — ") : JSON.stringify(m))), status: "aprovada" as const }));
      const pendingRows = pending.map((m: any, i) => ({ id: Number(m.id ?? -(i + 1)), text: String(m.informacao ?? m.conteudo ?? m.texto ?? (Array.isArray(m) ? m.join(" — ") : JSON.stringify(m))), status: "pendente" as const }));
      setMemories([...pendingRows, ...savedRows]);
      log("Dados atualizados do servidor local");
    } catch (e) {
      setConnected(false); setStatus(null); setError(e instanceof Error ? e.message : "Falha ao conectar ao JARVIS local.");
    } finally { setLoading(false); }
  }, [log]);

  useEffect(() => { void refresh(); }, [refresh]);

  const setEngine = (e: Engine) => { setEngineState(e); log(`Motor selecionado: ${e}`); };
  const send = async (text: string) => {
    const clean = text.trim(); if (!clean) return;
    setMessages(m => [...m, { from: "user", text: clean, time: now() }]);
    setCore("processando"); setError(null);
    try {
      const result = await jarvisApi.chat(clean, engine === "Gemini" ? "gemini" : "qwen");
      setMessages(m => [...m, { from: "jarvis", text: result.resposta, time: now() }]);
      setCore("falando"); log("Resposta recebida do motor real");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao consultar o motor.");
      setMessages(m => [...m, { from: "jarvis", text: "Não consegui concluir a solicitação. Verifique a conexão e tente novamente.", time: now() }]);
    } finally { setCore("repouso"); }
  };

  const addTask = async (title: string) => { await jarvisApi.addTask(title); await refresh(); log("Tarefa salva no banco local"); };
  const completeTask = async (id: number) => { const r = await jarvisApi.completeTask(id); if (!r.sucesso) throw new Error("O servidor não confirmou a conclusão."); await refresh(); };
  const approveMemory = async (id: number) => { const r = await jarvisApi.approveMemory(id); if (!r.sucesso) throw new Error("A memória não foi aprovada pelo servidor."); await refresh(); };
  const rejectMemory = async (id: number) => { const r = await jarvisApi.rejectMemory(id); if (!r.sucesso) throw new Error("A rejeição não foi confirmada."); await refresh(); };
  const editMemory = async (id: number, text: string) => { const r = await jarvisApi.editMemory(id, text); if (!r.sucesso) throw new Error("A edição não foi confirmada."); await refresh(); };
  return { core, setCore, engine, setEngine, status, connected, loading, error, setError, refresh, tasks, memories, messages, send, addTask, completeTask, approveMemory, rejectMemory, editMemory, suggestMemory: jarvisApi.suggestMemory, activity, log, settings, setSettings };
}
const Ctx = createContext<ReturnType<typeof useJarvisState> | null>(null);
export function JarvisProvider({ children }: { children: ReactNode }) { return <Ctx.Provider value={useJarvisState()}>{children}</Ctx.Provider>; }
export function useJarvis() { const c = useContext(Ctx); if (!c) throw new Error("JarvisProvider ausente"); return c; }
