export type ApiStatus = {
  servidor: string; jarvis: boolean; gemini: boolean; motor_local: boolean;
  memoria: boolean; tarefas_compartilhadas: boolean; autorizacao_memoria: boolean;
  erros_importacao?: Record<string, string>;
};
export type ApiTask = { id:number; titulo:string; prioridade?:string; prazo?:string|null; status?:string; concluida:number|boolean };
export type ApiMemory = { id:number; informacao?:string; categoria?:string; status?:string };
export type ApiHistory = { id:number; mensagem:string; resposta?:string; data_criacao?:string };
async function request<T>(path:string, init?:RequestInit):Promise<T>{
  let response:Response;
  try { response=await fetch(path,{...init,headers:{"Content-Type":"application/json",...init?.headers},cache:"no-store"}); }
  catch { throw new Error("JARVIS local desconectado. Inicie o servidor Python na sua máquina."); }
  const raw=await response.text(); let payload:any={};
  try { payload=raw?JSON.parse(raw):{}; } catch { throw new Error("A API retornou uma resposta inválida."); }
  if(!response.ok) throw new Error(payload?.erro || `Falha na API (${response.status}).`);
  return payload as T;
}
export const jarvisApi={
 status:()=>request<ApiStatus>("/api/status"),
 tasks:()=>request<ApiTask[]>("/api/tarefas"),
 memories:()=>request<ApiMemory[]>("/api/memorias"),
 pendingMemories:()=>request<ApiMemory[]>("/api/memorias/pendentes"),
 history:()=>request<ApiHistory[]>("/api/historico"),
 chat:(mensagem:string,motor:"gemini"|"qwen")=>request<{resposta:string}>("/api/chat",{method:"POST",body:JSON.stringify({mensagem,motor})}),
 addTask:(titulo:string)=>request<{sucesso:boolean;id:number}>("/api/tarefas",{method:"POST",body:JSON.stringify({titulo})}),
 completeTask:(id:number)=>request<{sucesso:boolean}>("/api/tarefas/concluir",{method:"POST",body:JSON.stringify({id})}),
 suggestMemory:(informacao:string,categoria="geral")=>request<{sucesso:boolean;resultado:unknown;mensagem?:string}>("/api/memorias/sugerir",{method:"POST",body:JSON.stringify({informacao,categoria})}),
 approveMemory:(id:number)=>request<{sucesso:boolean}>("/api/memorias/aprovar",{method:"POST",body:JSON.stringify({id})}),
 editMemory:(id:number,informacao:string)=>request<{sucesso:boolean}>("/api/memorias/editar",{method:"POST",body:JSON.stringify({id,informacao})}),
 rejectMemory:(id:number)=>request<{sucesso:boolean}>("/api/memorias/rejeitar",{method:"POST",body:JSON.stringify({id})}),
};