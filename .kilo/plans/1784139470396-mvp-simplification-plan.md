# Monólitos Valley — MVP Simplification Plan

## Context
- Novo repositório: https://github.com/monolitosvalley/site (você tem acesso e gestão totais).
- Google Calendar da comunidade: https://calendar.google.com/calendar/u/0?cid=YzRkMDQ2YTY3ODkyMWQxMWFjYzEzMjM1Yjk0NzIzNzE3NTEyYWIxMDVlNmI3YTY5MWVmNzAwNDIyNmI0Y2NmOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t
- Objetivo: reduzir o site a um MVP funcional, manter só o essencial, e preparar para colaboração via PR na organização Monólitos Valley.

## Fase 1 — Corrigir Build (blocker)

### 1.1 Remover páginas que dependem de componentes deletados
- **`app/(public)/blog/page.tsx`** → deletar (blog sai do site)
- **`app/(public)/blog/[slug]/page.tsx`** → deletar
- **`app/(public)/opportunities/page.tsx`** → deletar (opportunidades viram conteúdo no Google Calendar)
- **`app/(public)/store/page.tsx`** → deletar (lojinha removida)
- **`app/admin/edit/blog/[id]/page.tsx`** → deletar
- **`app/admin/edit/opportunity/[id]/page.tsx`** → deletar (se existir)
- **`app/admin/edit/partner/[id]/page.tsx`** → deletar (se existir)
- **`app/admin/edit/product/[id]/page.tsx`** → deletar (se existir)

### 1.2 Remover rotas de API que não servirão mais
- `app/api/blog-posts/` → deletar
- `app/api/opportunities/` → deletar
- `app/api/partners/` → deletar (parceiros ficam estáticos)
- `app/api/store-products/` → deletar

### 1.3 Remover componentes deletados em staging que ainda são referenciados
- Os componentes já staged para remoção (BlogPostForm, OpportunityForm, PartnerForm, BlogCard, BlogGrid, Testimonials, OpportunityCard, OpportunityTabs, ProductCard) já estão no index; só falta remover os importers listados em 1.1.

### 1.4 Atualizar Navbar
- Remover links quebrados (`/blog`, `/opportunities`, `/store`)
- Manter: Início, Startups, Eventos, Lideranças

## Fase 2 — Página Inicial

### 2.1 Remover seção de Testimonials
- `app/page.tsx` importa `Testimonials` → remover import e bloco `<Testimonials />`
- Os testimonials eram fake; conteúdo de depoimento irá para redes sociais.

### 2.2 Simplificar seção de Startups em Destaque
- Na home, trocar `StartupGrid` por uma lista simplificada: ícone (logo) + nome da startup.
- Manter link para `/startups` para ver todas.
- Componente novo: `StartupHighlightList` (apenas logo + nome, sem cards grandes).

### 2.3 Mover FAQ para Footer ou Support Menu
- Remover import e bloco `<FAQ />` da home.
- Adicionar seção "Dúvidas Frequentes" no Footer como accordion ou link para `/support` (se criado) ou simplesmente texto estático com as perguntas mais comuns.
- **Decisão tomada:** FAQ vai para o Footer como texto simples + accordion leve, sem página dedicada.

### 2.4 Eventos na Home
- Remover `EventCarousel` da home (eventos serão vistos via Google Calendar embed).
- Manter apenas um link "Ver eventos" ou remover completamente a seção de eventos da home, já que o calendário estará na página `/events`.

### 2.5 GSAP Animações
- Adicionar `gsap` + `@gsap/react` às dependências.
- Usar GSAP para:
  - Fade-in/slide-up dos benefit cards na rolagem (ScrollTrigger).
  - Animação sutil no HeroSection.
  - Animações de entrada na página de startups e leaders.
- Não exagerar; manter performance.

## Fase 3 — Eventos → Google Calendar

### 3.1 Página `/events` vira embed do Google Calendar
- Substituir todo o conteúdo de `app/(public)/events/page.tsx` por um embed responsivo do Google Calendar (iframe).
- Usar o calendário público já criado: https://calendar.google.com/calendar/u/0?cid=YzRkMDQ2YTY3ODkyMWQxMWFjYzEzMjM1Yjk0NzIzNzE3NTEyYWIxMDVlNmI3YTY5MWVmNzAwNDIyNmI0Y2NmOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t
- Manter opção de "Salvar evento" nativa do Google Calendar (usuário clica no evento → opção de salvar aparece).
- Remover dependência de `app/api/events/`.
- Remover `EventCard` e `EventCarousel` (ou manter se forem usados em outro lugar).

