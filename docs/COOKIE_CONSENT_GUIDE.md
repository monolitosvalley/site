# Guia do Sistema de Consentimento de Cookies

## 🍪 Como Funciona

### Quando o Banner Aparece

O banner de consentimento de cookies aparece **automaticamente** quando:

1. **Primeira visita**: Usuário acessa o site pela primeira vez
2. **Sem consentimento salvo**: Não há registro de consentimento no localStorage
3. **Após 1 segundo**: Delay de 1 segundo após o carregamento da página

### Quando NÃO Aparece

O banner **não aparece** quando:

- Usuário já fez uma escolha anteriormente (consentimento salvo)
- Dados estão armazenados em `localStorage` com a chave `cookie-consent`

## 📍 Onde Está Implementado

### Arquivo: `components/CookieConsent.tsx`

**Localização no código**:

```typescript
// app/layout.tsx (linha ~90)
<div className="flex min-h-screen flex-col">
  <Navbar user={user} />
  <main className="flex-1">{children}</main>
  <Footer />
  <CookieConsent /> // ← Banner de consentimento
</div>
```

**Renderização**: O componente é renderizado em **todas as páginas** do site através do `layout.tsx`

## 🎯 Fluxo de Funcionamento

### 1. Primeira Visita

```
Usuário acessa o site
    ↓
Aguarda 1 segundo
    ↓
Banner aparece na parte inferior
    ↓
Usuário vê 3 opções:
  - Aceitar Todos
  - Apenas Essenciais
  - Personalizar
```

### 2. Escolha do Usuário

#### Opção A: Aceitar Todos

```typescript
{
  essential: true,      // Sempre true
  analytics: true,      // ✅ Ativado
  functionality: true   // ✅ Ativado
}
```

- Google Analytics ativado
- Microsoft Clarity ativado
- Cookies de funcionalidade ativados
- Banner desaparece
- Preferências salvas no localStorage

#### Opção B: Apenas Essenciais

```typescript
{
  essential: true,      // Sempre true
  analytics: false,     // ❌ Desativado
  functionality: false  // ❌ Desativado
}
```

- Apenas cookies essenciais (autenticação, segurança)
- Analytics desativados
- Banner desaparece
- Preferências salvas no localStorage

#### Opção C: Personalizar

- Abre modal de configurações
- Usuário escolhe individualmente:
  - ✅ Cookies Essenciais (sempre ativados, não pode desativar)
  - ⚙️ Cookies de Analytics (opcional)
  - ⚙️ Cookies de Funcionalidade (opcional)
- Salva preferências customizadas

### 3. Armazenamento

**localStorage**:

```javascript
// Preferências
localStorage.setItem(
  "cookie-consent",
  JSON.stringify({
    essential: true,
    analytics: true,
    functionality: false,
  })
);

// Data do consentimento
localStorage.setItem("cookie-consent-date", "2024-11-18T10:30:00.000Z");
```

## 🔧 Integração com Ferramentas

### Google Analytics

**Quando ativado** (analytics: true):

```javascript
window.gtag("consent", "update", {
  analytics_storage: "granted",
});
```

**Quando desativado** (analytics: false):

```javascript
window.gtag("consent", "update", {
  analytics_storage: "denied",
});
```

### Microsoft Clarity

**Quando ativado**:

```javascript
window.clarity("consent");
```

**Quando desativado**: Clarity não é inicializado

## 📊 Estados do Banner

### Estado 1: Visível

```
┌─────────────────────────────────────────────┐
│ 🍪 Nós usamos cookies                       │
│                                             │
│ Usamos cookies essenciais para...          │
│                                             │
│ [Aceitar Todos] [Apenas Essenciais]        │
│ [⚙️ Personalizar]                     [X]   │
└─────────────────────────────────────────────┘
```

### Estado 2: Modal de Configurações

```
┌─────────────────────────────────────────────┐
│ 🍪 Preferências de Cookies            [X]   │
├─────────────────────────────────────────────┤
│                                             │
│ ✅ Cookies Essenciais      [ON] (bloqueado) │
│    Necessários para autenticação...         │
│                                             │
│ ⚙️ Cookies de Analytics     [OFF]           │
│    Google Analytics e Clarity...            │
│                                             │
│ ⚙️ Cookies de Funcionalidade [OFF]          │
│    Preferências e personalização...         │
│                                             │
│              [Cancelar] [Salvar]            │
└─────────────────────────────────────────────┘
```

### Estado 3: Oculto

Banner não aparece - consentimento já foi dado

## 🔍 Como Testar

### Teste 1: Primeira Visita

