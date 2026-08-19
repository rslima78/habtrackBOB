import { Achievement } from '../types';
import { AppState, formatDate } from './storageService';
import { calculateStreaks } from './scoreCalculator';
import { getFreshAchievements } from './achievementsConfig';

export interface AchievementEvaluationResult {
  achievements: Achievement[];
  newlyUnlocked: Achievement[];
}

/**
 * Calculates current progress value and unlock status for all achievements.
 */
export function evaluateAchievements(state: AppState): AchievementEvaluationResult {
  const todayStr = formatDate(new Date());
  const streaks = calculateStreaks(state);

  const freshList = getFreshAchievements();
  const existingMap = new Map<string, Achievement>();
  (state.achievements || []).forEach(a => existingMap.set(a.id, a));

  const totalPagesRead = state.readingLogs.reduce((sum, r) => sum + (r.pagesRead || 0), 0);
  const runningWorkouts = state.workouts.filter(w => w.type === 'run').length;
  const completedBooks = state.books.filter(
    b => b.status === 'completed' || (b.totalPages > 0 && b.currentPage >= b.totalPages)
  ).length;

  const completedSubGoalsCount = state.subGoals.reduce(
    (sum, sg) => sum + (sg.completedDates ? sg.completedDates.length : 0) + (sg.isCompletedOneTime ? 1 : 0),
    0
  );

  const maxHabitStreak = Math.max(
    streaks.foodStreak.best,
    streaks.foodStreak.current,
    streaks.workoutStreak.best,
    streaks.workoutStreak.current,
    streaks.readingStreak.best,
    streaks.readingStreak.current,
    streaks.budgetStreak.best,
    streaks.budgetStreak.current
  );

  const totalActivities =
    state.workouts.length +
    state.readingLogs.length +
    state.foodLogs.length +
    state.expenses.length +
    completedSubGoalsCount +
    state.xpTransactions.length;

  const newlyUnlocked: Achievement[] = [];

  const updatedAchievements: Achievement[] = freshList.map(baseAch => {
    const existing = existingMap.get(baseAch.id) || baseAch;

    let computedValue = 0;

    switch (baseAch.id) {
      case 'first_step':
        computedValue = totalActivities;
        break;

      case 'streak_7':
      case 'streak_14':
      case 'streak_30':
        computedValue = maxHabitStreak;
        break;

      case 'financial_ninja':
        computedValue = Math.max(
          streaks.budgetStreak.best,
          streaks.budgetStreak.current,
          streaks.budgetStreak.daysUnderBudget
        );
        break;

      case 'librarian_500':
        computedValue = totalPagesRead;
        break;

      case 'marathoner_10':
        computedValue = runningWorkouts;
        break;

      case 'food_zen_10':
        computedValue = Math.max(streaks.foodStreak.best, streaks.foodStreak.current);
        break;

      case 'subgoal_master':
        computedValue = completedSubGoalsCount;
        break;

      case 'reach_monk_level':
        computedValue = state.user.totalXp;
        break;

      case 'book_worm_3':
        computedValue = completedBooks;
        break;

      case 'legend_rank':
        computedValue = state.user.totalXp;
        break;

      default:
        computedValue = existing.currentValue || 0;
        break;
    }

    const wasUnlocked = existing.unlocked;
    const shouldUnlock = computedValue >= baseAch.requirement;

    if (!wasUnlocked && shouldUnlock) {
      const unlockedAch: Achievement = {
        ...baseAch,
        currentValue: computedValue,
        unlocked: true,
        unlockedAt: existing.unlockedAt || todayStr
      };
      newlyUnlocked.push(unlockedAch);
      return unlockedAch;
    }

    if (wasUnlocked) {
      return {
        ...baseAch,
        currentValue: Math.max(computedValue, baseAch.requirement),
        unlocked: true,
        unlockedAt: existing.unlockedAt || todayStr
      };
    }

    return {
      ...baseAch,
      currentValue: computedValue,
      unlocked: false
    };
  });

  return {
    achievements: updatedAchievements,
    newlyUnlocked
  };
}
