# Relatório Técnico — Linqu.es

**Data:** 2026-03-06
**Autor:** Análise de Engenharia Full Stack
**Repositório:** `link-me` · branch `main`

---

## Sumário Executivo

O Linqu.es é um clone de Linktree em estágio de MVP funcional. O produto tem uma base técnica sólida e moderna, com escolhas de stack inteligentes que minimizam a complexidade operacional. No entanto, existem falhas críticas de segurança, ausência total de estratégia de SEO para o núcleo do negócio, e dependências mortas que indicam escopo em flux. O app não está pronto para escalar sem resolver os problemas descritos abaixo.

---

## Stack Atual

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite 6 + TypeScript |
| Estilização | Tailwind CSS 4 |
| Roteamento | React Router 7 |
| Animações | Motion (Framer Motion) |
| Temas WebGL | Three.js + React Three Fiber + Drei |
| Backend | Express (apenas serve estáticos / Vite middleware) |
| BaaS | Supabase (Auth + Postgres + RLS) |
| Deploy | Não configurado |

---

## Pontos Fortes

### 1. Arquitetura BaaS pragmatica para MVP
Usar o Supabase como BaaS elimina a necessidade de escrever e operar um backend proprio. Auth, banco, RLS e RPC ficam todos no Supabase. Para um MVP, essa escolha e a mais rapida possivel sem sacrificar segurança basica.

### 2. Sistema de temas extensivel e bem desenhado
A interface `ThemeDefinition` em `src/themes/types.ts` e um contrato limpo. Adicionar um novo tema exige apenas criar um componente `Background` e registrar no array `THEMES`. O padrao de `defaults` (cores/fontes pre-configuradas por tema) e elegante.

### 3. UX do Dashboard bem cuidada
- Preview mobile em tempo real ao lado do editor.
- Drag-and-drop para reordenar links (Framer Motion `Reorder`).
- Sidebar em desktop + tab bar em mobile.
- Feedback visual de loading/salvo em todos os botoes de acao.

### 4. TypeScript com tipos adequados
`Profile` e `Link` em `src/types.ts` cobrem todos os campos do banco. O contrato entre componentes e razoavelmente seguro.

### 5. RLS habilitado no Supabase
Segurança no banco e garantida pela Row Level Security do Supabase, nao por logica no servidor. Isso e a abordagem correta para um BaaS.

### 6. Click tracking ja implementado
`supabase.rpc('increment_link_clicks', ...)` ja existe na pagina publica, o que e um bom sinal de produto — analytics de engajamento desde o inicio.

### 7. Lazy loading de fontes Google
`src/lib/fonts.ts` carrega fontes sob demanda com deduplicacao via `Set`. Evita carregar todas as fontes desnecessariamente no bundle inicial.

---

## Problemas Criticos

### CRITICO-1 — Race condition no registro de username (TOCTOU)

**Arquivo:** `src/components/AuthPage.tsx:29-46`

O fluxo de registro e:
1. Query: `SELECT username FROM profiles WHERE username = ?`
2. Se livre, chama `supabase.auth.signUp()`

Dois usuarios registrando o mesmo username ao mesmo tempo passam na verificacao do passo 1 simultaneamente. O banco vai aceitar os dois inserts se nao houver `UNIQUE` constraint na coluna `username` da tabela `profiles`.

**Impacto:** Usuarios com username duplicado; rotas `/:username` retornam resultado indeterminado.

**Correcao:** Adicionar `UNIQUE` constraint na coluna `username` no Supabase e tratar o erro de conflito no `catch` do `signUp`. A verificacao client-side pode ser mantida para UX, mas nao e suficiente como garantia de integridade.

---

### CRITICO-2 — Paginas publicas sao Client-Side Render — SEO morto

**Arquivo:** `src/components/PublicProfile.tsx`

A rota `/:username` e renderizada inteiramente no cliente (SPA). Bots de indexacao (Google, Bing) e previews de redes sociais (WhatsApp, Twitter/X, Telegram, iMessage) recebem apenas o `index.html` vazio.

**Impacto direto no negocio:**
- Perfis nao aparecem no Google.
- Compartilhar um link no WhatsApp nao gera preview de cartao social.
- O produto concorre com Linktree, que tem SSR completo.

Para um produto cujo valor central e "compartilhe seus links", a ausencia de Open Graph e SEO e uma falha de produto, nao apenas tecnica.

**Correcao:** Implementar SSR para `/:username` — opcoes incluem migrar para Next.js/Remix, adicionar SSR no Express atual com `renderToString`, ou usar um edge worker para injetar as meta tags OG dinamicamente.

---

### CRITICO-3 — Sem meta tags Open Graph dinamicas

