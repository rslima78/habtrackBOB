import { AppState, formatDate } from './storageService';
import { DayScoreInfo } from '../types';

export function calculateDailyScore(state: AppState, dateStr: string = formatDate(new Date())): DayScoreInfo {
  const { workouts, readingLogs, expenses, foodLogs, subGoals, settings, xpTransactions } = state;

  // 1. Workouts Score (25 pts max)
  const todayWorkouts = workouts.filter(w => w.date === dateStr);
  const workoutDone = todayWorkouts.length > 0;
  const workoutScore = workoutDone ? 25 : 0;

  // 2. Reading Score (25 pts max)
  const todayReadings = readingLogs.filter(r => r.date === dateStr);
  const totalPagesToday = todayReadings.reduce((sum, r) => sum + r.pagesRead, 0);
  const readingRatio = Math.min(1, totalPagesToday / (settings.readingDailyPagesGoal || 20));
  const readingScore = Math.round(readingRatio * 25);

  // 3. Budget Score (25 pts max)
  const todayExpenses = expenses.filter(e => e.date === dateStr);
  const totalSpentToday = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const dailyLimit = settings.budgetDailyLimit || 80.0;
  let budgetScore = 25;
  if (totalSpentToday > dailyLimit) {
    // If over limit, reduce score proportionally
    const overPercent = (totalSpentToday - dailyLimit) / dailyLimit;
    budgetScore = Math.max(0, Math.round(25 - (overPercent * 30)));
  } else if (todayExpenses.length === 0) {
    budgetScore = 25; // No spend = 100% control
  }

  // 4. Food Control Score (25 pts max)
  const todayFood = foodLogs.find(f => f.date === dateStr);
  let foodScore = 0;
  if (todayFood) {
    if (todayFood.status === 'controlled') foodScore = 25;
    else if (todayFood.status === 'partial') foodScore = 15;
    else foodScore = 0;
  } else {
    // If no log yet, give neutral partial
    foodScore = 12;
  }

  // 5. Subgoals done today (Extra bonus/adjustment)
  const dailySubGoals = subGoals.filter(sg => sg.periodicity === 'daily');
  const completedSubGoalsToday = dailySubGoals.filter(sg => sg.completedDates.includes(dateStr));
  const subGoalsScore = dailySubGoals.length > 0
    ? Math.round((completedSubGoalsToday.length / dailySubGoals.length) * 10)
    : 10;

  // Total Percentage
  let totalPercent = Math.min(100, workoutScore + readingScore + budgetScore + foodScore);

  // If subgoals are fulfilled, ensure high score
  if (completedSubGoalsToday.length > 0 && totalPercent < 90 && workoutDone && totalPagesToday >= settings.readingDailyPagesGoal && totalSpentToday <= dailyLimit && todayFood?.status === 'controlled') {
    totalPercent = 100;
  }

  // XP Earned Today
  const xpEarnedToday = xpTransactions
    .filter(xp => xp.date === dateStr)
    .reduce((sum, xp) => sum + xp.amount, 0);

  // Fun Motivational Messages
  let label = 'Excelente';
  let emoji = '🥷';
  let message = 'Você está imparável!';

  if (totalPercent >= 90) {
    label = 'Excelente!';
    emoji = '🥷🔥';
    message = 'Você está imparável!';
  } else if (totalPercent >= 70) {
    label = 'Muito Bom!';
    emoji = '💪';
    message = 'Bom trabalho, guerreiro!';
  } else if (totalPercent >= 50) {
    label = 'Parcial';
    emoji = '😐';
    message = 'Dá para melhorar amanhã. Mantenha o foco!';
  } else if (totalPercent >= 1) {
    label = 'Desafiador';
    emoji = '🫠';
    message = 'Hoje foi difícil. Amanhã é outro round!';
  } else {
    label = 'Descanso';
    emoji = '😴';
    message = 'O personagem descansou hoje. Tudo bem. Recomece amanhã!';
  }

  return {
    date: dateStr,
    percent: totalPercent,
    label,
    emoji,
    message,
    workoutScore,
    readingScore,
    budgetScore,
    foodScore,
    subGoalsScore,
    xpEarnedToday
  };
}

// Calculate streaks for each habit
export interface StreakSummary {
  foodStreak: { current: number; best: number };
  workoutStreak: { current: number; best: number; countThisWeek: number };
  readingStreak: { current: number; best: number; todayPages: number };
  budgetStreak: { current: number; best: number; daysUnderBudget: number };
}

/**
 * Calculates the longest consecutive days sequence from a list of YYYY-MM-DD date strings.
 */
export function calculateBestConsecutiveDays(dateStrings: string[]): number {
  if (!dateStrings || dateStrings.length === 0) return 0;
  const uniqueDates = Array.from(new Set(dateStrings)).sort();
  if (uniqueDates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1] + 'T12:00:00');
    const curr = new Date(uniqueDates[i] + 'T12:00:00');
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

/**
 * Calculates the current active streak counting backwards from today (or yesterday if today isn't completed yet).
 */