### 3.2 Simplificar Navbar
- Manter link `/events` que agora embeds o Google Calendar. Pode renomear para "Agenda" se fizer sentido.

## Fase 4 — Lideranças Estáticas

### 4.1 Página `/leaders` vira dados estáticos
- Remover fetch do Supabase em `app/(public)/leaders/page.tsx`.
- Criar arquivo `data/leaders.json` com array de líderes.
- Importar JSON diretamente na página.
- Remover filtros (já foi simplificado em staging).
- Remover estado de `loading`.
- Manter apenas grid/lista bonita com avatar, nome, cargo, startup, links sociais.

### 4.2 Admin de Lideranças
- Manter `AdminLeaders` no admin para admins adicionarem/editar lideranças via Supabase (já existe).
- Mas a página pública não depende mais do endpoint.
- Futuramente, pode-se migrar para PRs editando o JSON, mas por enquanto manter admin simples.

## Fase 5 — Parceiros Estáticos

### 5.1 Página inicial — parceiros
- Remover fetch de `/api/partners` da home.
- Criar `data/partners.json` (ou `data/partners.ts`) com array de parceiros.
- Importar diretamente no `app/page.tsx`.
- Remover `app/api/partners/`.

## Fase 6 — Mapa de Startups (manter)

### 6.1 Página `/startups` (manter)
- Manter mapa e grid de startups.
- Melhorar visual do modal de detalhes da startup (`StartupDetailsModal`):
  - Layout mais profissional.
  - Melhor tipografia e espaçamento.
  - Adicionar animação de entrada com GSAP (fade + scale).
  - Garantir responsividade mobile.

### 6.2 Simplificar cards de startup
- Na home (`StartupHighlightList`): apenas logo + nome, sem descrição longa.
- Na página `/startups`: manter `StartupCard` atual ou simplificar.

## Fase 7 — Admin Simplificado

### 7.1 Reduzir `app/admin/page.tsx`
- Remover abas de Blog, Oportunidades, Parceiros, Produtos (já não existem mais).
- Manter apenas:
  - **Startups**: listar pendentes/aprovadas, aprovar/rejeitar, editar.
  - **Lideranças**: manter `AdminLeaders` (já existe).
  - **Eventos**: se ainda houver necessidade de criar eventos no banco para o Google Calendar (não obrigatório; pode-se criar diretamente no Google Calendar e compartilhar link).
  - **Criar Conteúdo**: remover BlogPostForm, OpportunityForm, PartnerForm.
- Manter `EventForm` se decidirmos que eventos ainda são cadastrados no site e replicados no Calendar; senão remover também.

### 7.2 Rotas de edição
- Manter apenas `/admin/edit/startup/[id]` e `/admin/startups/new`.
- Remover `/admin/edit/blog/[id]` e afins.

### 7.3 Tipos de usuário e acesso
- **Decisão:** manter auth com magic link (Supabase) só para usuários que precisam acessar áreas restritas (donos de startup, admins).
- Simplificar `Profile`: remover campos excessivos (linkedin, phone, bio longa). Manter apenas nome, email, avatar.
- Perfil de startup: manter campos essenciais (nome, descrição, segmento, estágio, cidade, tecnologias, links).

## Fase 8 — Limpeza de Banco e Tipos

### 8.1 Tipos TypeScript
- Remover interfaces `BlogPost`, `Opportunity`, `StoreProduct`, `Partner` de `types/database.ts` se não forem mais usadas.
- Manter: `Profile`, `Startup`, `Event`, `TeamMember`, `CommunityLeader`.

### 8.2 Migrations Supabase
- As migrations antigas permanecem no histórico, mas não precisamos rodar nada novo para remover colunas/tabelas não usadas, a menos que queiramos limpar o banco.
- **Decisão:** não remover tabelas/colunas do banco agora (é destrutivo). Apenas parar de usá-las no código. Se quiser limpar depois, pode fazer via migration manual.