Complementar ao ponto anterior: mesmo que o SSR fosse resolvido, nao existe nenhum codigo gerando `<meta property="og:title">`, `<meta property="og:image">`, `<meta property="og:description">` com os dados do perfil.

**Impacto:** Qualquer compartilhamento em rede social usa os metadados genericos do `index.html`.

---

## Problemas de Seguranca

### SEG-1 — Avatar URL sem validacao

**Arquivo:** `src/components/Dashboard.tsx:427`

O campo `avatar_url` aceita qualquer URL sem validacao. Um usuario pode inserir URLs arbitrarias que serao renderizadas como `<img src={...}>` na pagina publica.

**Riscos:**
- Tracking de IP via pixel de rastreamento externo.
- Conteudo inapropriado hospedado em dominios externos.
- Em contextos de SSR futuro, risco de SSRF.

**Correcao:** Validar que a URL pertence a um dominio permitido, ou — melhor — oferecer upload de avatar para um bucket Supabase Storage e armazenar apenas o caminho interno.

### SEG-2 — Limite de links inexistente

Nao existe nenhuma validacao de quantos links um usuario pode criar. Um ator mal-intencionado pode criar dezenas de milhares de links por conta, consumindo storage e degradando performance de queries.

**Correcao:** Verificar o count de links antes do insert e retornar erro se ultrapassar o limite do plano (ex: 10 para free, ilimitado para pro).

### SEG-3 — Sem rate limiting

O servidor Express nao tem rate limiting em nenhuma rota. O Supabase tem limites proprios, mas a ausencia de rate limiting no app facilita abuso.

---

## Problemas de Performance

### PERF-1 — N queries individuais no reorder

**Arquivo:** `src/components/Dashboard.tsx:119-124`

```typescript
await Promise.all(
  reordered.map(l => supabase.from('links').update({ sort_order: l.sort_order }).eq('id', l.id))
);
```

Para reordenar N links, sao disparadas N requests HTTP paralelas para o Supabase. Com 20 links, sao 20 roundtrips.

**Correcao:** Usar `upsert` com array de objetos em uma unica chamada, ou criar uma funcao RPC no Supabase que receba a lista e atualize em batch dentro de uma transaction.

### PERF-2 — Temas WebGL sem lazy loading

**Arquivo:** `src/themes/index.ts`

`MercuryBackground`, `QuantumBackground` e `LaserBackground` sao importados estaticamente. Isso significa que `three`, `@react-three/fiber`, `@react-three/drei` e `@react-three/postprocessing` entram no bundle principal — bibliotecas que somam varios MBs — mesmo que o usuario nunca selecione um tema WebGL.

**Correcao:** Usar `React.lazy()` e `Suspense` para carregar os componentes de tema sob demanda.

```typescript
// antes
import MercuryBackground from './mercury/Background';

// depois
const MercuryBackground = React.lazy(() => import('./mercury/Background'));
```

### PERF-3 — Click tracking sem resiliencia

**Arquivo:** `src/components/PublicProfile.tsx:43-45`

```typescript
function handleLinkClick(linkId: number) {
  supabase.rpc('increment_link_clicks', { link_id: linkId }); // fire and forget, sem await
}
```

O click e registrado via RPC sincrono no Postgres. Em alto volume, isso se torna um gargalo. Nao ha fallback se a chamada falhar.

**Correcao a curto prazo:** Adicionar `.catch(() => {})` para nao quebrar silenciosamente.
**Correcao a longo prazo:** Enviar eventos para uma fila (ex: Supabase Edge Function + Redis ou um servico de analytics dedicado como Plausible/PostHog).

### PERF-4 — Sem estrategia de cache

Toda navegacao ao dashboard refaz `select('*, links(*)')`. Nao existe SWR, React Query ou nenhuma camada de cache. Em escala, isso aumenta a carga no Supabase desnecessariamente.

---

## Divida Tecnica

### DT-1 — `src/db.ts` e arquivo morto

`src/db.ts` contem um mock de SQLite que **nao e importado por ninguem**. E um residuo de uma implementacao anterior. Cria confusao para novos desenvolvedores sobre qual banco a app realmente usa.

**Acao:** Deletar o arquivo.

### DT-2 — Dependencies fantasmas no `package.json`

As seguintes dependencias estao instaladas mas nao sao usadas na app atual:

| Dependencia | Motivo |
|---|---|
| `better-sqlite3` | Referenciado apenas no `db.ts` morto |
| `@google/genai` | Nao importado em nenhum arquivo da app |
| `vite` | Listado tanto em `dependencies` quanto em `devDependencies` (duplicata) |

Isso aumenta o tamanho do `node_modules`, pode confundir bundlers, e sinaliza escopo incerto.

### DT-3 — `as any` contornando o sistema de tipos

**Arquivo:** `src/components/Dashboard.tsx:243,249`

```typescript
value={(profile as any)[key]?.startsWith('#') ...}
```

