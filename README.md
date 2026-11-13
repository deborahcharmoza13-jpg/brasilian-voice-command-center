# Brasilian Voice Command Center

Crie um PROTÓTIPO INTERATIVO de alta fidelidade para a interface desktop do assistente pessoal JARVIS, em português brasileiro. Este é um projeto de demonstração visual independente: NÃO conecte a nenhum backend, não use banco de dados, não acesse nem altere o projeto JARVIS local da usuária, não publique e não implemente integrações reais. O objetivo é a usuária visualizar e experimentar o design dos sonhos antes de integrar ao projeto Python existente.

DIREÇÃO VISUAL:
- Inspirado em interfaces cinematográficas de assistentes futuristas e centros de comando, sem copiar interfaces protegidas.
- Aparência premium, tecnológica, sofisticada e funcional; fundo azul-marinho quase preto, vidro fosco discreto, linhas finas, brilho ciano/azul elétrico, tipografia limpa, alto contraste e respiro.
- Layout desktop primeiro, responsivo para notebook e celular.
- Elemento central marcante: núcleo holográfico circular com anéis concêntricos, partículas/luz e animação CSS suave. Estados visuais distintos: repouso, ouvindo, processando e falando.
- Evitar excesso de neon, excesso de cartões, poluição visual ou estética de template genérico.

ESTRUTURA:
1. Sidebar com marca JARVIS e navegação: Central, Projetos, Tarefas, Memória, Histórico e Configurações.
2. Barra superior com data/hora simulada, status do sistema e seletor visual de mecanismo Gemini/Qwen (somente demonstração).
3. Central: saudação “Boa noite. Estou à sua disposição.”, núcleo holográfico central, estado atual, botão de ativação de voz demonstrativo, campo de texto para enviar mensagem simulada, painel lateral de atividade recente e resumo de tarefas.
4. Projetos: cartões para “Protocolo IA Dominante” e “JARVIS”, com progresso demonstrativo e ações interativas.
5. Tarefas: lista de tarefas fictícias editáveis, adicionar tarefa e marcar como concluída usando estado local.
6. Memória: lista demonstrativa com ações aprovar/editar/rejeitar usando estado local.
7. Histórico: conversas demonstrativas navegáveis.
8. Configurações: controles visuais para tema, mecanismo preferido, som e modo de escuta. A palavra de ativação “JARVIS” aparece como recurso planejado, mas deve ficar explicitamente marcada como DEMONSTRAÇÃO, não escutar microfone real.

INTERAÇÕES:
- Navegação entre seções funcional.
- Núcleo alterna visualmente entre repouso/ouvindo/processando/falando com botão de demonstração; nenhuma captura real de microfone.
- Enviar texto adiciona mensagem e resposta demonstrativa identificada como simulação, sem chamadas de IA reais.
- Adicionar/concluir tarefas funciona localmente.
- Aprovar/editar/rejeitar memórias funciona localmente.
- Seletor Gemini/Qwen muda visualmente.
- Preferências de configuração interativas.
- Inclua avisos discretos e claros de que dados, respostas, status, métricas e voz são fictícios e não estão conectados ao JARVIS real.

ENTREGA:
- Faça a interface realmente navegável e visualmente refinada, com animações suaves e estados responsivos.
- Não crie login, pagamentos, backend, Supabase ou publicação.
- Nome do projeto: JARVIS — Centro de Comando (Protótipo).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://brasilian-voice-command-center.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5e7fc19c-af99-4776-a78a-f88c4a8fe378).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
