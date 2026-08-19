import {
  UserProfile,
  WorkoutLog,
  Book,
  ReadingLog,
  ExpenseLog,
  FoodLog,
  SubGoal,
  XpTransaction,
  Achievement,
  AppSettings,
  ExpenseCategory
} from '../types';
import { getFreshAchievements } from './achievementsConfig';
import { evaluateAchievements } from './achievementsEngine';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'food', name: 'Alimentação', icon: '🍔', color: '#EF4444' },
  { id: 'transport', name: 'Transporte', icon: '🚗', color: '#3B82F6' },
  { id: 'home', name: 'Casa & Contas', icon: '🏠', color: '#8B5CF6' },
  { id: 'leisure', name: 'Lazer', icon: '🎮', color: '#F59E0B' },
  { id: 'shopping', name: 'Compras', icon: '🛍️', color: '#EC4899' },
  { id: 'health', name: 'Saúde & Farmácia', icon: '💊', color: '#10B981' },
  { id: 'other', name: 'Outros', icon: '📦', color: '#64748B' },
];

export const DEFAULT_SETTINGS: AppSettings = {
  workoutWeeklyGoal: 4,
  readingDailyPagesGoal: 20,
  readingWeeklyPagesGoal: 140,
  budgetDailyLimit: 80.0,
  currency: 'R$',
  xpValues: {
    walk: 20,
    run: 40,
    workoutWeeklyBonus: 100,
    readingDailyGoal: 20,
    readingWeeklyBonus: 80,
    budgetUnderLimit: 30,
    foodControlled: 30,
    foodPartial: 10,
    subGoalDefault: 10,
    streak7Days: 100,
    streak30Days: 500,
  }
};

export interface AppState {
  user: UserProfile;
  workouts: WorkoutLog[];
  books: Book[];
  readingLogs: ReadingLog[];
  expenses: ExpenseLog[];
  foodLogs: FoodLog[];
  subGoals: SubGoal[];
  xpTransactions: XpTransaction[];
  achievements: Achievement[];
  settings: AppSettings;
  hasCompletedOnboarding: boolean;
}

const STORAGE_KEY = 'modo_monge_app_state_v2';

// Helper to format Date to YYYY-MM-DD
export function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 1. Create a 100% Fresh "Novo Herói" (Level 1 Novato, 0 XP, Clean slate)
export function createNewHeroState(
  heroName: string = 'Guerreiro da Disciplina',
  customSettings?: Partial<AppSettings>
): AppState {
  const todayStr = formatDate(new Date());

  const starterSubGoals: SubGoal[] = [
    {
      id: 'sg-start-1',
      habitCategory: 'workout',
      title: 'Completar 20 min de treino ou caminhada',
      periodicity: 'daily',
      xpValue: 10,
      completedDates: [],
      createdAt: todayStr
    },
    {
      id: 'sg-start-2',
      habitCategory: 'reading',
      title: 'Ler 15 min sem mexer no celular',
      periodicity: 'daily',
      xpValue: 10,
      completedDates: [],
      createdAt: todayStr
    },
    {
      id: 'sg-start-3',
      habitCategory: 'budget',
      title: 'Anotar todo cafezinho ou gasto de hoje',
      periodicity: 'daily',
      xpValue: 10,
      completedDates: [],
      createdAt: todayStr
    },
    {
      id: 'sg-start-4',
      habitCategory: 'food',
      title: 'Beber 2 litros de água e evitar exageros',
      periodicity: 'daily',
      xpValue: 10,
      completedDates: [],
      createdAt: todayStr
    }
  ];

  const user: UserProfile = {
    name: heroName.trim() || 'Guerreiro',
    totalXp: 0, // Level 1 - 🥚 Novato (0 XP)
    soundEnabled: true,
    theme: 'dark',
    createdAt: new Date().toISOString()
  };

  return {
    user,
    workouts: [],
    books: [],
    readingLogs: [],
    expenses: [],
    foodLogs: [],
    subGoals: starterSubGoals,
    xpTransactions: [],
    achievements: getFreshAchievements(),
    settings: {
      ...DEFAULT_SETTINGS,
      ...customSettings
    },
    hasCompletedOnboarding: true
  };
}

