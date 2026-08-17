import { LevelInfo } from '../types';

export const LEVELS: LevelInfo[] = [
  {
    level: 1,
    minXp: 0,
    maxXp: 100,
    title: 'Novato',
    emoji: '🥚',
    avatarId: 'novato',
    description: 'A jornada de mil milhas começa com um único ovo de disciplina.',
    color: '#94A3B8'
  },
  {
    level: 2,
    minXp: 100,
    maxXp: 300,
    title: 'Aprendiz',
    emoji: '🐣',
    avatarId: 'aprendiz',
    description: 'O casulo se rompeu. Você está descobrindo o poder dos hábitos!',
    color: '#38BDF8'
  },
  {
    level: 3,
    minXp: 300,
    maxXp: 600,
    title: 'Ninja Iniciante',
    emoji: '🥷',
    avatarId: 'ninja_iniciante',
    description: 'Silencioso e consistente. O foco começa a se afiar como uma lâmina.',
    color: '#818CF8'
  },
  {
    level: 4,
    minXp: 600,
    maxXp: 1000,
    title: 'Ninja',
    emoji: '🥷⚔️',
    avatarId: 'ninja',
    description: 'Ágil nas decisões e firme nas metas diárias. Você já não vacila fácil!',
    color: '#A855F7'
  },
  {
    level: 5,
    minXp: 1000,
    maxXp: 1500,
    title: 'Monge',
    emoji: '🧘',
    avatarId: 'monge',
    description: 'Paz de espírito inabalável. O autocontrole se tornou sua segunda natureza.',
    color: '#F59E0B'
  },
  {
    level: 6,
    minXp: 1500,
    maxXp: 2500,
    title: 'Mestre',
    emoji: '🥋',
    avatarId: 'mestre',
    description: 'A disciplina não é mais um esforço, é a sua identidade diária.',
    color: '#10B981'
  },
  {
    level: 7,
    minXp: 2500,
    maxXp: 4000,
    title: 'Guardião da Disciplina',
    emoji: '🦸',
    avatarId: 'guardiao',
    description: 'Um escudo impenetrável contra a procrastinação e o descontrole.',
    color: '#EC4899'
  },
  {
    level: 8,
    minXp: 4000,
    maxXp: 6000,
    title: 'Mestre Supremo',
    emoji: '🧙',
    avatarId: 'mestre_supremo',
    description: 'Sabedoria, força e constância absoluta em cada respiração.',
    color: '#6366F1'
  },
  {
    level: 9,
    minXp: 6000,
    maxXp: 10000,
    title: 'Lenda do Autocontrole',
    emoji: '👑',
    avatarId: 'lenda',
    description: 'Poucos chegaram aqui. Sua determinação inspira todos ao seu redor.',
    color: '#EAB308'
  },
  {
    level: 10,
    minXp: 10000,
    maxXp: 999999,
    title: 'Iluminado',
    emoji: '✨🧘‍♂️✨',
    avatarId: 'iluminado',
    description: 'Atingiu a iluminação suprema do Modo Monge. Mestre supremo da própria mente!',
    color: '#F43F5E'
  }
];

export interface LevelProgress {
  currentLevel: LevelInfo;
  nextLevel: LevelInfo | null;
  xpInCurrentLevel: number;
  xpRequiredForNext: number;
  xpLeft: number;
  percentage: number;
}

export function getLevelProgress(totalXp: number): LevelProgress {
  const currentLvlIndex = LEVELS.findIndex((lvl, idx) => {
    const nextLvl = LEVELS[idx + 1];
    if (!nextLvl) return true;
    return totalXp >= lvl.minXp && totalXp < lvl.maxXp;
  });

  const currentLevel = LEVELS[currentLvlIndex >= 0 ? currentLvlIndex : 0];
  const nextLevel = currentLvlIndex < LEVELS.length - 1 ? LEVELS[currentLvlIndex + 1] : null;

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      xpInCurrentLevel: totalXp - currentLevel.minXp,
      xpRequiredForNext: 0,
      xpLeft: 0,
      percentage: 100
    };
  }

  const xpRequiredForNext = currentLevel.maxXp - currentLevel.minXp;
  const xpInCurrentLevel = Math.max(0, totalXp - currentLevel.minXp);
  const xpLeft = Math.max(0, currentLevel.maxXp - totalXp);
  const percentage = Math.min(100, Math.round((xpInCurrentLevel / xpRequiredForNext) * 100));

  return {
    currentLevel,
    nextLevel,
    xpInCurrentLevel,
    xpRequiredForNext,
    xpLeft,
    percentage
  };
}

export function getLevelUpCelebrationMessage(level: number): string {
  const messages: Record<number, string> = {
    2: "Você deu seus primeiros passos e saiu do ovo! O caminho da disciplina se abre.",
    3: "Você adquiriu agilidade ninja! A tentação já tem medo de você.",
    4: "Você está ficando perigoso! Mente afiada e rotina blindada.",
    5: "MODO MONGE ATIVADO! Você desbloqueou a serenidade e o foco supremo.",
    6: "Faixa preta no autocontrole! Seu exemplo move montanhas.",
    7: "Guardião lendário! Procrastinação derrotada sem piedade.",
    8: "Poder supremo desbloqueado! A consistência virou sua arte.",
    9: "Status de LENDA VIVA alcançado! Você domina o tempo e a mente.",
    10: "ILUMINAÇÃO MÁXIMA! Você é o Mestre Supremo do Modo Monge!"
  };
  return messages[level] || "Parabéns pela evolução constante!";
}
