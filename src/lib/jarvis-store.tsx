import { createContext, useContext, useState, type ReactNode } from "react";

export type CoreState = "repouso" | "ouvindo" | "processando" | "falando";
export type Engine = "Gemini" | "Qwen";
export type Task = { id: number; title: string; done: boolean; tag: string };
export type Memory = { id: number; text: string; status: "pendente" | "aprovada" | "rejeitada" };
export type Msg = { from: "user" | "jarvis"; text: string; time: string };
export type Activity = { text: string; time: string };
export type Settings = { theme: "Ciano" | "Azul elétrico" | "Âmbar"; sound: boolean; volume: number; listen: "Manual" | "Pressionar para falar" | "Palavra de ativação" };

const now = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

function useJarvisState() {
  const [core, setCore] = useState<CoreState>("repouso");
  const [engine, setEngine] = useState<Engine>("Gemini");
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Revisar arquitetura do módulo de voz", done: false, tag: "JARVIS" },
    { id: 2, title: "Escrever roteiro do Protocolo IA Dominante — ep. 3", done: false, tag: "Protocolo" },
    { id: 3, title: "Testar troca de mecanismo Gemini/Qwen", done: true, tag: "JARVIS" },
    { id: 4, title: "Organizar notas da semana", done: false, tag: "Pessoal" },
  ]);
  const [memories, setMemories] = useState<Memory[]>([
    { id: 1, text: "Prefere respostas curtas e diretas pela manhã.", status: "pendente" },
    { id: 2, text: "O projeto principal é escrito em Python.", status: "aprovada" },
    { id: 3, text: "Trabalha melhor em blocos de 50 minutos.", status: "pendente" },
    { id: 4, text: "Gosta de café às 15h.", status: "pendente" },
  ]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [activity, setActivity] = useState<Activity[]>([
    { text: "Sistema inicializado (simulação)", time: "21:02" },
    { text: "Tarefa concluída: testar troca de mecanismo", time: "20:47" },
    { text: "Nova memória sugerida", time: "20:31" },
  ]);
  const [settings, setSettings] = useState<Settings>({ theme: "Ciano", sound: true, volume: 60, listen: "Manual" });

  const log = (text: string) => setActivity((a) => [{ text, time: now() }, ...a].slice(0, 8));

  const send = (text: string) => {
    setMessages((m) => [...m, { from: "user", text, time: now() }]);
    setCore("processando");
    log("Mensagem enviada");
    setTimeout(() => {
      setCore("falando");
      setMessages((m) => [...m, { from: "jarvis", time: now(), text: `[Simulação · ${engine}] Entendido. Em uma versão conectada, eu processaria: “${text.slice(0, 80)}”. Nenhuma IA real foi chamada.` }]);
      setTimeout(() => setCore("repouso"), 2400);
    }, 1400);
  };

  return { core, setCore, engine, setEngine: (e: Engine) => { setEngine(e); log(`Mecanismo alterado para ${e}`); }, tasks, setTasks, memories, setMemories, messages, send, activity, log, settings, setSettings };
}

const Ctx = createContext<ReturnType<typeof useJarvisState> | null>(null);
export function JarvisProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={useJarvisState()}>{children}</Ctx.Provider>;
}
export function useJarvis() {
  const c = useContext(Ctx);
  if (!c) throw new Error("JarvisProvider ausente");
  return c;
}