// 2. Realistic 30 Days Demo Seed Data (Robson Nível 4 Ninja com 740 XP)
export function generateSeedData(): AppState {
  const today = new Date();
  const todayStr = formatDate(today);

  const books: Book[] = [
    {
      id: 'book-1',
      title: 'Hábitos Atômicos',
      author: 'James Clear',
      totalPages: 320,
      currentPage: 184,
      status: 'reading',
      color: '#F59E0B',
      startedAt: '2026-07-25'
    },
    {
      id: 'book-2',
      title: 'O Poder do Hábito',
      author: 'Charles Duhigg',
      totalPages: 408,
      currentPage: 408,
      status: 'completed',
      color: '#3B82F6',
      startedAt: '2026-07-01',
      finishedAt: '2026-07-24'
    }
  ];

  const workouts: WorkoutLog[] = [];
  for (let i = 28; i >= 0; i -= 2) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dStr = formatDate(d);
    if (i % 3 === 0) {
      workouts.push({
        id: `workout-${i}`,
        date: dStr,
        type: 'run',
        distanceKm: 5.2,
        durationMin: 32,
        notes: 'Corrida matinal no parque. Ritmo excelente!',
        xpEarned: 40,
        createdAt: d.toISOString()
      });
    } else if (i % 2 === 0) {
      workouts.push({
        id: `workout-${i}`,
        date: dStr,
        type: 'walk',
        distanceKm: 3.5,
        durationMin: 40,
        notes: 'Caminhada regenerativa ao fim da tarde.',
        xpEarned: 20,
        createdAt: d.toISOString()
      });
    }
  }

  const readingLogs: ReadingLog[] = [];
  for (let i = 28; i >= 1; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dStr = formatDate(d);
    const pages = 18 + (i % 15);
    readingLogs.push({
      id: `reading-${i}`,
      date: dStr,
      bookId: 'book-1',
      bookTitle: 'Hábitos Atômicos',
      pagesRead: pages,
      durationMin: Math.round(pages * 1.5),
      notes: 'Capítulo sobre empilhamento de hábitos.',
      xpEarned: 20,
      createdAt: d.toISOString()
    });
  }
  readingLogs.push({
    id: `reading-today`,
    date: todayStr,
    bookId: 'book-1',
    bookTitle: 'Hábitos Atômicos',
    pagesRead: 32,
    durationMin: 45,
    notes: 'Leitura antes de dormir. Meta superada!',
    xpEarned: 20,
    createdAt: today.toISOString()
  });

  const expenses: ExpenseLog[] = [];
  for (let i = 28; i >= 1; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dStr = formatDate(d);
    const amt = i === 14 ? 92.5 : 35 + (i % 35);
    expenses.push({
      id: `exp-${i}-1`,
      date: dStr,
      amount: amt,
      categoryId: i % 2 === 0 ? 'food' : 'transport',
      description: i % 2 === 0 ? 'Almoço executivo' : 'Transporte / Uber',
      paymentMethod: 'pix',
      createdAt: d.toISOString()
    });
  }
  expenses.push({
    id: `exp-today-1`,
    date: todayStr,
    amount: 32.50,
    categoryId: 'food',
    description: 'Almoço saudável',
    paymentMethod: 'cartao',
    createdAt: today.toISOString()
  });
  expenses.push({
    id: `exp-today-2`,
    date: todayStr,
    amount: 15.00,
    categoryId: 'transport',
    description: 'Metrô / Passagem',
    paymentMethod: 'pix',
    createdAt: today.toISOString()
  });

  const foodLogs: FoodLog[] = [];
  for (let i = 12; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    foodLogs.push({
      id: `food-${i}`,
      date: formatDate(d),
      status: 'controlled',
      notes: 'Alimentação equilibrada!',
      xpEarned: 30,
      createdAt: d.toISOString()
    });
  }

  const subGoals: SubGoal[] = [
    {
      id: 'sg-1',
      habitCategory: 'workout',
      title: 'Correr pelo menos 3 km',
      periodicity: 'daily',
      xpValue: 10,
      completedDates: [todayStr],
      createdAt: '2026-08-01'
    },
    {
      id: 'sg-2',
      habitCategory: 'workout',
      title: 'Fazer 10 min de alongamento',
      periodicity: 'daily',
      xpValue: 10,
      completedDates: [todayStr],
      createdAt: '2026-08-01'
    },
    {
      id: 'sg-3',
      habitCategory: 'reading',
      title: 'Ler 20 min sem celular',
      periodicity: 'daily',
      xpValue: 10,
      completedDates: [todayStr],
      createdAt: '2026-08-01'
    },
    {
      id: 'sg-4',
      habitCategory: 'budget',
      title: 'Anotar todo cafezinho no app',
      periodicity: 'daily',
      xpValue: 10,
      completedDates: [todayStr],
      createdAt: '2026-08-01'
    }
  ];

  const xpTransactions: XpTransaction[] = [
    { id: 'xp-1', date: todayStr, source: 'workout', description: 'Corrida matinal 5km', amount: 40, createdAt: today.toISOString() },
    { id: 'xp-2', date: todayStr, source: 'reading', description: 'Leitura diária batida', amount: 20, createdAt: today.toISOString() },
    { id: 'xp-3', date: todayStr, source: 'food', description: 'Dia controlado', amount: 30, createdAt: today.toISOString() },
  ];

  const user: UserProfile = {
    name: 'Robson',
    totalXp: 740,
    soundEnabled: true,
    theme: 'dark',
    createdAt: '2026-07-15T00:00:00Z'
  };

  return {
    user,
    workouts,
    books,
    readingLogs,
    expenses,
    foodLogs,
    subGoals,
    xpTransactions,
    achievements: getFreshAchievements(),
    settings: DEFAULT_SETTINGS,
    hasCompletedOnboarding: true
  };
}

