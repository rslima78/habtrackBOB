# Design Doc: Subobjetivos Segmentados em Etapas (Multi-Part Sub-Goals)

**Data:** 2026-08-19  
**Status:** Aprovado  
**Contexto:** Habit Tracker Gamificado (Htracker)

---

## 1. Visão Geral
Adicionar suporte a um novo tipo de subobjetivo/micro-missão dividido em partes (etapas/barras de 2 a 6). 
Exemplo de uso: "3 dias sem beber refrigerante", "4 treinos de perna", "5 sessões de leitura de 15min".

### Comportamento Principal:
- **Criação:** O usuário escolhe o tipo ("Meta Simples" vs "Em Etapas"), número de partes (2 a 6) e o valor de XP.
- **Interação:**
  - **Clique Rápido (Tap):** Preenche a próxima barra (+1). Ao preencher todas as barras, o usuário ganha o XP definido com efeitos comemorativos (áudio + partículas) e o progresso é automaticamente zerado para permitir que o usuário inicie um novo ciclo.
  - **Clique Longo (Pressionar e Segurar):** Reduz -1 barra caso o usuário tenha clicado por engano (prevenção de cliques acidentais).
- **Consistência Visual:** Renderização com barras de energia neon verdes nos cards em todas as telas onde subobjetivos aparecem (Aba Subobjetivos, Seções de Hábitos individuais e Dashboard).

---

## 2. Modelo de Dados

Em `src/types/index.ts`:

```typescript
export type SubGoalType = 'checkbox' | 'segmented';

export interface SubGoal {
  id: string;
  habitCategory: HabitCategory;
  title: string;
  periodicity: 'daily' | 'weekly' | 'one-time';
  xpValue: number;
  completedDates: string[]; // Usado para checkboxes diárias/histórico
  isCompletedOneTime?: boolean;
  
  // Novos campos:
  type?: SubGoalType;          // 'checkbox' (padrão) | 'segmented'
  targetParts?: number;        // Quantidade total de partes (2 a 6)
  currentParts?: number;       // Partes preenchidas no ciclo atual (0 a targetParts)
  totalCompletions?: number;   // Quantidade de ciclos concluídos
  createdAt: string;
}
```

---

## 3. Arquitetura e Componentes

### 3.1 Componente `SubGoalCard.tsx`
Componente unificado e reutilizável para renderização de qualquer subobjetivo (`checkbox` ou `segmented`):
- **Props:**
  - `subGoal: SubGoal`
  - `onProgress: (id: string, delta: 1 | -1) => void`
  - `onDelete?: (id: string) => void`
  - `showDelete?: boolean`
  - `compact?: boolean`
- **Gestão de Toque:**
  - Manipuladores `onTouchStart`, `onTouchEnd`, `onMouseDown`, `onMouseUp`, `onMouseLeave` com temporizador de 500ms para diferenciar clique simples (avanço) de toque longo (recuo).
- **Estilização das Barras Segmentadas:**
  - Grid de 2 a 6 barras horizontais.
  - Barras inativas: `bg-slate-800/80 border border-slate-700/60`.
  - Barras ativas: `bg-gradient-to-r from-emerald-500 to-teal-400 border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse-subtle`.
  - Animação de conclusão de ciclo: brilho dourado/esmeralda seguido de transição suave de reset para 0.

### 3.2 Modal de Criação em `SubGoalsSection.tsx`
- Seletor de Tipo:
  - 🔘 **Check Diário/Simples (1 Passo)**
  - 🔘 **Em Etapas / Ciclos (2 a 6 Partes)**
- Quando "Em Etapas" estiver ativo:
  - Seletor de pílulas: `[2] [3] [4] [5] [6] partes`
  - Campo numérico de XP por ciclo completado.
  - Categoria do hábito (Treinos, Leitura, Orçamento, Alimentação, Geral).

### 3.3 Integração em `App.tsx` e Telas de Hábitos
- Atualização do manipulador `handleProgressSubGoal(id: string, delta: 1 | -1)`.
- Uso do `SubGoalCard` em:
  - `SubGoalsSection.tsx`
  - `WorkoutsSection.tsx`
  - `ReadingSection.tsx`
  - `BudgetSection.tsx`
  - `FoodSection.tsx`
  - `NextMilestoneCard.tsx` (Dashboard)

---

## 4. Plano de Teste e Validação
- Criação de subobjetivos de 2, 3, 4, 5 e 6 partes.
- Teste de clique rápido incrementando de 0 até o total.
- Validação de premiação de XP e comemoração sonora no último clique, seguida de reset para 0.
- Teste de clique longo reduzindo uma barra.
- Validação da persistência no LocalStorage após recarregar a página.
- Verificação de compatibilidade com subobjetivos pré-existentes.
