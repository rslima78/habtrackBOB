# Subobjetivos Segmentados em Partes (Multi-Part Sub-Goals) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar um novo tipo de subobjetivo segmentado em 2 a 6 partes com barras visuais neon verdes, preenchimento sequencial por clique rápido, recuo por clique longo para prevenir erros acidentais, premiação de XP no fechamento de cada ciclo e reset automático para repetir o objetivo.

**Architecture:** 
- Estender `SubGoal` em `src/types/index.ts` com campos opcionais para tipo (`checkbox` vs `segmented`), `targetParts` (2 a 6), `currentParts` (0 a targetParts) e `totalCompletions`.
- Criar o componente modular `SubGoalCard.tsx` em `src/components/subgoals/SubGoalCard.tsx` encapsulando a renderização visual das barras de energia/progresso, animação de conclusão, sons táteis e detecção de toque curto vs longo.
- Atualizar o modal de criação em `SubGoalsSection.tsx` para permitir escolher entre "Meta Simples" e "Em Etapas (2 a 6)", selecionador de partes e valor de XP.
- Atualizar `App.tsx` e as seções de hábitos (`WorkoutsSection`, `ReadingSection`, `BudgetSection`, `FoodSection`) e `NextMilestoneCard` para consumir o `SubGoalCard`.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide React, Web Audio API (`audioService.ts`), Vite.

## Global Constraints
- Sem quebra de compatibilidade com subobjetivos pré-existentes no LocalStorage.
- Barras acesas devem ter visual vibrante em verde esmeralda com brilho neon condizente com a estética gamer do app.
- Feedback sonoro preciso: `playPop` ao avançar parte, `playMilestone` ou `playLevelUp` ao completar ciclo, e som de clique suave no toque longo.
- TypeScript sem erros (`npm run build` deve compilar perfeitamente).

---

### Task 1: Atualização dos Tipos e Estrutura de Dados de SubGoals

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/services/storageService.ts`

**Interfaces:**
- Consumes: `HabitCategory`
- Produces: `SubGoalType`, campos `type`, `targetParts`, `currentParts`, `totalCompletions` em `SubGoal`.

- [ ] **Passo 1: Atualizar `src/types/index.ts`**
Adicionar `SubGoalType` e os novos campos opcionais em `SubGoal`:
```typescript
export type SubGoalType = 'checkbox' | 'segmented';

export interface SubGoal {
  id: string;
  habitCategory: HabitCategory;
  title: string;
  periodicity: 'daily' | 'weekly' | 'one-time';
  xpValue: number;
  completedDates: string[]; // List of YYYY-MM-DD dates where it was completed
  isCompletedOneTime?: boolean;
  type?: SubGoalType;
  targetParts?: number; // 2 to 6
  currentParts?: number; // 0 to targetParts
  totalCompletions?: number;
  createdAt: string;
}
```

- [ ] **Passo 2: Atualizar starter subgoals e sanitização em `src/services/storageService.ts`**
Garantir que subgoals carregados do LocalStorage tenham defaults seguros:
```typescript
currentParts: sg.currentParts ?? 0,
targetParts: sg.targetParts ?? (sg.type === 'segmented' ? 3 : undefined),
type: sg.type ?? 'checkbox',
totalCompletions: sg.totalCompletions ?? 0,
```

- [ ] **Passo 3: Executar `npm run build` para verificar tipos**
Run: `npm run build`
Expected: Build passes without type errors.

---

### Task 2: Componente Reutilizável `SubGoalCard.tsx`

**Files:**
- Create: `src/components/subgoals/SubGoalCard.tsx`

**Interfaces:**
- Consumes: `SubGoal`, `HabitCategory`, `soundEngine` de `src/services/audioService.ts`
- Produces: `<SubGoalCard subGoal={...} onProgress={(id, delta) => ...} onDelete={...} compact={...} />`

- [ ] **Passo 1: Criar `SubGoalCard.tsx` com detecção de toque longo e animação de conclusão**
Implementar o card com:
1. `useRef` para timer de toque longo (500ms) nos eventos `onTouchStart`, `onTouchEnd`, `onMouseDown`, `onMouseUp`, `onMouseLeave`.
2. Para metas `segmented`:
   - Grid horizontal de 2 a 6 barras com altura e bordas estilizadas.
   - Barras ativas em verde neon esmeralda (`bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]`).
   - Efeito visual de celebração e conclusão quando `currentParts === targetParts`.
   - Exibição de contador `1/3` e `totalCompletions` se `> 0`.
3. Para metas `checkbox`:
   - Ícone de círculo/check tradicional com riscado ao concluir no dia.
4. Botão de exclusão (se fornecido `onDelete`).

- [ ] **Passo 2: Testar build do componente**
Run: `npm run build`
Expected: Pass.

---

### Task 3: Atualizar Criação e Listagem em `SubGoalsSection.tsx`

**Files:**
- Modify: `src/components/subgoals/SubGoalsSection.tsx`

**Interfaces:**
- Consumes: `SubGoalCard`, `SubGoal`
- Produces: Criação de subobjetivos simples e segmentados com botões `[2] [3] [4] [5] [6]` partes e XP configurável.

- [ ] **Passo 1: Atualizar formulário do Modal em `SubGoalsSection.tsx`**
Adicionar estado de tipo `goalType: 'checkbox' | 'segmented'`, estado `targetParts: number (default 3)`, seletor interativo com botões para escolher o número de partes (2, 3, 4, 5, 6) e explicação clara na UI.

- [ ] **Passo 2: Atualizar a lista de subobjetivos para usar `SubGoalCard`**
Substituir a renderização inline pela chamada ao componente `SubGoalCard`, passando `onProgress` e `onDelete`.

- [ ] **Passo 3: Executar build e validação**
Run: `npm run build`
Expected: Pass.

---

### Task 4: Atualizar Lógica de Negócio em `App.tsx` e Demais Seções de Hábitos

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/habits/WorkoutsSection.tsx`
- Modify: `src/components/habits/ReadingSection.tsx`
- Modify: `src/components/habits/BudgetSection.tsx`
- Modify: `src/components/habits/FoodSection.tsx`
- Modify: `src/components/dashboard/NextMilestoneCard.tsx`

