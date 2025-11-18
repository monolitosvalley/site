# Próximos Passos - Team Members

## ✅ Migrations Aplicadas com Sucesso

### 1. **019_create_team_members.sql**

- ✅ Tabela `team_members` criada
- ✅ Índices criados para performance
- ✅ Trigger para `updated_at` configurado
- ✅ RLS policies configuradas:
  - Qualquer um pode visualizar membros
  - Apenas owner da startup pode adicionar/editar/remover

### 2. **020_add_cnpj_slug_to_startups.sql**

- ✅ Coluna `cnpj` adicionada à tabela `startups`
- ✅ Coluna `slug` adicionada (única)
- ✅ Função `generate_slug()` criada
- ✅ Trigger para gerar slug automaticamente
- ✅ Slugs gerados para startups existentes

### 3. **021_create_team_members_bucket.sql**

- ✅ Bucket `team-members` criado
- ✅ RLS policies configuradas:
  - Leitura pública
  - Upload apenas para autenticados
  - Update/Delete apenas para autenticados

## 🔧 O Que Ainda Precisa Ser Implementado

### 1. **API Routes para Team Members**

Criar os seguintes endpoints:

#### GET /api/team-members

```typescript
// Buscar membros de uma startup
// Query params: startupId
// Retorna: array de TeamMember com profile incluído
```

#### POST /api/team-members

```typescript
// Adicionar novo membro
// Body: { startup_id, profile_id, role, github, behance, portfolio, lattes, instagram, outros }
// Validar: usuário é owner da startup
```

#### PUT /api/team-members/[memberId]

```typescript
// Atualizar membro
// Body: { role, github, behance, portfolio, lattes, instagram, outros }
// Validar: usuário é owner da startup
```

#### DELETE /api/team-members/[memberId]

```typescript
// Remover membro
// Validar: usuário é owner da startup
```

### 2. **Upload de Foto para Membros**

Adicionar no `TeamMembersForm`:

- Campo de upload de foto
- Preview da foto
- Integração com `/api/upload` usando bucket `team-members`
- Salvar URL da foto no perfil do membro

### 3. **Melhorias no TeamMembersForm**

- [ ] Adicionar seletor de membros existentes (autocomplete)
  - Buscar profiles por nome/email
  - Evitar adicionar o mesmo membro duas vezes
- [ ] Adicionar upload de foto

  - Campo de upload
  - Preview
  - Crop/resize opcional

- [ ] Validação de URLs

  - Validar formato de URLs das redes sociais
  - Feedback visual de erro

- [ ] Reordenação de membros

  - Drag & drop para reordenar
  - Salvar `position_order`

- [ ] Feedback visual
  - Toast de sucesso/erro
  - Loading states
  - Confirmação antes de remover

### 4. **Exibir Membros na Modal de Startup**

Adicionar seção no `StartupDetailsModal`:

```typescript
{
  /* Team Members Section */
}
{
  teamMembers.length > 0 && (
    <div>
      <h3 className="font-semibold text-sm mb-3">Time</h3>
      <TeamMembers members={teamMembers} />
    </div>
  );
}
```

### 5. **Buscar Membros ao Abrir Modal**

No `StartupGrid.tsx`:

```typescript
const handleViewDetails = async (startup: Startup) => {
  setSelectedStartup(startup);

  // Buscar membros do time
  const res = await fetch(`/api/team-members?startupId=${startup.id}`);
  const data = await res.json();
  setTeamMembers(data.data || []);

  setModalOpen(true);
};
```

## 📋 Estrutura de Dados

### TeamMember

```typescript
{
  id: string
  startup_id: string
  profile_id: string
  role: string // "CEO", "CTO", "Designer", etc
  github?: string
  behance?: string
  portfolio?: string
  lattes?: string
  instagram?: string
  outros?: string
  position_order: number
  created_at: string
  updated_at: string
  profile?: Profile // Incluído via join
}
```

## 🎯 Prioridades

1. **Alta**: Criar API routes básicas (GET, POST, DELETE)
2. **Alta**: Integrar API no TeamMembersForm
3. **Média**: Adicionar upload de foto
4. **Média**: Exibir membros na modal de startup
5. **Baixa**: Reordenação drag & drop
6. **Baixa**: Autocomplete de membros

## 🔐 Segurança

- ✅ RLS policies configuradas
- ✅ Apenas owner pode gerenciar membros
- ✅ Qualquer um pode visualizar
- ⚠️ Validar no backend que profile_id existe
- ⚠️ Validar no backend que startup_id pertence ao usuário

## 📝 Notas

- Team members é **opcional** - só aparece se startup existe
- Fotos dos membros vão para bucket `team-members`
- Slug é gerado automaticamente ao criar/editar startup
- CNPJ é opcional mas será exibido na modal se preenchido
