# Guia de Contribuição

Obrigado por considerar contribuir com o Portal Monólitos Valley! 🎉

## 📋 Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

## 🚀 Como Contribuir

### Reportando Bugs

1. Verifique se o bug já foi reportado nas Issues
2. Se não, crie uma nova Issue com:
   - Título claro e descritivo
   - Passos para reproduzir o problema
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Informações do ambiente (browser, OS, etc)

### Sugerindo Melhorias

1. Abra uma Issue descrevendo:
   - O problema que a melhoria resolve
   - Como você imagina a solução
   - Exemplos de uso (se aplicável)

### Pull Requests

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Faça suas alterações
4. Commit com mensagens claras (`git commit -m 'Add: nova funcionalidade X'`)
5. Push para a branch (`git push origin feature/MinhaFeature`)
6. Abra um Pull Request

## 💻 Padrões de Código

### TypeScript

- Use TypeScript para todo código novo
- Defina tipos explícitos sempre que possível
- Evite `any` - use `unknown` se necessário

### Componentes React

```tsx
// ✅ Bom
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ Evite
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Nomenclatura

- **Componentes**: PascalCase (`StartupCard.tsx`)
- **Funções**: camelCase (`fetchStartups()`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Arquivos**: kebab-case para utilitários (`api-client.ts`)

### Estrutura de Arquivos

```
components/
  features/
    startups/
      StartupCard.tsx       # Componente
      StartupGrid.tsx
      index.ts              # Exports
```

### Commits

Use prefixos claros:

- `Add:` nova funcionalidade
- `Fix:` correção de bug
- `Update:` atualização de código existente
- `Refactor:` refatoração sem mudança de comportamento
- `Docs:` documentação
- `Style:` formatação, sem mudança de código
- `Test:` adição ou correção de testes

Exemplos:

```
Add: componente de mapa de startups
Fix: erro ao fazer upload de avatar
Update: validação de formulário de startup
Refactor: extração de lógica de autenticação
```

## 🧪 Testes

- Teste suas alterações localmente antes de fazer PR
- Verifique se o build passa (`npm run build`)
- Execute o lint (`npm run lint`)

## 📝 Documentação

- Documente funções complexas com JSDoc
- Atualize o README.md se necessário
- Adicione comentários para lógica não óbvia

```tsx
/**
 * Calcula a distância entre duas coordenadas geográficas
 * @param lat1 Latitude do ponto 1
 * @param lon1 Longitude do ponto 1
 * @param lat2 Latitude do ponto 2
 * @param lon2 Longitude do ponto 2
 * @returns Distância em quilômetros
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Implementação...
}
```

## 🎨 UI/UX

- Siga o design system do shadcn/ui
- Mantenha consistência visual
- Teste responsividade (mobile, tablet, desktop)
- Considere acessibilidade (ARIA labels, contraste, navegação por teclado)

## ⚡ Performance

- Use `Image` do Next.js para imagens
- Implemente lazy loading quando apropriado
- Evite re-renders desnecessários
- Use `useMemo` e `useCallback` com sabedoria

## 🔒 Segurança

- Nunca commite credenciais ou chaves de API
- Use variáveis de ambiente para dados sensíveis
- Valide inputs do usuário
- Sanitize dados antes de renderizar

## ❓ Dúvidas

Se tiver dúvidas, abra uma Issue ou entre em contato com os mantenedores.

Obrigado por contribuir! 🚀