1. Abra o site em modo anônimo/privado
2. Aguarde 1 segundo
3. Banner deve aparecer na parte inferior

### Teste 2: Aceitar Todos

1. Clique em "Aceitar Todos"
2. Banner desaparece
3. Abra DevTools → Application → Local Storage
4. Verifique `cookie-consent` = `{"essential":true,"analytics":true,"functionality":true}`

### Teste 3: Apenas Essenciais

1. Limpe localStorage
2. Recarregue a página
3. Clique em "Apenas Essenciais"
4. Verifique `cookie-consent` = `{"essential":true,"analytics":false,"functionality":false}`

### Teste 4: Personalizar

1. Limpe localStorage
2. Recarregue a página
3. Clique em "Personalizar"
4. Modal abre
5. Ative/desative switches
6. Clique em "Salvar Preferências"
7. Verifique localStorage

### Teste 5: Persistência

1. Faça uma escolha
2. Navegue para outra página
3. Banner não deve aparecer novamente
4. Recarregue o site
5. Banner continua oculto

## 🎨 Aparência Visual

### Banner

- **Posição**: Fixed bottom (parte inferior da tela)
- **Largura**: 100% da tela
- **Cor**: Branco com borda superior amber
- **Sombra**: Shadow-2xl para destaque
- **Z-index**: 50 (acima de outros elementos)

### Botões

- **Aceitar Todos**: Amber (bg-amber-600)
- **Apenas Essenciais**: Outline (border-stone-300)
- **Personalizar**: Ghost (text-stone-700)

### Modal

- **Largura máxima**: 2xl (672px)
- **Switches**: Amber quando ativados
- **Cards**: Coloridos por categoria (verde, stone)

## 🔄 Ciclo de Vida

```
1. Página carrega
   ↓
2. useEffect verifica localStorage
   ↓
3a. Se tem consentimento → Aplica preferências → Não mostra banner
   ↓
3b. Se não tem → Aguarda 1s → Mostra banner
   ↓
4. Usuário faz escolha
   ↓
5. Salva no localStorage
   ↓
6. Aplica preferências (ativa/desativa analytics)
   ↓
7. Oculta banner
   ↓
8. Próximas visitas → Não mostra banner
```

## 📝 Dados Armazenados

### localStorage Keys

1. **cookie-consent**

   - Tipo: JSON string
   - Conteúdo: `{ essential, analytics, functionality }`
   - Exemplo: `{"essential":true,"analytics":true,"functionality":false}`

2. **cookie-consent-date**

   - Tipo: ISO string
   - Conteúdo: Data/hora do consentimento
   - Exemplo: `"2024-11-18T10:30:00.000Z"`

3. **functionality-enabled** (se funcionalidade ativada)
   - Tipo: String
   - Conteúdo: `"true"`

## 🚀 Como Alterar Preferências

### Método 1: Limpar localStorage

```javascript
// No console do navegador
localStorage.removeItem("cookie-consent");
localStorage.removeItem("cookie-consent-date");
// Recarregue a página
```

### Método 2: Adicionar botão de gerenciamento

```typescript
// Futuro: Adicionar em configurações do usuário
<Button
  onClick={() => {
    localStorage.removeItem("cookie-consent");
    window.location.reload();
  }}
>
  Gerenciar Cookies
</Button>
```

## ⚠️ Importante

1. **Cookies Essenciais**: Sempre ativados, não podem ser desativados
2. **Primeira Visita**: Banner sempre aparece
3. **Persistência**: Escolha é salva permanentemente até ser alterada
4. **Analytics**: Só funciona se usuário consentir
5. **Conformidade**: Sistema atende LGPD e GDPR

## 🔗 Links Relacionados

- Política de Privacidade: `/privacy`
- Termos de Uso: `/terms`
- Política de Cookies: `/cookies`

## 📱 Responsividade

- **Mobile**: Banner ocupa largura total, botões empilham
- **Tablet**: Layout horizontal mantido
- **Desktop**: Layout completo com todos os elementos visíveis

## ✅ Checklist de Funcionamento

- [x] Banner aparece na primeira visita
- [x] Banner não aparece se já houver consentimento
- [x] Botão "Aceitar Todos" funciona
- [x] Botão "Apenas Essenciais" funciona
- [x] Botão "Personalizar" abre modal
- [x] Modal permite configuração granular
- [x] Preferências são salvas no localStorage
- [x] Google Analytics é ativado/desativado conforme escolha
- [x] Microsoft Clarity é ativado/desativado conforme escolha
- [x] Banner pode ser fechado (X)
- [x] Links para políticas funcionam
- [x] Design responsivo
- [x] Acessibilidade (aria-labels)
