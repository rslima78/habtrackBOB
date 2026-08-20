export type HabitCategory = 'workout' | 'reading' | 'budget' | 'food' | 'general';

export type FoodControlStatus = 'controlled' | 'partial' | 'uncontrolled';

export type WorkoutType = 'walk' | 'run' | 'cycling' | 'other';

export type BookStatus = 'reading' | 'completed' | 'wishlist';

export interface LevelInfo {
  level: number;
  minXp: number;
  maxXp: number;
  title: string;
  emoji: string;
  avatarId: string;
  description: string;
  color: string;
}

export interface UserProfile {
  name: string;
  totalXp: number;
  soundEnabled: boolean;
  theme: string;
  createdAt: string;
}

export interface WorkoutLog {
  id: string;
  date: string; // YYYY-MM-DD
  type: WorkoutType;
  distanceKm: number;
  durationMin: number;
  notes?: string;
  xpEarned: number;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  status: BookStatus;
  color: string;
  startedAt: string;
  finishedAt?: string;
}

export interface ReadingLog {
  id: string;
  date: string; // YYYY-MM-DD
  bookId?: string;
  bookTitle?: string;
  pagesRead: number;
  durationMin: number;
  notes?: string;
  xpEarned: number;
  createdAt: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ExpenseLog {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  categoryId: string;
  description: string;
  paymentMethod?: 'pix' | 'cartao' | 'dinheiro' | 'outro';
  createdAt: string;
}

export interface FoodLog {
  id: string;
  date: string; // YYYY-MM-DD
  status: FoodControlStatus;
  notes?: string;
  xpEarned: number;
  createdAt: string;
}

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

export interface XpTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  source: string;
  description: string;
  amount: number;
  activityKey?: string; // unique key to prevent multi-award in same day
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: HabitCategory | 'general' | 'streak' | 'level';
  requirement: number;
  currentValue: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AppSettings {
  workoutWeeklyGoal: number; // e.g. 4
  readingDailyPagesGoal: number; // e.g. 20
  readingWeeklyPagesGoal: number; // e.g. 140
  budgetDailyLimit: number; // e.g. 80.00
  currency: string;
  xpValues: {
    walk: number;
    run: number;
    workoutWeeklyBonus: number;
    readingDailyGoal: number;
    readingWeeklyBonus: number;
    budgetUnderLimit: number;
    foodControlled: number;
    foodPartial: number;
    subGoalDefault: number;
    streak7Days: number;
    streak30Days: number;
  };
}

export interface DayScoreInfo {
  date: string;
  percent: number;
  label: string;
  emoji: string;
  message: string;
  workoutScore: number;
  readingScore: number;
  budgetScore: number;
  foodScore: number;
  subGoalsScore: number;
  xpEarnedToday: number;
}
