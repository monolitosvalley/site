# Atualizações do Hero Section - Monólitos Valley

## 🎯 Mudanças Realizadas

### 1. Texto Animado Inclusivo

Criado novo componente `AnimatedWelcome` que alterna entre variações criativas e inclusivas:

- **Bem-vindo** (tradicional masculino)
- **Bem-vinda** (tradicional feminino)
- **Bem-vinde** (inclusivo neutro)
- **Bem-vindx** (inclusivo com x)
- **Bem-vindos** (plural masculino)
- **Bem-vindas** (plural feminino)
- **Bem-vindxs** (plural inclusivo)
- **Bem-vindo à** (com preposição)
- **Bem-vinda à** (com preposição)
- **Bem-vinde à** (com preposição)

**Comportamento:**

- Muda a cada 3 segundos
- Transição suave com duração de 500ms
- Totalmente responsivo
- Acessível e inclusivo

### 2. Logo Centralizada e Maior

- Logo agora é o destaque principal do hero
- Centralizada horizontalmente
- Tamanho responsivo:
  - Mobile: `h-20` (80px)
  - Desktop: `h-28` (112px)
- Mantém proporções originais com `w-auto`
- Prioridade de carregamento com `priority`

### 3. Layout Melhorado

```
┌─────────────────────────────────┐
│                                 │
│    Bem-vindo/Bem-vinda/... à   │
│                                 │
│      [LOGO MONÓLITOS VALLEY]    │
│                                 │
│    Conectando startups...       │
│    Transforme sua ideia...      │
│                                 │
│  [Botão CTA] [Botão Secundário] │
│                                 │
│  50+ Startups | 200+ Membros... │
│                                 │
└─────────────────────────────────┘
```

## 📱 Responsividade

- **Mobile (< 768px):**

  - Logo: 80px de altura
  - Texto: 5xl
  - Espaçamento reduzido

- **Desktop (≥ 768px):**
  - Logo: 112px de altura
  - Texto: 7xl
  - Espaçamento amplo

## ♿ Acessibilidade

- Texto animado com transição suave
- Sem movimento brusco que cause desconforto
- Contraste adequado (WCAG AA)
- Semântica HTML correta
- Alt text na imagem

## 🎨 Cores

- Texto "Bem-vindo/a/e": Branco
- Preposição "à": Branco
- Logo: Cores originais preservadas
- Fundo: Gradiente stone-900 → stone-800 → stone-900

## 📊 Performance

- Componente `AnimatedWelcome` é client-side (usa hooks)
- `HeroSection` é client-side (parallax do mouse)
- Logo com `priority` para carregamento rápido
- Sem impacto significativo no Core Web Vitals

## 🔧 Componentes

### AnimatedWelcome

```tsx
<AnimatedWelcome className="text-amber-400" />
```

**Props:**

- `className?: string` - Classes Tailwind adicionais

### HeroSection

```tsx
<HeroSection
  subtitle="..."
  cta={{ text: "...", href: "..." }}
  stats={[...]}
/>
```

**Props:**

- `subtitle: string` - Subtítulo principal
- `cta?: { text: string; href: string }` - Call-to-action
- `stats?: Array<{ value: string; label: string }>` - Estatísticas

## 🚀 Próximos Passos

1. Testar em diferentes navegadores
2. Validar performance com Lighthouse
3. Testar com screen readers
4. Considerar adicionar mais variações de texto
5. Adicionar animação de entrada (fade-in)

## 📝 Notas

- O componente `AnimatedWelcome` pode ser reutilizado em outras páginas
- O intervalo de 3 segundos pode ser ajustado conforme necessário
- As variações podem ser expandidas com mais opções criativas