O uso de `as any` nesse trecho nao e necessario — o array de configuracao ja tem os `key` tipados e poderia usar `keyof Profile` corretamente.

### DT-4 — Erros silenciosos nas operacoes de links

`handleDelete`, `handleToggle` e `handleReorder` nao verificam o retorno de erro do Supabase. Se a operacao falhar (ex: perda de conectividade), o estado local e atualizado mas o banco nao. O usuario ve uma interface inconsistente com a realidade.

**Padrao recomendado:** Verificar `error` no retorno e reverter o estado local ou exibir uma mensagem de erro.

### DT-5 — Loading infinito potencial no AuthContext

**Arquivo:** `src/contexts/AuthContext.tsx:22-25`

```typescript
supabase.auth.getSession().then(({ data }) => {
  setUser(data.session?.user ?? null);
  setLoading(false);
});
```

Se `getSession()` lançar uma excecao (rejeicao de Promise), o `.then()` nao executa e `loading` nunca vai para `false`. A tela de loading fica travada para o usuario.

**Correcao:** Usar `.finally(() => setLoading(false))` ou bloco `try/catch/finally`.

---

## Bloqueadores para Escalar o Produto

### ESCALA-1 — Sem SSR = sem crescimento organico

Descrito em CRITICO-2. Este e o principal bloqueador de crescimento para um produto de links publicos.

### ESCALA-2 — Sem modelo de monetizacao na arquitetura

Nao existe tabela de `subscriptions`, `plans` ou `tiers`. Para adicionar um plano pago no futuro (ex: temas WebGL so para usuarios Pro, analytics avancados, dominio customizado), toda a arquitetura de dados precisaria ser adicionada do zero. O ideal seria planejar isso antes de ter usuarios.

### ESCALA-3 — Sem analytics de qualidade

O campo `clicks` por link e o unico dado coletado. Para competir com Linktree no mercado, seria necessario: referrer, dispositivo, pais, horario, UTM, sessoes unicas. Esses dados precisam de schema proprio e nao cabem na tabela `links` atual.

### ESCALA-4 — Sem dominio customizado

Linktree Pro oferece dominio customizado (ex: `joao.com.br` apontando para o perfil). Isso requer infraestrutura de proxy reverso e gerenciamento de certificados TLS — algo que nao e possivel com a arquitetura Express atual sem trabalho significativo.

### ESCALA-5 — Servidor Express sem processo management

Em producao, um unico processo Node.js nao aproveita multiplos CPUs. Nao ha `cluster`, `pm2`, nem configuracao de health check. Uma excecao nao capturada derruba o servidor.

---

## Plano de Acao Priorizado

### Imediato (antes de qualquer lancamento publico)

| # | Acao | Impacto |
|---|---|---|
| 1 | Adicionar `UNIQUE` constraint em `profiles.username` no Supabase | Seguranca de dados |
| 2 | Implementar SSR ou meta tags OG para `/:username` | SEO / compartilhamento |
| 3 | Deletar `src/db.ts` e remover `better-sqlite3` e `@google/genai` do `package.json` | Limpeza / clareza |
| 4 | Adicionar `.finally()` no `getSession()` do AuthContext | Estabilidade |
| 5 | Adicionar verificacao de erros em `handleDelete`, `handleToggle`, `handleReorder` | Consistencia de estado |

### Curto prazo (primeiros usuarios reais)

| # | Acao | Impacto |
|---|---|---|
| 6 | Lazy loading dos temas WebGL com `React.lazy` | Performance / bundle size |
| 7 | Batch update no reorder de links (upsert ou RPC) | Performance |
| 8 | Limite de links por usuario (validacao client + server) | Seguranca / abuso |
| 9 | Validacao / restricao de `avatar_url` | Seguranca |
| 10 | Rate limiting no Express | Seguranca |

### Medio prazo (crescimento e monetizacao)

| # | Acao | Impacto |
|---|---|---|
| 11 | Schema de `plans` / `subscriptions` no banco | Monetizacao |
| 12 | Analytics rico: referrer, dispositivo, pais por click | Produto / retencao |
| 13 | Upload de avatar para Supabase Storage | UX / seguranca |
| 14 | PM2 ou Fly.io/Railway com processo management | Confiabilidade producao |
| 15 | Testes automatizados (Vitest + Playwright) | Qualidade / time |

---

## Conclusao

O MVP esta bem construido para validacao de produto. A escolha do Supabase como BaaS foi acertada, o sistema de temas e extensivel, e a UX do dashboard e polida. O maior risco nao e tecnico-operacional, mas estrategico: **um produto cujo core e paginas publicas de links nao pode crescer organicamente sem SSR e Open Graph**. Resolver isso e o investimento com maior retorno antes de qualquer esforco de aquisicao de usuarios.
