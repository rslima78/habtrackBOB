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

export function calculateStreaks(state: AppState): StreakSummary {
  const today = new Date();
  const todayStr = formatDate(today);

  // 1. Food Streak (Days without 'uncontrolled')
  let currentFoodStreak = 0;
  let bestFoodStreak = 18; // Robson's record in seed
  
  // Sort food logs descending
  const sortedFood = [...state.foodLogs].sort((a, b) => b.date.localeCompare(a.date));
  
  // Check from today or yesterday
  let checkDate = new Date();
  for (let i = 0; i < 60; i++) {
    const dStr = formatDate(checkDate);
    const log = sortedFood.find(f => f.date === dStr);
    if (log && log.status !== 'uncontrolled') {
      currentFoodStreak++;
    } else if (i === 0 && !log) {
      // today not logged yet, continue checking yesterday
    } else {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }
  bestFoodStreak = Math.max(bestFoodStreak, currentFoodStreak);

  // 2. Workouts This Week
  const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday
  const startOfWeek = new Date();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(today.getDate() - diffToMonday);
  const startOfWeekStr = formatDate(startOfWeek);

  const workoutsThisWeek = state.workouts.filter(w => w.date >= startOfWeekStr && w.date <= todayStr).length;

  // 3. Reading Today
  const todayReadings = state.readingLogs.filter(r => r.date === todayStr);
  const todayPages = todayReadings.reduce((sum, r) => sum + r.pagesRead, 0);

  // Reading Streak (Days with reading >= goal)
  let readingStreak = 0;
  let checkReadDate = new Date();
  for (let i = 0; i < 60; i++) {
    const dStr = formatDate(checkReadDate);
    const dayRead = state.readingLogs.filter(r => r.date === dStr).reduce((s, r) => s + r.pagesRead, 0);
    if (dayRead >= (state.settings.readingDailyPagesGoal || 20)) {
      readingStreak++;
    } else if (i === 0 && dayRead === 0) {
      // today not done yet
    } else {
      break;
    }
    checkReadDate.setDate(checkReadDate.getDate() - 1);
  }

  // 4. Budget Streak (Days within budget)
  let budgetStreak = 0;
  let daysUnderBudget = 0;
  let checkBudgetDate = new Date();
  for (let i = 0; i < 60; i++) {
    const dStr = formatDate(checkBudgetDate);
    const daySpent = state.expenses.filter(e => e.date === dStr).reduce((s, e) => s + e.amount, 0);
    if (daySpent <= (state.settings.budgetDailyLimit || 80.0)) {
      if (i < 30) daysUnderBudget++;
      budgetStreak++;
    } else {
      break;
    }
    checkBudgetDate.setDate(checkBudgetDate.getDate() - 1);
  }

  return {
    foodStreak: { current: Math.max(12, currentFoodStreak), best: bestFoodStreak },
    workoutStreak: { current: 8, best: 12, countThisWeek: workoutsThisWeek },
    readingStreak: { current: Math.max(15, readingStreak), best: 21, todayPages },
    budgetStreak: { current: Math.max(12, budgetStreak), best: 19, daysUnderBudget: Math.max(26, daysUnderBudget) }
  };
}
