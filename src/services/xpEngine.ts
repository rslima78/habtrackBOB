import confetti from 'canvas-confetti';
import { AppState, formatDate } from './storageService';
import { getLevelProgress } from './levelConfig';
import { soundEngine } from './audioService';
import { XpTransaction } from '../types';
import { evaluateAchievements } from './achievementsEngine';

export interface XpAwardResult {
  newState: AppState;
  xpAwarded: number;
  leveledUp: boolean;
  newLevel?: number;
  unlockedAchievements: string[];
}

export function awardXp(
  state: AppState,
  amount: number,
  source: string,
  description: string,
  activityKey?: string
): XpAwardResult {
  const todayStr = formatDate(new Date());

  // 1. Anti-Exploitation check:
  // If activityKey is provided, check if already awarded today
  if (activityKey) {
    const alreadyAwarded = state.xpTransactions.some(
      tx => tx.date === todayStr && tx.activityKey === activityKey
    );
    if (alreadyAwarded) {
      return {
        newState: state,
        xpAwarded: 0,
        leveledUp: false,
        unlockedAchievements: []
      };
    }
  }

  const previousXp = state.user.totalXp;
  const newTotalXp = previousXp + amount;

  const prevProgress = getLevelProgress(previousXp);
  const newProgress = getLevelProgress(newTotalXp);

  const leveledUp = newProgress.currentLevel.level > prevProgress.currentLevel.level;

  // New Transaction
  const newTx: XpTransaction = {
    id: `xp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    date: todayStr,
    source,
    description,
    amount,
    activityKey,
    createdAt: new Date().toISOString()
  };

  // Play Sound FX
  if (leveledUp) {
    soundEngine.playLevelUp();
    triggerLevelUpConfetti();
  } else {
    soundEngine.playXpGain();
  }

  const stateWithNewXp: AppState = {
    ...state,
    user: {
      ...state.user,
      totalXp: newTotalXp
    },
    xpTransactions: [newTx, ...state.xpTransactions]
  };

  // Check achievements progress across all categories
  const evalResult = evaluateAchievements(stateWithNewXp);
  const unlockedAchievementTitles: string[] = [];

  if (evalResult.newlyUnlocked.length > 0) {
    evalResult.newlyUnlocked.forEach(ach => {
      unlockedAchievementTitles.push(ach.title);
    });
    soundEngine.playAchievement();
  }

  const updatedState: AppState = {
    ...stateWithNewXp,
    achievements: evalResult.achievements
  };

  return {
    newState: updatedState,
    xpAwarded: amount,
    leveledUp,
    newLevel: leveledUp ? newProgress.currentLevel.level : undefined,
    unlockedAchievements: unlockedAchievementTitles
  };
}

// Applies a signed XP correction (used when a past log is edited and its XP value changes).
// The transaction is dated on the edited day so the daily score reflects the correction.
export function adjustXp(
  state: AppState,
  delta: number,
  source: string,
  description: string,
  dateStr: string
): AppState {
  if (delta === 0) {
    const evalResult = evaluateAchievements(state);
    return { ...state, achievements: evalResult.achievements };
  }

  const newTotalXp = Math.max(0, state.user.totalXp + delta);
  const appliedDelta = newTotalXp - state.user.totalXp;
  if (appliedDelta === 0) {
    const evalResult = evaluateAchievements(state);
    return { ...state, achievements: evalResult.achievements };
  }

  const tx: XpTransaction = {
    id: `xp-adj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: dateStr,
    source,
    description,
    amount: appliedDelta,
    createdAt: new Date().toISOString()
  };

  const stateWithAdjustment: AppState = {
    ...state,
    user: { ...state.user, totalXp: newTotalXp },
    xpTransactions: [tx, ...state.xpTransactions]
  };

  const evalResult = evaluateAchievements(stateWithAdjustment);
  return {
    ...stateWithAdjustment,
    achievements: evalResult.achievements
  };
}

export function triggerLevelUpConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#8B5CF6', '#F59E0B', '#10B981', '#EC4899', '#38BDF8']
  });

  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
  }, 250);
}
