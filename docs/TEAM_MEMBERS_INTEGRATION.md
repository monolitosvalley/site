# Integração do TeamMembersForm - Monólitos Valley

## 📍 Localização e Uso

### Onde será utilizado?

O `TeamMembersForm` será utilizado na **página de perfil do usuário**, especificamente na **aba "Minha Startup"** (`app/(auth)/profile/page.tsx`).

### Como será associado a uma startup?

1. O usuário acessa `/profile`
2. Clica na aba "Minha Startup"
3. O formulário carrega os membros da startup do usuário
4. O `startupId` é obtido do perfil do usuário autenticado

## 🏗️ Arquitetura

### Fluxo de Dados

```
Profile Page
    ↓
StartupForm (edita dados da startup)
    ↓
TeamMembersForm (gerencia membros)
    ↓
API Route: /api/team-members
    ↓
Database: team_members table
```

### Associação com Startup

```typescript
// Na página de perfil, você terá:
const startup = await getStartupByOwnerId(userId)
const teamMembers = await getTeamMembers(startup.id)

// Passar para o componente:
<TeamMembersForm
  startupId={startup.id}
  members={teamMembers}
  onMembersChange={handleMembersChange}
/>
```

## 🔄 Fluxo de Operações

### 1. Adicionar Membro

```
Usuário clica "Adicionar Membro"
    ↓
Formulário abre
    ↓
Usuário seleciona um membro existente (do banco de profiles)
    ↓
Preenche função e redes sociais
    ↓
Clica "Adicionar"
    ↓
POST /api/team-members
    ↓
Cria registro em team_members
    ↓
Atualiza lista na página
```

### 2. Remover Membro

```
Usuário clica ícone de lixeira
    ↓
DELETE /api/team-members/{memberId}
    ↓
Remove registro do banco
    ↓
Atualiza lista na página
```

## 📋 Dados Necessários

### TeamMember

- `id`: UUID (gerado automaticamente)
- `startup_id`: UUID (da startup do usuário)
- `profile_id`: UUID (do membro selecionado)
- `role`: string (CEO, CTO, Designer, etc)
- `github`: string (URL opcional)
- `behance`: string (URL opcional)
- `portfolio`: string (URL opcional)
- `lattes`: string (URL opcional)
- `instagram`: string (URL opcional)
- `outros`: string (URL opcional)

## 🔐 Segurança

### RLS Policies (Row Level Security)

- ✅ Qualquer um pode **visualizar** membros de uma startup
- ✅ Apenas o **owner da startup** pode **adicionar** membros
- ✅ Apenas o **owner da startup** pode **remover** membros
- ✅ Apenas o **owner da startup** pode **editar** membros

## 🚀 Próximos Passos

### 1. Criar API Routes

```typescript
// POST /api/team-members
// GET /api/team-members?startupId=...
// DELETE /api/team-members/[memberId]
// PUT /api/team-members/[memberId]
```

### 2. Melhorar o Formulário

- [ ] Adicionar seletor de membros existentes (autocomplete)
- [ ] Validação de URLs
- [ ] Feedback visual de sucesso/erro
- [ ] Reordenação de membros (drag & drop)

### 3. Integrar na Página de Perfil

```typescript
// app/(auth)/profile/page.tsx
import { TeamMembersForm } from "@/components/features/startups/TeamMembersForm";

// Na aba "Minha Startup":
<TeamMembersForm
  startupId={startup.id}
  members={teamMembers}
  onMembersChange={handleMembersChange}
/>;
```

### 4. Exibir na Modal de Startup

- Adicionar seção de membros na `StartupDetailsModal`
- Usar o componente `TeamMembers` para exibição

## 📊 Exemplo de Uso Completo

```typescript
// app/(auth)/profile/page.tsx
"use client";

import { TeamMembersForm } from "@/components/features/startups/TeamMembersForm";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [startup, setStartup] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    // Buscar startup do usuário
    const fetchStartup = async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setStartup(data.startup);

      // Buscar membros do time
      const membersRes = await fetch(
        `/api/team-members?startupId=${data.startup.id}`
      );
      const membersData = await membersRes.json();
      setTeamMembers(membersData);
    };

    fetchStartup();
  }, []);

  const handleMembersChange = (newMembers) => {
    setTeamMembers(newMembers);
  };

  return (
    <div>
      {/* Outras abas... */}
      <TeamMembersForm
        startupId={startup?.id}
        members={teamMembers}
        onMembersChange={handleMembersChange}
      />
    </div>
  );
}
```

## 🎯 Benefícios

- ✅ Gerenciamento centralizado de membros
- ✅ Reutilizável em múltiplas páginas
- ✅ Seguro com RLS policies
- ✅ Interface intuitiva
- ✅ Suporte a múltiplas redes sociais
- ✅ Fácil de estender

## 📝 Notas

- O formulário atualmente é um skeleton - precisa de integração com API
- Os ícones deprecados precisam ser substituídos
- Considerar adicionar um modal para selecionar membros existentes
- Adicionar validação de URLs nas redes sociais