**Interfaces:**
- Consumes: `SubGoalCard`, `triggerXpAward`, `soundEngine`
- Produces: `handleProgressSubGoal(id: string, delta: 1 | -1)` gerenciando incrementos, decrementos, ganho de XP e reset de ciclo.

- [ ] **Passo 1: Implementar `handleProgressSubGoal` em `App.tsx`**
Lógica:
- Se for `segmented`:
  - Se `delta === 1`:
    - Novo progresso: `newParts = (subGoal.currentParts || 0) + 1`.
    - Se `newParts >= targetParts`:
      - Dispara som de celebração `soundEngine.playMilestone()`.
      - Dispara `triggerXpAward` com `subGoal.xpValue`, categoria e descrição `Ciclo Concluído: ${subGoal.title}`.
      - Reseta `currentParts: 0` e incrementa `totalCompletions: (subGoal.totalCompletions || 0) + 1`.
      - Registra a data de hoje em `completedDates`.
    - Se `newParts < targetParts`:
      - Dispara som de pop `soundEngine.playPop()`.
      - Atualiza `currentParts: newParts`.
  - Se `delta === -1`:
    - Se `(subGoal.currentParts || 0) > 0`:
      - Reduz `currentParts: subGoal.currentParts - 1`.
      - Dispara som suave `soundEngine.playClick()`.
- Se for `checkbox`:
  - Mantém o toggle normal de hoje (marca/desmarca).

- [ ] **Passo 2: Atualizar Seções de Hábitos e Dashboard**
Substituir a renderização de subgoals em `WorkoutsSection`, `ReadingSection`, `BudgetSection`, `FoodSection` e `NextMilestoneCard` pelo componente `SubGoalCard` conectado ao `handleProgressSubGoal`.

- [ ] **Passo 3: Executar build**
Run: `npm run build`
Expected: Pass.

---

### Task 5: Validação Visual, Testes Interativos e Polish

**Files:**
- Teste na UI via browser / subagente ou verificação de runtime.

- [ ] **Passo 1: Executar lint e build de produção**
Run: `npm run lint` & `npm run build`
Expected: Sem erros ou warnings graves.

- [ ] **Passo 2: Testar no navegador**
1. Criar uma meta segmentada de 3 partes: "3 dias sem beber refrigerante" (+25 XP).
2. Clicar 1x: barra 1/3 acende em verde neon.
3. Segurar 500ms: barra volta para 0/3.
4. Clicar 3x: 1/3 ➔ 2/3 ➔ 3/3: todas acendem, toca som e toast de +25 XP, zera automaticamente para 0/3.
5. Criar meta segmentada de 5 partes e testar em outra aba de hábito.
