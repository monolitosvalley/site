# Plano: Ajustes gerais do site Monólitos Valley

## 1. Hardcode dados do Supabase em JSON

### 1.1 Atualizar `data/leaders.json`
Substituir os 4 registros de exemplo pelos 8 registros reais do Supabase (`community_leaders` + `profiles`), incluindo:
- `id`, `full_name`, `role_title`, `startup_name`, `linkedin_url`, `instagram_url`
- `profiles.full_name`, `profiles.email`, `profiles.avatar_url` (URLs do storage do Supabase)

### 1.2 Atualizar `data/partners.json`
Substituir os 3 registros de exemplo pelos 8 registros reais do Supabase (`partners`), incluindo:
- `id`, `name`, `description`, `logo_url`, `website`, `category`, `approved`, `created_at`

---

## 2. Renomear rotas públicas para português

### 2.1 Mover/renomear diretórios de rota
- `app/(public)/startups/` → `app/(public)/negocios/`
- `app/(public)/startups/[slug]/` → `app/(public)/negocios/[slug]/`
- `app/(public)/events/` → `app/(public)/eventos/`
- `app/(public)/leaders/` → `app/(public)/lideres/`

### 2.2 Atualizar referências em código
- `Navbar.tsx`: links de navegação (`/startups` → `/negocios`, `/events` → `/eventos`, `/leaders` → `/lideres`)
- `Footer.tsx`: se houver links
- `HomePage`: link "Ver todas" (`/startups` → `/negocios`)
- `StartupHighlightList`: href dos cards (`/startups` → `/negocios`)
- `StartupCard`: `router.push(/startups/${slug})` → `/negocios/${slug}`
- `StartupDetailsModal`: `window.open(/startups/${slug})` → `/negocios/${slug}`
- `StartupPageContent`: fetch `/api/startups?slug=` (continua igual, só a rota pública muda)
- Quaisquer outros hardcoded `/startups`, `/events`, `/leaders`

### 2.3 Manter API routes
- `app/api/startups/` continua como está (endpoint interno)
- Apenas as rotas públicas mudam

---

## 3. Adicionar animações GSAP em outras páginas

### 3.1 Páginas a animar
- **`/eventos`**: animar o título, iframe e texto de instrução com `AnimateOnScroll` ou `gsap.fromTo`
- **`/lideres`**: já usa `LeadersGrid` com ScrollTrigger, adicionar animação no hero (título)
- **`/negocios`**: adicionar `AnimateOnScroll` nos filtros e grid
- **`/negocios/[slug]`**: animar seções (Sobre, Meta, Tecnologias, ESG, Links, Time) com stagger
- **Auth pages** (`/login`, `/cadastro`, etc.): animar cards/formulários
- **Admin page**: animar tabs e cards de startups
- **Terms/Privacy/Cookies**: animar seções com scroll

### 3.2 Padrão
- Usar `AnimateOnScroll` onde já existe
- Usar `gsap.fromTo` com `ScrollTrigger` em elementos específicos
- Manter consistência com easing `power2.out` e durações entre 0.5-0.7s

---

## 4. Limpar avisos de lint (somente arquivos tocados)

Corrigir erros/warnings apenas nos arquivos que forem modificados pelo plano:
- `Navbar.tsx`
- `Footer.tsx`
- `HomePage` (`app/page.tsx`)
- `StartupHighlightList.tsx`
- `StartupCard.tsx`
- `StartupDetailsModal.tsx`
- `StartupPageContent.tsx`
- Arquivos de rota movidos: `app/(public)/negocios/page.tsx`, `app/(public)/negocios/[slug]/page.tsx`, `app/(public)/negocios/[slug]/StartupPageContent.tsx`, `app/(public)/eventos/page.tsx`, `app/(public)/lideres/page.tsx`
- `data/leaders.json` e `data/partners.json` (se necessário)

Não alterar arquivos não tocados (ex: `CookieConsent.tsx`, `LocationPicker.tsx`, etc.).

---

## 5. Profissionalizar página dedicada `/negocios/[slug]`

Como a página `/startups/[slug]` já existe (será movida para `/negocios/[slug]`), o foco é aprimorá-la:
- Adicionar mais animações GSAP nas seções
- Melhorar layout e responsividade
- Adicionar breadcrumb ou navegação melhorada
- Melhorar SEO com metadados mais ricos
- Adicionar schema.org structured data (se aplicável)
- Melhorar experiência mobile

O modal (`StartupDetailsModal`) continua disponível para uso no admin, mas a página pública é o foco.

---

## 6. GitHub Actions para deploy na Vercel

### 6.1 Criar workflow
Arquivo: `.github/workflows/vercel-deploy.yml`

Configuração:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 6.2 Secrets necessários no GitHub
O usuário deve adicionar no repositório GitHub (Settings → Secrets and variables → Actions):
- `VERCEL_TOKEN`: token da conta Vercel
- `VERCEL_ORG_ID`: ID da org/conta Vercel
- `VERCEL_PROJECT_ID`: ID do projeto Vercel

### 6.3 Documentar no `.env.example`
Adicionar seção de deploy:
```env
# Vercel Deployment (para referência)
# VERCEL_TOKEN=your-vercel-token
# VERCEL_ORG_ID=your-org-id
# VERCEL_PROJECT_ID=your-project-id
```

---

## Ordem de execução recomendada

1. Hardcode dados em JSON (leaders + partners)
2. Renomear rotas públicas (diretórios + referências)
3. Profissionalizar `/negocios/[slug]`
4. Adicionar animações GSAP nas páginas afetadas
5. Limpar lint nos arquivos tocados
6. Configurar GitHub Actions + documentar secrets

---

## Riscos e considerações

- **Rotas movidas**: garantir que não há links internos quebrados
- **Dados hardcoded**: se os dados mudarem no Supabase, o frontend não reflete automaticamente (aceitável por ser "coisas simples" segundo o usuário)
- **GitHub Actions**: usuário precisa criar os secrets no GitHub antes do primeiro deploy
- **Lint**: alguns arquivos antigos não serão tocados, então warnings permanecem (escolha do usuário)
