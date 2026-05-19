# Contrato de Card — como escrever um bom card no kanban

Todo card que o CEO Agent cria (e que o Dev Agent executa) deve seguir
este contrato para que cada sessão de 30 min entregue algo que importa.

## Estrutura da descrição

1. **Hipótese** — por que isso vale a pena? Que problema resolve ou que
   métrica deveria mover?

2. **Critério de aceitação mensurável** — como saber que terminou e deu
   certo? Evite critérios vagos como "melhorar a UX".

3. **Risco / rollback** — o que pode dar errado e como desfazer?

4. **Como validar em produção** — depois do deploy, como confirmar que
   funcionou?

## Campos do card no Notion

- **Status**: Backlog, Todo, In Progress, Review, Done
- **Priority**: 0 (baixa) a 3 (urgente). Bugs de produção e segurança = 3.
- **Labels**: `feature`, `bug`, `optimization`, `performance`, `security`,
  `ux`, `test`, `refactor`, `docs`, `needs-human`
- **Scheduled For**: data em que o Dev deve pegar o card (YYYY-MM-DD)
- **Created By**: `ceo_agent`, `dev_agent`, `admin`

## Regras de escopo

- Um card deve caber em **uma sessão de 30 min**. Se for maior, quebre
  em sub-cards entregáveis individualmente.
- Cards que mexem em **migrations, dependências, secrets ou config de
  build/deploy** devem receber `needs-human`.

## Exemplo

> **Título:** Adicionar lazy loading nas imagens de avatar
>
> **Descrição:**
> Hipótese: avatares carregam eagerly no PublicProfile, atrasando LCP
> em perfis com muitos links. Critério: imagens de avatar usam
> `loading="lazy"`, verificável inspecionando o DOM. Risco: baixo —
> reverter o commit. Validar: abrir um perfil público e conferir no
> DevTools que a imagem tem o atributo lazy.
>
> **Priority:** 1 · **Labels:** performance · **Scheduled For:** 2026-05-20