// Storage Manager
export class StorageService {
  public static loadState(): AppState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // First access: return fresh new hero prompt state
        const fresh = createNewHeroState('Meu Herói');
        fresh.hasCompletedOnboarding = false; // Flag to trigger New Hero modal
        return fresh;
      }
      const parsed = JSON.parse(raw);
      const loaded: AppState = {
        user: parsed.user || { name: 'Meu Herói', totalXp: 0, soundEnabled: true, theme: 'dark', createdAt: new Date().toISOString() },
        workouts: parsed.workouts || [],
        books: parsed.books || [],
        readingLogs: parsed.readingLogs || [],
        expenses: parsed.expenses || [],
        foodLogs: parsed.foodLogs || [],
        subGoals: parsed.subGoals || [],
        xpTransactions: parsed.xpTransactions || [],
        achievements: parsed.achievements || getFreshAchievements(),
        settings: parsed.settings || DEFAULT_SETTINGS,
        hasCompletedOnboarding: parsed.hasCompletedOnboarding ?? true
      };
      const evalResult = evaluateAchievements(loaded);
      return {
        ...loaded,
        achievements: evalResult.achievements
      };
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
      const fresh = createNewHeroState('Meu Herói');
      fresh.hasCompletedOnboarding = false;
      return fresh;
    }
  }

  public static saveState(state: AppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
  }

  public static createFreshHero(name: string, goals?: Partial<AppSettings>): AppState {
    const fresh = createNewHeroState(name, goals);
    this.saveState(fresh);
    return fresh;
  }

  public static resetToSeed(): AppState {
    const seed = generateSeedData();
    const evalResult = evaluateAchievements(seed);
    const finalizedSeed = { ...seed, achievements: evalResult.achievements };
    this.saveState(finalizedSeed);
    return finalizedSeed;
  }

  public static exportBackup(state: AppState): void {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `modo_monge_heroi_${state.user.name.toLowerCase().replace(/\s+/g, '_')}_${formatDate(new Date())}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  public static importBackup(jsonString: string): AppState {
    const parsed = JSON.parse(jsonString);
    if (!parsed.user || !parsed.settings) {
      throw new Error('Formato de backup inválido.');
    }
    const evalResult = evaluateAchievements(parsed);
    const finalized = { ...parsed, achievements: evalResult.achievements };
    this.saveState(finalized);
    return finalized;
  }
}