export function calculateCurrentActiveStreak(
  isValidDate: (dateStr: string) => boolean,
  isExplicitlyBroken?: (dateStr: string) => boolean,
  maxLookbackDays: number = 365
): number {
  const today = new Date();
  const todayStr = formatDate(today);
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  if (isExplicitlyBroken && isExplicitlyBroken(todayStr)) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(today);

  // If today is not completed yet, check if yesterday was valid.
  // If yesterday is valid, start streak from yesterday so we don't break the streak mid-day.
  if (!isValidDate(todayStr)) {
    if (!isValidDate(yesterdayStr) || (isExplicitlyBroken && isExplicitlyBroken(yesterdayStr))) {
      return 0;
    }
    checkDate = new Date(yesterday);
  }

  for (let i = 0; i < maxLookbackDays; i++) {
    const dStr = formatDate(checkDate);
    if (isExplicitlyBroken && isExplicitlyBroken(dStr)) {
      break;
    }
    if (isValidDate(dStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function calculateStreaks(state: AppState): StreakSummary {
  const today = new Date();
  const todayStr = formatDate(today);

  // ----------------------------------------------------
  // 1. Food Streak (Days with 'controlled' or 'partial')
  // ----------------------------------------------------
  const controlledDates: string[] = [];
  const foodLogMap = new Map<string, string>();
  for (const log of state.foodLogs) {
    foodLogMap.set(log.date, log.status);
    if (log.status === 'controlled' || log.status === 'partial') {
      controlledDates.push(log.date);
    }
  }

  const currentFoodStreak = calculateCurrentActiveStreak(
    dStr => {
      const status = foodLogMap.get(dStr);
      return status === 'controlled' || status === 'partial';
    },
    dStr => {
      const status = foodLogMap.get(dStr);
      return status === 'uncontrolled';
    }
  );
  const bestFoodStreak = Math.max(currentFoodStreak, calculateBestConsecutiveDays(controlledDates));

  // ----------------------------------------------------
  // 2. Workouts Streak (Days with at least 1 workout)
  // ----------------------------------------------------
  const workoutDates = state.workouts.map(w => w.date);
  const workoutDateSet = new Set(workoutDates);

  const currentWorkoutStreak = calculateCurrentActiveStreak(dStr => workoutDateSet.has(dStr));
  const bestWorkoutStreak = Math.max(currentWorkoutStreak, calculateBestConsecutiveDays(workoutDates));

  // Workouts This Week
  const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday
  const startOfWeek = new Date();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(today.getDate() - diffToMonday);
  const startOfWeekStr = formatDate(startOfWeek);
  const workoutsThisWeek = state.workouts.filter(w => w.date >= startOfWeekStr && w.date <= todayStr).length;

  // ----------------------------------------------------
  // 3. Reading Streak (Days with reading >= goal)
  // ----------------------------------------------------
  const dailyGoal = state.settings.readingDailyPagesGoal || 20;
  const pagesPerDateMap = new Map<string, number>();
  for (const r of state.readingLogs) {
    const prev = pagesPerDateMap.get(r.date) || 0;
    pagesPerDateMap.set(r.date, prev + r.pagesRead);
  }

  const readingDatesMeetingGoal: string[] = [];
  pagesPerDateMap.forEach((pages, date) => {
    if (pages >= dailyGoal) {
      readingDatesMeetingGoal.push(date);
    }
  });

  const currentReadingStreak = calculateCurrentActiveStreak(dStr => {
    const pages = pagesPerDateMap.get(dStr) || 0;
    return pages >= dailyGoal;
  });
  const bestReadingStreak = Math.max(currentReadingStreak, calculateBestConsecutiveDays(readingDatesMeetingGoal));

  const todayReadings = state.readingLogs.filter(r => r.date === todayStr);
  const todayPages = todayReadings.reduce((sum, r) => sum + r.pagesRead, 0);

  // ----------------------------------------------------
  // 4. Budget Streak (Days within daily limit)
  // ----------------------------------------------------
  const dailyLimit = state.settings.budgetDailyLimit || 80.0;
  const spentPerDateMap = new Map<string, number>();
  for (const e of state.expenses) {
    const prev = spentPerDateMap.get(e.date) || 0;
    spentPerDateMap.set(e.date, prev + e.amount);
  }

  // Find all active tracked days (dates where user has workouts, food, reading, expenses, or subgoals)
  const activeDatesSet = new Set<string>();
  state.workouts.forEach(w => activeDatesSet.add(w.date));
  state.foodLogs.forEach(f => activeDatesSet.add(f.date));
  state.readingLogs.forEach(r => activeDatesSet.add(r.date));
  state.expenses.forEach(e => activeDatesSet.add(e.date));
  state.subGoals.forEach(sg => sg.completedDates?.forEach(d => activeDatesSet.add(d)));

  // If no activities at all, budget streak is 0
  let currentBudgetStreak = 0;
  let bestBudgetStreak = 0;
  let daysUnderBudget = 0;

  if (activeDatesSet.size > 0) {
    const budgetOkDates: string[] = [];
    activeDatesSet.forEach(dStr => {
      const spent = spentPerDateMap.get(dStr) || 0;
      if (spent <= dailyLimit) {
        budgetOkDates.push(dStr);
      }
    });

    currentBudgetStreak = calculateCurrentActiveStreak(
      dStr => activeDatesSet.has(dStr) && (spentPerDateMap.get(dStr) || 0) <= dailyLimit,
      dStr => (spentPerDateMap.get(dStr) || 0) > dailyLimit
    );
    bestBudgetStreak = Math.max(currentBudgetStreak, calculateBestConsecutiveDays(budgetOkDates));

    // Days under budget in the last 30 days
    const checkDate30 = new Date(today);
    for (let i = 0; i < 30; i++) {
      const dStr = formatDate(checkDate30);
      const spent = spentPerDateMap.get(dStr) || 0;
      if (activeDatesSet.has(dStr) && spent <= dailyLimit) {
        daysUnderBudget++;
      }
      checkDate30.setDate(checkDate30.getDate() - 1);
    }
  }

  return {
    foodStreak: { current: currentFoodStreak, best: bestFoodStreak },
    workoutStreak: { current: currentWorkoutStreak, best: bestWorkoutStreak, countThisWeek: workoutsThisWeek },
    readingStreak: { current: currentReadingStreak, best: bestReadingStreak, todayPages },
    budgetStreak: { current: currentBudgetStreak, best: bestBudgetStreak, daysUnderBudget }
  };
}
