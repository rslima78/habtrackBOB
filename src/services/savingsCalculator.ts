import { ExpenseLog } from '../types';

export interface DaySavingsRecord {
  date: string;
  spent: number;
  limit: number;
  saved: number; // positive = saved, negative = over budget
  isOverBudget: boolean;
}

export interface EnergyCell {
  index: number;
  cellMinValue: number; // e.g. 0, 100, 200, ...
  cellMaxValue: number; // e.g. 100, 200, 300, ...
  percent: number; // 0 to 100%
  amountInCell: number; // 0 to 100
  isFull: boolean;
  isPartial: boolean;
}

export interface SavingsSummary {
  totalSavings: number;
  isNegative: boolean;
  debtAmount: number; // absolute value if negative, 0 otherwise
  batteryLevel: number; // 1, 2, 3...
  levelProgress: number; // 0 to 1000 within the current level
  levelMax: number; // 1000
  cells: EnergyCell[];
  todayRecord: DaySavingsRecord;
  history: DaySavingsRecord[];
}

/**
 * Calculates consolidated savings from expense logs and daily budget limit.
 */
export function calculateSavingsSummary(
  expenses: ExpenseLog[],
  dailyLimit: number,
  accountCreatedAt?: string
): SavingsSummary {
  const safeDailyLimit = dailyLimit > 0 ? dailyLimit : 50;
  const todayStr = new Date().toISOString().split('T')[0];

  // Group all expenses by date
  const spentByDate = new Map<string, number>();
  for (const exp of expenses) {
    const current = spentByDate.get(exp.date) || 0;
    spentByDate.set(exp.date, current + (Number(exp.amount) || 0));
  }

  // Ensure today is in the set of dates
  if (!spentByDate.has(todayStr)) {
    spentByDate.set(todayStr, 0);
  }

  // Also include accountCreatedAt date if provided
  if (accountCreatedAt) {
    const createdDateStr = accountCreatedAt.split('T')[0];
    if (createdDateStr && !spentByDate.has(createdDateStr)) {
      spentByDate.set(createdDateStr, 0);
    }
  }

  // Sort dates chronologically
  const sortedDates = Array.from(spentByDate.keys()).sort((a, b) => a.localeCompare(b));

  const history: DaySavingsRecord[] = [];
  let totalSavings = 0;

  for (const date of sortedDates) {
    const spent = spentByDate.get(date) || 0;
    const saved = safeDailyLimit - spent;
    const isOverBudget = spent > safeDailyLimit;

    history.push({
      date,
      spent,
      limit: safeDailyLimit,
      saved,
      isOverBudget,
    });

    totalSavings += saved;
  }

  // Find today's record
  const todayRecord = history.find(r => r.date === todayStr) || {
    date: todayStr,
    spent: spentByDate.get(todayStr) || 0,
    limit: safeDailyLimit,
    saved: safeDailyLimit - (spentByDate.get(todayStr) || 0),
    isOverBudget: (spentByDate.get(todayStr) || 0) > safeDailyLimit,
  };

  // Sort history in reverse chronological order for display
  const displayHistory = [...history].sort((a, b) => b.date.localeCompare(a.date));

  const isNegative = totalSavings < 0;
  const debtAmount = isNegative ? Math.abs(totalSavings) : 0;

  // Battery Level & 10 Cells calculation (each battery level = 1000, 10 cells of 100 each)
  const LEVEL_CAPACITY = 1000;
  const CELL_CAPACITY = 100;
  const NUM_CELLS = 10;

  let batteryLevel = 1;
  let levelProgress = 0;

  if (totalSavings > 0) {
    batteryLevel = Math.floor(totalSavings / LEVEL_CAPACITY) + 1;
    levelProgress = totalSavings % LEVEL_CAPACITY;
  }

  const cells: EnergyCell[] = [];
  for (let i = 0; i < NUM_CELLS; i++) {
    const cellMinValue = i * CELL_CAPACITY;
    const cellMaxValue = (i + 1) * CELL_CAPACITY;

    let amountInCell = 0;
    if (totalSavings > 0) {
      if (levelProgress >= cellMaxValue) {
        amountInCell = CELL_CAPACITY;
      } else if (levelProgress > cellMinValue) {
        amountInCell = levelProgress - cellMinValue;
      }
    }

    const percent = Math.min(100, Math.max(0, (amountInCell / CELL_CAPACITY) * 100));
    const isFull = percent === 100;
    const isPartial = percent > 0 && percent < 100;

    cells.push({
      index: i,
      cellMinValue,
      cellMaxValue,
      percent,
      amountInCell,
      isFull,
      isPartial,
    });
  }

  return {
    totalSavings,
    isNegative,
    debtAmount,
    batteryLevel,
    levelProgress,
    levelMax: LEVEL_CAPACITY,
    cells,
    todayRecord,
    history: displayHistory,
  };
}
