# Política de Autonomia dos Agentes

Esta política define o que o Dev Agent pode fazer sozinho versus o que
**exige revisão humana**. O modelo é "deploy direto na main", então o
mecanismo de governança é **prevenir** que o Dev pegue cards perigosos.

## Regra principal

Cards no Notion podem ter o label `needs-human`. **O Dev Agent não
executa cards com esse label**; ele os pula e segue para o próximo.

O CEO Agent marca `needs-human` em cards que toquem qualquer item da
lista abaixo. Se o Dev encontrar um card sem o label que deveria ter,
ele deve adicionar o label e pular.

## ✅ O Dev Agent pode fazer sozinho

- Editar código React/TypeScript/CSS em `app/`, `components/` e `lib/`
- Adicionar/modificar testes
- Escrever scripts em `scripts/` que NÃO mexam em secrets
- Commitar e dar push na `main` (deploy automático na Vercel)
- Criar arquivos novos em `app/`, `components/`, `lib/`, `docs/`
- Criar/mover/atualizar cards no Notion via MCP

## ⚠️ Precisa de label `needs-human` (Dev pula)

### Banco de dados
- Qualquer migration nova em `supabase/migrations/`
- Mudança de schema (tabelas, colunas, índices, policies RLS)
- Apagar dados em produção

### Dependências
- Adicionar nova dependência no `package.json`
- Atualizar versão major de qualquer dependência
- Remover dependência usada por código atual

### Configuração e secrets
- Modificar `.env.local`, `.env.example`
- Modificar `next.config.ts` ou `proxy.ts` de forma que afete build/deploy
- Modificar `vercel.json`
- Adicionar/remover env vars no Vercel

### Infra dos agentes
- Modificar `.claude/settings.local.json`
- Modificar `scripts/setup-tasks.ps1` ou os `.bat`
- Modificar scripts de monitoramento (watchdog, notify-failure, record-usage)

### Operações externas
- Contratar serviços pagos
- Subir release pública/anúncio
- Comprar domínio
- Ativar plataformas de pagamento ou analytics externas

## Como o Dev Agent processa um card `needs-human`

1. Busca card no Notion via MCP
2. Se as labels contêm `needs-human`:
   - **NÃO mova para "In Progress"**
   - Logue: `node scripts/supabase-agent.mjs log dev_agent card_skipped_needs_human '{"card_id":"<id>"}'`
   - Pegue o próximo card
3. Se nenhum card executável disponível, encerre a sessão

## Quando o dono executa um card `needs-human`

1. Lê a descrição do card no Notion
2. Faz a ação manualmente
3. Remove o label `needs-human` ou move direto para "Done"
4. Se ainda faltar trabalho de código, remove `needs-human` e deixa em "Todo"
