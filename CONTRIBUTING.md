# Contribuindo para o Monólitos Valley

Obrigado por contribuir com o ecossistema Monólitos Valley! 🚀

Este documento define as regras básicas para colaborar no repositório `monolitosvalley/site`.

## Como contribuir

### 1. Issues
- Verifique se a issue já existe antes de criar uma nova.
- Descreva o problema ou sugestão com clareza.
- Adicione prints ou exemplos quando possível.

### 2. Branches
- `main` é protegida. Não faça push direto.
- Crie uma branch a partir de `main` com nome descritivo:
  - `fix/descricao-curta`
  - `feature/descricao-curta`
  - `chore/descricao-curta`

### 3. Commits
- Mensagens curtas e imperativas: `feat: add startup filter`
- Prefixos recomendados: `feat`, `fix`, `chore`, `docs`, `refactor`
- Não commitar segredos (`.env`, tokens, chaves)

### 4. Pull Requests
- Abra o PR apontando para `main`.
- Preencha o template do PR.
- Garanta que o build e o lint passem localmente.
- Para conteúdo (leaders, partners), anexe prints ou links de verificação.

### 5. Regras de conteúdo
- Conteúdo de texto (nomes, descrições) deve ser em português.
- Evite conteúdo fake ou sem verificação.
- Imagens devem ter direitos de uso.

### 6. Estrutura do projeto
- Páginas públicas: `app/(public)/` (`negocios/`, `agenda/`, `lideres/`)
- Admin: `app/admin/`
- API routes: `app/api/`
- Componentes reutilizáveis: `components/`
- Dados estáticos: `data/`
- Tipos: `types/database.ts`

## Build e validação

```bash
npm install
npm run build
npm run lint
```

## Contato

Em caso de dúvidas, abra uma issue ou entre em contato com os mantenedores.
