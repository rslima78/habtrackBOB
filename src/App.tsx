import React, { useState, useEffect } from 'react';
import { AppState, StorageService, formatDate } from './services/storageService';
import { calculateDailyScore } from './services/scoreCalculator';
import { awardXp, triggerLevelUpConfetti } from './services/xpEngine';
import { soundEngine } from './services/audioService';

// Layout & Common
import { Header } from './components/layout/Header';
import { Navigation, TabType } from './components/layout/Navigation';
import { LevelUpModal } from './components/layout/LevelUpModal';
import { FloatingXpToast, XpToastItem } from './components/common/FloatingXpToast';

// Dashboard
import { PlayerHero } from './components/dashboard/PlayerHero';
import { DailyScoreCard } from './components/dashboard/DailyScoreCard';
import { QuickHabitGrid } from './components/dashboard/QuickHabitGrid';
import { NextMilestoneCard } from './components/dashboard/NextMilestoneCard';
import { LevelJourneyModal } from './components/dashboard/LevelJourneyModal';
import { NewHeroModal } from './components/onboarding/NewHeroModal';

// Habits
import { WorkoutsSection } from './components/habits/WorkoutsSection';
import { ReadingSection } from './components/habits/ReadingSection';
import { BudgetSection } from './components/habits/BudgetSection';
import { FoodSection } from './components/habits/FoodSection';
import { SubGoalsSection } from './components/subgoals/SubGoalsSection';

// Calendar, Stats, Achievements, Settings
import { MonthlyCalendar } from './components/calendar/MonthlyCalendar';
import { StatsView } from './components/stats/StatsView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { SettingsView } from './components/settings/SettingsView';

import { WorkoutLog, ReadingLog, Book, ExpenseLog, FoodLog, SubGoal, HabitCategory } from './types';