### 8.3 Dependências desnecessárias
- Remover pacotes não usados após as remoções:
  - `react-big-calendar` e tipos (se eventos saírem)
  - `embla-carousel-react` (se EventCarousel for removido)
  - `swr` (se não for usado em mais lugar)
  - `date-fns` (reavaliar uso; pode ainda ser usado em outros lugares)
- **Decisão:** remover apenas o que for confirmadamente não utilizado após as mudanças.

## Fase 9 — Página de Detalhes da Startup (profissionalizar)

### 9.1 Melhorar `StartupDetailsModal`
- Layout limpo: banner full-width, logo sobreposta.
- Seção "Sobre", "Programas", "Localização", "Tecnologias", "ESG", "Links", "Time".
- Tipografia melhor (tamanhos, pesos, cores).
- Espaçamento consistente.
- Animações com GSAP (fade-in dos elementos).
- Responsivo mobile-first.

### 9.2 Página dedicada `/startups/[slug]`
- **Decisão:** manter apenas o modal por enquanto. Se no futuro quiser página dedicada, pode criar, mas o modal já é profissional o suficiente para o MVP.
- Se quiser manter página dedicada: criar rota `/startups/[slug]/page.tsx` que renderiza o mesmo conteúdo do modal mas em página full.

## Fase 10 — Colaboração via PR (futuro)

### 10.1 Estrutura para a organização Monólitos Valley
- Repositório oficial: https://github.com/monolitosvalley/site (você tem acesso e gestão totais).
- Quando estiver pronto, adicionar:
  - `CONTRIBUTING.md` com regras básicas de PR.
  - `.github/pull_request_template.md`.
  - Branch protection em `main` (requer review, status checks).
- Para editar conteúdo (leaders, partners, startups):
  - Editar arquivos JSON em `data/`.
  - Abrir PR.
  - Admin aprova e merge.

### 10.2 Regras básicas para PRs
- Título descritivo.
- Descrição do que mudou e por quê.
- Para conteúdo (leaders/partners): anexar prints ou links de verificação.
- Não commitar segredos.
- Build e lint passing.

## Fase 11 — Questões de Negócio / Decisões Pendentes

| Tópico | Decisão |
|--------|---------|
| Blog, cases, artigos | Fora do site; só LinkedIn e Instagram |
| Eventos e editais | Google Calendar embed na página `/events` |
| Depoimentos | Removidos (eram fake) |
| Cadastro de usuários | Simplificar: apenas nome, email, avatar. Sem linkedin, phone, bio longa |
| Lideranças | Página pública com dados estáticos (JSON). Admin pode editar via Supabase |
| Parceiros | Estáticos (JSON) |
| Mapa de startups | Manter |
| Detalhe de startup | Modal profissional + GSAP |
| Animações | GSAP sutil em scroll e modais |
| Acesso restrito | Apenas donos de startup e admins via magic link |

## Ordem de Execução Recomendada

1. **Fase 1** (corrigir build) — bloqueador, fazer primeiro.
2. **Fase 3** (eventos → Calendar) — grande simplificação.
3. **Fase 4** (leaders estáticos) + **Fase 5** (partners estáticos).
4. **Fase 2** (home simplificada: sem testimonials, sem blog, sem event carousel, com destaque simples de startups).
5. **Fase 7** (admin simplificado).
6. **Fase 8** (limpeza de tipos, imports quebrados, dependências).
7. **Fase 6** + **Fase 9** (melhorias de UI/UX no mapa e modal).
8. **Fase 10** (colaboração via PR).

## Validação
- `npm run build` deve passar sem erros.
- `npm run lint` deve passar.
- Testar rotas principais: `/`, `/startups`, `/events`, `/leaders`.
- Testar admin: `/admin` (login como admin).

## Riscos
- Repositório: mudanças serão feitas em https://github.com/monolitosvalley/site. Certifique-se de ter backups ou branches de segurança antes de remover código massivamente.
- Remover endpoints pode quebrar features que ainda não foram mapeadas (ex: API de upload).
- Supabase: se remover colunas/tabelas do banco, pode perder dados. Decidimos não remover estruturas do banco agora.
- Google Calendar: o embed depende do calendário estar público. Verifique configurações de compartilhamento no Google Calendar.
