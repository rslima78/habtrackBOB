import { Achievement } from '../types';

export function getFreshAchievements(): Achievement[] {
  return [
    {
      id: 'first_step',
      title: 'Primeiro Passo',
      description: 'Complete sua primeira atividade ou hábito.',
      icon: '🌱',
      category: 'general',
      requirement: 1,
      currentValue: 0,
      unlocked: false
    },
    {
      id: 'streak_7',
      title: 'Uma Semana de Aço',
      description: 'Mantenha uma sequência de 7 dias consecutivos.',
      icon: '🔥',
      category: 'streak',
      requirement: 7,
      currentValue: 0,
      unlocked: false
    },
    {
      id: 'streak_14',
      title: 'Guerreiro da Disciplina',
      description: 'Alcance uma sequência de 14 dias em qualquer hábito.',
      icon: '⚡',
      category: 'streak',
      requirement: 14,
      currentValue: 0,
      unlocked: false
    },
    {
      id: 'streak_30',
      title: 'Disciplina de Ferro',
      description: 'Mantenha uma sequência épica de 30 dias.',
      icon: '🛡️',
      category: 'streak',
      requirement: 30,
      currentValue: 0,
      unlocked: false
    },
    {
      id: 'financial_ninja',
      title: 'Ninja Financeiro',
      description: 'Passe 7 dias dentro do limite de orçamento.',
      icon: '💰',
      category: 'budget',
      requirement: 7,
      currentValue: 0,
      unlocked: false
    },
    {
      id: 'librarian_500',
      title: 'Bibliotecário',
      description: 'Leia um total acumulado de 500 páginas.',
      icon: '📚',
      category: 'reading',
      requirement: 500,
      currentValue: 0,
      unlocked: false
    },
    {
      id: 'marathoner_10',
      title: 'Maratonista',
      description: 'Complete 10 treinos de corrida registrados.',
      icon: '🏃',
      category: 'workout',
      requirement: 10,
      currentValue: 0,
      unlocked: false
    },
    {
      id: 'food_zen_10',
      title: 'Mente Serena na Mesa',
      description: 'Registre 10 dias seguidos de alimentação controlada.',
      icon: '🥗',
      category: 'food',
      requirement: 10,
      currentValue: 0,
      unlocked: false
    },
    {
      id: 'subgoal_master',
      title: 'Mestre das Missões',
      description: 'Conclua 15 subobjetivos com sucesso.',
      icon: '🎯',
      category: 'general',
      requirement: 15,
      currentValue: 0,
      unlocked: false
    },
    {
      id: 'reach_monk_level',
      title: 'Mestre do Autocontrole',
      description: 'Alcance o Nível 5 — Monge (1.000 XP).',
      icon: '🧘',
      category: 'level',
      requirement: 1000,
      currentValue: 0,
      unlocked: false
    },
    {
      id: 'book_worm_3',
      title: 'Devorador de Livros',
      description: 'Termine 3 livros completos.',
      icon: '📖',
      category: 'reading',
      requirement: 3,
      currentValue: 0,
      unlocked: false
    },
    {
      id: 'legend_rank',
      title: 'Lenda Viva',
      description: 'Alcance o Nível 8 (Mestre Supremo).',
      icon: '👑',
      category: 'level',
      requirement: 4000,
      currentValue: 0,
      unlocked: false
    }
  ];
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = getFreshAchievements();