export const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => StorageService.loadState());
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeHabitSubTab, setActiveHabitSubTab] = useState<HabitCategory | 'subgoals'>('workout');

  // Modals & Celebrations
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const [isLevelJourneyOpen, setIsLevelJourneyOpen] = useState(false);
  const [isNewHeroModalOpen, setIsNewHeroModalOpen] = useState(!state.hasCompletedOnboarding);
  const [xpToasts, setXpToasts] = useState<XpToastItem[]>([]);

  // Sound sync
  useEffect(() => {
    soundEngine.setSoundEnabled(state.user.soundEnabled);
  }, [state.user.soundEnabled]);

  // Persist on state change
  const updateStateAndPersist = (updater: (prev: AppState) => AppState) => {
    setState(prev => {
      const next = updater(prev);
      StorageService.saveState(next);
      return next;
    });
  };

  // Helper to trigger XP Gain with Visual Toast + Audio and optional extra state modification
  const triggerXpAward = (
    amount: number,
    source: string,
    description: string,
    emoji: string,
    activityKey?: string,
    extraStateUpdater?: (current: AppState) => AppState
  ) => {
    setState(prev => {
      const base = extraStateUpdater ? extraStateUpdater(prev) : prev;
      const result = awardXp(base, amount, source, description, activityKey);
      StorageService.saveState(result.newState);

      if (result.xpAwarded > 0) {
        setXpToasts(t => [
          ...t,
          {
            id: `${Date.now()}-${Math.random()}`,
            amount: result.xpAwarded,
            message: description,
            emoji
          }
        ]);
        if (result.leveledUp && result.newLevel) {
          setLevelUpLevel(result.newLevel);
        }
      }
      return result.newState;
    });
  };

  // 1. Workouts handlers
  const handleAddWorkout = (workoutData: Omit<WorkoutLog, 'id' | 'createdAt' | 'xpEarned'>) => {
    const xp = workoutData.type === 'run' ? state.settings.xpValues.run : state.settings.xpValues.walk;
    const newWorkout: WorkoutLog = {
      ...workoutData,
      id: `w-${Date.now()}`,
      xpEarned: xp,
      createdAt: new Date().toISOString()
    };

    triggerXpAward(
      xp,
      'workout',
      `${workoutData.type === 'run' ? 'Corrida' : 'Caminhada'} (${workoutData.distanceKm} km)`,
      workoutData.type === 'run' ? '🏃' : '🚶',
      undefined,
      prev => ({
        ...prev,
        workouts: [...prev.workouts, newWorkout]
      })
    );
  };

  const handleDeleteWorkout = (id: string) => {
    updateStateAndPersist(prev => ({
      ...prev,
      workouts: prev.workouts.filter(w => w.id !== id)
    }));
  };

  // 2. Reading handlers
  const handleAddReadingLog = (logData: Omit<ReadingLog, 'id' | 'createdAt' | 'xpEarned'>) => {
    const xp = state.settings.xpValues.readingDailyGoal;
    const newLog: ReadingLog = {
      ...logData,
      id: `r-${Date.now()}`,
      xpEarned: xp,
      createdAt: new Date().toISOString()
    };

    triggerXpAward(
      xp,
      'reading',
      `Leitura: +${logData.pagesRead} páginas`,
      '📚',
      undefined,
      prev => {
        const updatedBooks = prev.books.map(b => {
          if (b.id === logData.bookId) {
            const newCurrentPage = Math.min(b.totalPages, b.currentPage + logData.pagesRead);
            const isFinished = newCurrentPage >= b.totalPages;
            return {
              ...b,
              currentPage: newCurrentPage,
              status: isFinished ? ('completed' as const) : ('reading' as const),
              finishedAt: isFinished ? formatDate(new Date()) : b.finishedAt
            };
          }
          return b;
        });

        return {
          ...prev,
          readingLogs: [...prev.readingLogs, newLog],
          books: updatedBooks
        };
      }
    );
  };

  const handleAddBook = (bookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...bookData,
      id: `b-${Date.now()}`
    };

    updateStateAndPersist(prev => ({
      ...prev,
      books: [...prev.books, newBook]
    }));
    soundEngine.playPop();
  };

  const handleDeleteReadingLog = (id: string) => {
    updateStateAndPersist(prev => ({
      ...prev,
      readingLogs: prev.readingLogs.filter(r => r.id !== id)
    }));
  };

  // 3. Budget handlers
  const handleAddExpense = (expenseData: Omit<ExpenseLog, 'id' | 'createdAt'>) => {
    const newExpense: ExpenseLog = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    updateStateAndPersist(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));

    soundEngine.playPop();
  };

  const handleDeleteExpense = (id: string) => {
    updateStateAndPersist(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id)
    }));
  };

  // 4. Food handlers
  const handleLogFood = (status: 'controlled' | 'partial' | 'uncontrolled', notes?: string, dateStr?: string) => {
    const targetDate = dateStr || formatDate(new Date());
    const xp = status === 'controlled' ? state.settings.xpValues.foodControlled : status === 'partial' ? state.settings.xpValues.foodPartial : 0;

    const newFoodLog: FoodLog = {
      id: `food-${Date.now()}`,
      date: targetDate,
      status,
      notes,
      xpEarned: xp,
      createdAt: new Date().toISOString()
    };

    updateStateAndPersist(prev => {
      const filtered = prev.foodLogs.filter(f => f.date !== targetDate);
      return {
        ...prev,
        foodLogs: [...filtered, newFoodLog]
      };
    });

    if (xp > 0) {
      triggerXpAward(
        xp,
        'food',
        status === 'controlled' ? 'Alimentação 100% Controlada!' : 'Alimentação Parcialmente Controlada',
        status === 'controlled' ? '😎' : '😐',
        `food-${targetDate}`,
        prev => {
          const filtered = prev.foodLogs.filter(f => f.date !== targetDate);
          return {
            ...prev,
            foodLogs: [...filtered, newFoodLog]
          };
        }
      );
    } else {
      soundEngine.playClick();
      updateStateAndPersist(prev => {
        const filtered = prev.foodLogs.filter(f => f.date !== targetDate);
        return {
          ...prev,
          foodLogs: [...filtered, newFoodLog]
        };
      });
    }
  };

  // 5. Sub-goals handlers
  const handleAddSubGoal = (subGoalData: Omit<SubGoal, 'id' | 'completedDates' | 'createdAt'>) => {
    const newSubGoal: SubGoal = {
      ...subGoalData,
      id: `sg-${Date.now()}`,
      completedDates: [],
      createdAt: new Date().toISOString()
    };

    updateStateAndPersist(prev => ({
      ...prev,
      subGoals: [...prev.subGoals, newSubGoal]
    }));
    soundEngine.playPop();
  };

  const handleDeleteSubGoal = (id: string) => {
    updateStateAndPersist(prev => ({
      ...prev,
      subGoals: prev.subGoals.filter(sg => sg.id !== id)
    }));
  };

  const handleToggleSubGoal = (id: string) => {
    const todayStr = formatDate(new Date());
    const subGoal = state.subGoals.find(sg => sg.id === id);
    if (!subGoal) return;

    const isAlreadyCompleted = subGoal.completedDates.includes(todayStr);

    if (isAlreadyCompleted) {
      // Uncheck
      soundEngine.playClick();
      updateStateAndPersist(prev => ({
        ...prev,
        subGoals: prev.subGoals.map(sg => {
          if (sg.id === id) {
            return {
              ...sg,
              completedDates: sg.completedDates.filter(d => d !== todayStr)
            };
          }
          return sg;
        })
      }));
    } else {
      // Complete & Award XP atomically
      triggerXpAward(
        subGoal.xpValue,
        'subgoal',
        `Micro-Missão: ${subGoal.title}`,
        '🎯',
        `subgoal-${id}-${todayStr}`,
        prev => ({
          ...prev,
          subGoals: prev.subGoals.map(sg => {
            if (sg.id === id) {
              return {
                ...sg,
                completedDates: [...sg.completedDates, todayStr]
              };
            }
            return sg;
          })
        })
      );
    }
  };

  const handleCreateNewHero = (
    name: string,
    goals: { workoutGoal: number; readingGoal: number; budgetLimit: number }
  ) => {
    const fresh = StorageService.createFreshHero(name, {
      workoutWeeklyGoal: goals.workoutGoal,
      readingDailyPagesGoal: goals.readingGoal,
      budgetDailyLimit: goals.budgetLimit
    });
    setState(fresh);
    setIsNewHeroModalOpen(false);
    setActiveTab('home');
  };

  const handleLoadDemoSeed = () => {
    const seed = StorageService.resetToSeed();
    setState(seed);
    setIsNewHeroModalOpen(false);
    setActiveTab('home');
  };

  const handleResetSeed = () => {
    const fresh = StorageService.resetToSeed();
    setState(fresh);
  };

  // Daily Score Info
  const dailyScore = calculateDailyScore(state);

  return (
    <div className="min-h-screen bg-[#0F111A] text-slate-100 pb-20 md:pb-8 flex flex-col">
      
      {/* New Hero Onboarding Modal */}
      {isNewHeroModalOpen && (
        <NewHeroModal
          initialName={state.user.name === 'Meu Herói' ? '' : state.user.name}
          onConfirmNewHero={handleCreateNewHero}
          onLoadDemoSeed={handleLoadDemoSeed}
          canCancel={state.hasCompletedOnboarding}
          onCancel={() => setIsNewHeroModalOpen(false)}
        />
      )}

      {/* Floating XP Gain Toasts */}
      <FloatingXpToast
        toasts={xpToasts}
        onRemove={(id) => setXpToasts(prev => prev.filter(t => t.id !== id))}
      />

      {/* Level Up Celebration Modal */}
      {levelUpLevel && (
        <LevelUpModal
          level={levelUpLevel}
          onClose={() => setLevelUpLevel(null)}
        />
      )}

      {/* Level Journey Road Map Modal */}
      {isLevelJourneyOpen && (
        <LevelJourneyModal
          currentXp={state.user.totalXp}
          onClose={() => setIsLevelJourneyOpen(false)}
        />
      )}

      {/* Header */}
      <Header
        user={state.user}
        onToggleSound={() => {
          const next = !state.user.soundEnabled;
          soundEngine.setSoundEnabled(next);
          updateStateAndPersist(prev => ({
            ...prev,
            user: { ...prev.user, soundEnabled: next }
          }));
        }}
      />

      {/* Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unlockedAchievementsCount={state.achievements.filter(a => a.unlocked).length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* 🏠 TAB 1: INÍCIO (DASHBOARD) */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            
            {/* Player Hero Card */}
            <PlayerHero
              user={state.user}
              onOpenLevelInfo={() => setIsLevelJourneyOpen(true)}
            />

            {/* Daily Score ("Nível de Controle de Hoje") */}
            <DailyScoreCard
              scoreInfo={dailyScore}
              onOpenCalendar={() => setActiveTab('calendar')}
            />

            {/* Quick 4 Habits Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <span>🎯</span> Missões & Hábitos Principais
                </h2>
                <button
                  onClick={() => setActiveTab('habits')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
                >
                  Ver Todos
                </button>
              </div>

              <QuickHabitGrid
                state={state}
                onOpenWorkoutModal={() => {
                  setActiveTab('habits');
                  setActiveHabitSubTab('workout');
                }}
                onOpenReadingModal={() => {
                  setActiveTab('habits');
                  setActiveHabitSubTab('reading');
                }}
                onOpenExpenseModal={() => {
                  setActiveTab('habits');
                  setActiveHabitSubTab('budget');
                }}
                onQuickFoodLog={(status) => handleLogFood(status)}
                onNavigateToHabit={(hKey) => {
                  setActiveTab('habits');
                  setActiveHabitSubTab(hKey as HabitCategory);
                }}
              />
            </div>

            {/* Next Milestone & Sub-goals */}
            <NextMilestoneCard
              state={state}
              onToggleSubGoal={handleToggleSubGoal}
              onNavigateToTab={(t) => setActiveTab(t)}
            />

          </div>
        )}

        {/* 🎯 TAB 2: HÁBITOS (SUB-TABS) */}
        {activeTab === 'habits' && (
          <div className="space-y-6">
            
            {/* Habits Navigation Sub-Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {[
                { id: 'workout' as const, label: '🏃 Treinos' },
                { id: 'reading' as const, label: '📚 Leitura' },
                { id: 'budget' as const, label: '💰 Orçamento' },
                { id: 'food' as const, label: '🍔 Alimentação' },
                { id: 'subgoals' as const, label: '🎯 Subobjetivos' },
              ].map(subTab => (
                <button
                  key={subTab.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveHabitSubTab(subTab.id);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black border transition-all cursor-pointer whitespace-nowrap ${
                    activeHabitSubTab === subTab.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-game-purple'
                      : 'bg-[#171A29] text-slate-300 border-[#282E47] hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            {/* Sub-tab view components */}
            {activeHabitSubTab === 'workout' && (
              <WorkoutsSection
                workouts={state.workouts}
                subGoals={state.subGoals}
                settings={state.settings}
                onAddWorkout={handleAddWorkout}
                onDeleteWorkout={handleDeleteWorkout}
                onToggleSubGoal={handleToggleSubGoal}
              />
            )}

            {activeHabitSubTab === 'reading' && (
              <ReadingSection
                books={state.books}
                readingLogs={state.readingLogs}
                subGoals={state.subGoals}
                settings={state.settings}
                onAddReadingLog={handleAddReadingLog}
                onAddBook={handleAddBook}
                onDeleteReadingLog={handleDeleteReadingLog}
                onToggleSubGoal={handleToggleSubGoal}
              />
            )}

            {activeHabitSubTab === 'budget' && (
              <BudgetSection
                expenses={state.expenses}
                subGoals={state.subGoals}
                settings={state.settings}
                onAddExpense={handleAddExpense}
                onDeleteExpense={handleDeleteExpense}
                onToggleSubGoal={handleToggleSubGoal}
              />
            )}

            {activeHabitSubTab === 'food' && (
              <FoodSection
                foodLogs={state.foodLogs}
                subGoals={state.subGoals}
                onLogFood={handleLogFood}
                onToggleSubGoal={handleToggleSubGoal}
              />
            )}

            {activeHabitSubTab === 'subgoals' && (
              <SubGoalsSection
                subGoals={state.subGoals}
                onAddSubGoal={handleAddSubGoal}
                onDeleteSubGoal={handleDeleteSubGoal}
                onToggleSubGoal={handleToggleSubGoal}
              />
            )}

          </div>
        )}

        {/* 📅 TAB 3: CALENDÁRIO */}
        {activeTab === 'calendar' && (
          <MonthlyCalendar state={state} />
        )}

        {/* 📊 TAB 4: ESTATÍSTICAS */}
        {activeTab === 'stats' && (
          <StatsView state={state} />
        )}

        {/* 🏆 TAB 5: CONQUISTAS */}
        {activeTab === 'achievements' && (
          <AchievementsView achievements={state.achievements} />
        )}

        {/* ⚙️ TAB 6: CONFIGURAÇÕES */}
        {activeTab === 'settings' && (
          <SettingsView
            state={state}
            onUpdateState={updateStateAndPersist}
            onOpenNewHeroModal={() => setIsNewHeroModalOpen(true)}
            onResetSeed={handleResetSeed}
            onShowLevelUpTest={() => {
              triggerLevelUpConfetti();
              soundEngine.playLevelUp();
              setLevelUpLevel(5);
            }}
          />
        )}

      </main>

    </div>
  );
};

export default App;
