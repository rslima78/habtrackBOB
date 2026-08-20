# Savings Energy Tab (Cofre) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a new tab "Cofre" (Vault/Energy Savings) that tracks daily savings based on `(Daily Limit - Daily Spend)`, feeds a 10-cell Energy Battery of R$ 100 each (R$ 1.000 per level), displays total savings or a prominent debt warning when negative, provides quick limit adjustment, and lists a day-by-day history.

**Architecture:** Pure calculation service `savingsCalculator.ts` transforms `ExpenseLog[]` and `AppSettings.budgetDailyLimit` into structured summary and daily history. Reusable modular UI components (`EnergyBatteryBar`, `AdjustDailyLimitModal`, `DailySavingsHistory`, `VaultView`) render the gamified cyberpunk energy theme.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide React, Canvas Confetti.

## Global Constraints
- Preserve existing state schema and persistence mechanisms in `StorageService`.
- Follow the cyberpunk/RPG aesthetic (glow effects, emerald neon for energy, ruby neon for debt alert).
- Support responsive layouts (Mobile and Desktop navigation).
- Build must pass `npm run build` (`tsc -b && vite build`) cleanly with zero errors.

---

### Task 1: Savings Calculation Engine (`savingsCalculator.ts`)

**Files:**
- Create: `src/services/savingsCalculator.ts`

**Interfaces:**
- Produces:
  ```typescript
  export interface DaySavingsRecord {
    date: string;
    spent: number;
    limit: number;
    saved: number;
    isOverBudget: boolean;
  }

  export interface SavingsSummary {
    totalSavings: number;
    isNegative: boolean;
    debtAmount: number;
    batteryLevel: number;
    levelProgress: number; // 0 to 1000
    levelMax: number; // 1000
    cells: Array<{
      index: number;
      value: number; // 0 to 100
      isFull: boolean;
      isPartial: boolean;
    }>;
    todayRecord: DaySavingsRecord;
    history: DaySavingsRecord[];
  }

  export function calculateSavingsSummary(
    expenses: ExpenseLog[],
    dailyLimit: number,
    accountCreatedAt?: string
  ): SavingsSummary;
  ```

- [ ] **Step 1: Implement `savingsCalculator.ts` with comprehensive edge case handling (empty expenses, multiple expenses per day, negative balance, level overflows)**
- [ ] **Step 2: Verify logic and build with `npm run build`**

---

### Task 2: Energy Battery Bar Component (`EnergyBatteryBar.tsx`)

**Files:**
- Create: `src/components/vault/EnergyBatteryBar.tsx`

**Interfaces:**
- Consumes: `SavingsSummary['cells']`, `batteryLevel`, `levelProgress`, `isNegative`, `currency`
- Produces: Interactive visual 10-cell battery bar with glow, percentage markers, battery level badge, and energetic animations.

- [ ] **Step 1: Create `src/components/vault/EnergyBatteryBar.tsx`**
- [ ] **Step 2: Verify styles and responsiveness**

---

### Task 3: Modal & Subcomponents (`AdjustDailyLimitModal.tsx` & `DailySavingsHistory.tsx`)

**Files:**
- Create: `src/components/vault/AdjustDailyLimitModal.tsx`
- Create: `src/components/vault/DailySavingsHistory.tsx`

**Interfaces:**
- `AdjustDailyLimitModal`: `currentLimit: number`, `currency: string`, `isOpen: boolean`, `onClose: () => void`, `onSave: (newLimit: number) => void`
- `DailySavingsHistory`: `history: DaySavingsRecord[]`, `currency: string`

- [ ] **Step 1: Create `AdjustDailyLimitModal.tsx`**
- [ ] **Step 2: Create `DailySavingsHistory.tsx`**
- [ ] **Step 3: Verify TypeScript builds cleanly**

---

### Task 4: Main View (`VaultView.tsx`) & Navigation Integration

**Files:**
- Create: `src/components/vault/VaultView.tsx`
- Modify: `src/components/layout/Navigation.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- `VaultView`: `expenses: ExpenseLog[]`, `settings: AppSettings`, `userCreatedAt: string`, `onUpdateDailyLimit: (newLimit: number) => void`
- `Navigation`: Add `vault` TabType with `Zap` icon and label "Cofre"

- [ ] **Step 1: Create `VaultView.tsx` connecting summary, header, energy bar, today's card, and history**
- [ ] **Step 2: Update `Navigation.tsx` to include `vault` tab**
- [ ] **Step 3: Update `App.tsx` to render `VaultView` when `activeTab === 'vault'` and provide `onUpdateDailyLimit`**
- [ ] **Step 4: Test build with `npm run build`**

---

### Task 5: Final Verification & Polish

**Files:**
- Test end-to-end flow with simulated expenses, positive/negative savings, level upgrades, and limit updates.

- [ ] **Step 1: Run `npm run build` to verify no compilation or typing errors**
- [ ] **Step 2: Create walkthrough and verify all user requirements are fulfilled**
