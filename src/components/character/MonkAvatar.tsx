import React from 'react';

interface MonkAvatarProps {
  level: number;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isAnimated?: boolean;
  className?: string;
}

export const MonkAvatar: React.FC<MonkAvatarProps> = ({
  level,
  size = 'md',
  isAnimated = true,
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    '2xl': 'w-44 h-44'
  };

  const getAvatarContent = () => {
    switch (level) {
      case 1: // 🥚 Novato - Cute Egg with Eyes and Sweatdrop
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="eggGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="100%" stopColor="#FDE68A" />
              </linearGradient>
            </defs>
            {/* Egg Body */}
            <path
              d="M50 12 C30 12 18 40 18 68 C18 84 32 92 50 92 C68 92 82 84 82 68 C82 40 70 12 50 12 Z"
              fill="url(#eggGrad)"
              stroke="#D97706"
              strokeWidth="3.5"
            />
            {/* Blushing cheeks */}
            <circle cx="34" cy="62" r="5" fill="#FCA5A5" opacity="0.7" />
            <circle cx="66" cy="62" r="5" fill="#FCA5A5" opacity="0.7" />
            {/* Eyes */}
            <circle cx="38" cy="54" r="3.5" fill="#1E293B" />
            <circle cx="62" cy="54" r="3.5" fill="#1E293B" />
            <circle cx="39.5" cy="52.5" r="1.2" fill="#FFFFFF" />
            <circle cx="63.5" cy="52.5" r="1.2" fill="#FFFFFF" />
            {/* Cute Smile */}
            <path d="M46 62 Q50 67 54 62" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Tiny Bandana on Egg */}
            <path d="M22 42 Q50 36 78 42" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" fill="none" />
            <circle cx="21" cy="42" r="3" fill="#DC2626" />
          </svg>
        );

      case 2: // 🐣 Aprendiz - Cute Hatchling Ninja
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="chickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
            {/* Broken Egg Shell Bottom */}
            <path d="M22 65 L32 55 L42 65 L50 54 L60 65 L70 55 L78 65 C80 82 72 90 50 90 C28 90 20 82 22 65 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
            {/* Chick Head & Body */}
            <circle cx="50" cy="45" r="28" fill="url(#chickGrad)" stroke="#D97706" strokeWidth="3" />
            {/* Blue Ribbon/Bandana */}
            <path d="M24 38 Q50 30 76 38" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Eyes */}
            <circle cx="40" cy="44" r="3.5" fill="#0F172A" />
            <circle cx="60" cy="44" r="3.5" fill="#0F172A" />
            <circle cx="41.5" cy="42.5" r="1.2" fill="#FFFFFF" />
            <circle cx="61.5" cy="42.5" r="1.2" fill="#FFFFFF" />
            {/* Orange Beak */}
            <polygon points="50,47 44,54 56,54" fill="#EA580C" />
            {/* Wing */}
            <path d="M25 50 Q16 46 22 58 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          </svg>
        );

      case 3: // 🥷 Ninja Iniciante - Purple Masked Ninja
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="ninja3Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>
            </defs>
            {/* Ninja Hood */}
            <circle cx="50" cy="50" r="35" fill="url(#ninja3Grad)" stroke="#0F172A" strokeWidth="3" />
            {/* Mask Opening */}
            <ellipse cx="50" cy="46" rx="20" ry="11" fill="#FED7AA" stroke="#0F172A" strokeWidth="2.5" />
            {/* Purple Headband */}
            <path d="M16 34 Q50 25 84 34" stroke="#818CF8" strokeWidth="7" strokeLinecap="round" fill="none" />
            {/* Headband Tails */}
            <path d="M82 34 Q92 38 88 48" stroke="#818CF8" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Sharp Focused Eyes */}
            <path d="M36 45 Q43 47 47 44" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M64 45 Q57 47 53 44" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="43" cy="47" r="2" fill="#0F172A" />
            <circle cx="57" cy="47" r="2" fill="#0F172A" />
            {/* Shuriken Icon on Forehead */}
            <circle cx="50" cy="27" r="4" fill="#F8FAFC" />
          </svg>
        );

      case 4: // 🥷⚔️ Ninja Avançado - Robson's current level!
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            <defs>
              <linearGradient id="ninja4Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#312E81" />
                <stop offset="100%" stopColor="#1E1B4B" />
              </linearGradient>
              <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
            </defs>
            {/* Dual Katana crossed behind */}
            <line x1="12" y1="12" x2="88" y2="88" stroke="url(#bladeGrad)" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="88" y1="12" x2="12" y2="88" stroke="url(#bladeGrad)" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="16" cy="16" r="4" fill="#F59E0B" />
            <circle cx="84" cy="16" r="4" fill="#F59E0B" />
            {/* Ninja Head */}
            <circle cx="50" cy="50" r="33" fill="url(#ninja4Grad)" stroke="#6366F1" strokeWidth="3" />
            {/* Glowing Purple Mask Cutout */}
            <ellipse cx="50" cy="46" rx="20" ry="11" fill="#FCD34D" stroke="#4338CA" strokeWidth="2.5" />
            {/* Master Bandana with Knot */}
            <path d="M18 34 Q50 24 82 34" stroke="#A855F7" strokeWidth="8" strokeLinecap="round" fill="none" />
            {/* Gold Insignia on forehead */}
            <polygon points="50,26 53,32 47,32" fill="#F59E0B" />
            {/* Determined Anime Eyes */}
            <polygon points="36,44 46,47 43,49 35,46" fill="#1E1B4B" />
            <polygon points="64,44 54,47 57,49 65,46" fill="#1E1B4B" />
            <circle cx="43" cy="46" r="1.5" fill="#FFFFFF" />
            <circle cx="57" cy="46" r="1.5" fill="#FFFFFF" />
            {/* Scarf tail waving */}
            <path d="M80 34 C94 40 92 56 86 64" stroke="#A855F7" strokeWidth="5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 5: // 🧘 Monge - Zen Master Floating with Glow
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            <defs>
              <linearGradient id="monkRobe" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            {/* Golden Zen Aura */}
            <circle cx="50" cy="48" r="42" fill="#FEF3C7" opacity="0.25" className="animate-pulse" />
            {/* Shaved Head Monk */}
            <circle cx="50" cy="38" r="22" fill="#FED7AA" stroke="#EA580C" strokeWidth="2.5" />
            {/* 6 Monk Incense Marks on forehead */}
            <circle cx="46" cy="24" r="1" fill="#EA580C" />
            <circle cx="50" cy="24" r="1" fill="#EA580C" />
            <circle cx="54" cy="24" r="1" fill="#EA580C" />
            <circle cx="46" cy="28" r="1" fill="#EA580C" />
            <circle cx="50" cy="28" r="1" fill="#EA580C" />
            <circle cx="54" cy="28" r="1" fill="#EA580C" />
            {/* Serene Peaceful Closed Eyes */}
            <path d="M38 38 Q43 43 48 38" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M52 38 Q57 43 62 38" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Calm Smile */}
            <path d="M46 47 Q50 51 54 47" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Orange Monk Robe & Folded Hands */}
            <path d="M24 68 Q50 56 76 68 L80 90 Q50 94 20 90 Z" fill="url(#monkRobe)" stroke="#B45309" strokeWidth="3" />
            {/* Prayer Beads / Mala Necklace */}
            <path d="M36 60 Q50 74 64 60" stroke="#78350F" strokeWidth="3.5" strokeDasharray="2,5" strokeLinecap="round" fill="none" />
            {/* Folded Hands in Namaste */}
            <ellipse cx="50" cy="72" rx="7" ry="5" fill="#FED7AA" stroke="#B45309" strokeWidth="1.5" />
          </svg>
        );

      case 6: // 🥋 Mestre - Martial Arts Gi & Black Belt
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="36" r="22" fill="#FDE68A" stroke="#059669" strokeWidth="2.5" />
            {/* White/Green Headband */}
            <path d="M28 26 Q50 18 72 26" stroke="#10B981" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Confident Brow & Eyes */}
            <path d="M36 34 L45 37" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M64 34 L55 37" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="43" cy="38" r="2.5" fill="#064E3B" />
            <circle cx="57" cy="38" r="2.5" fill="#064E3B" />
            {/* Smirk */}
            <path d="M47 46 Q53 49 57 44" stroke="#064E3B" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Gi Uniform */}
            <path d="M22 62 L50 56 L78 62 L82 92 L18 92 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="3" />
            <path d="M30 60 L50 78 L70 60" stroke="#0F172A" strokeWidth="2.5" fill="none" />
            {/* Black Belt */}
            <rect x="26" y="76" width="48" height="8" rx="2" fill="#0F172A" />
            <path d="M46 84 L44 94 M54 84 L56 94" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );

      case 7: // 🦸 Guardião - Discipline Superhero with Cape
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            {/* Red Flowing Cape */}
            <path d="M20 40 Q50 20 80 40 L90 92 Q50 82 10 92 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="3" />
            {/* Head */}
            <circle cx="50" cy="38" r="22" fill="#FED7AA" stroke="#1E293B" strokeWidth="2.5" />
            {/* Pink Hero Mask */}
            <path d="M30 34 Q50 42 70 34 Q64 48 50 44 Q36 48 30 34 Z" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
            {/* Glowing Hero Eyes */}
            <ellipse cx="42" cy="36" rx="3.5" ry="2" fill="#FFFFFF" />
            <ellipse cx="58" cy="36" rx="3.5" ry="2" fill="#FFFFFF" />
            {/* Confident Hero Smile */}
            <path d="M44 48 Q50 54 56 48" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Chest Armor with 'M' Emblem */}
            <path d="M26 62 Q50 56 74 62 L78 92 L22 92 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
            <polygon points="50,66 58,74 50,86 42,74" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
            <text x="50" y="79" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#1E293B">M</text>
          </svg>
        );

      case 8: // 🧙 Mestre Supremo - Mystic Wizard Monk with Staff
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
            {/* Starry Nebula Aura */}
            <circle cx="50" cy="50" r="44" fill="#818CF8" opacity="0.2" className="animate-pulse" />
            {/* Mystic Hat / Hood */}
            <path d="M20 42 Q50 6 80 42 Z" fill="#4F46E5" stroke="#3730A3" strokeWidth="3" />
            <ellipse cx="50" cy="42" rx="36" ry="7" fill="#6366F1" stroke="#3730A3" strokeWidth="2" />
            {/* Face with Long White Beard */}
            <circle cx="50" cy="46" r="18" fill="#FED7AA" />
            {/* Wise Eyes with Sparkle */}
            <circle cx="44" cy="44" r="2.5" fill="#312E81" />
            <circle cx="56" cy="44" r="2.5" fill="#312E81" />
            <circle cx="45" cy="43" r="0.8" fill="#FFFFFF" />
            <circle cx="57" cy="43" r="0.8" fill="#FFFFFF" />
            {/* Flowing White Mystic Beard */}
            <path d="M38 52 Q50 90 62 52 Q56 70 50 78 Q44 70 38 52 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
            {/* Robes */}
            <path d="M22 66 Q50 60 78 66 L84 94 L16 94 Z" fill="#4338CA" stroke="#312E81" strokeWidth="3" />
            {/* Mystic Crystal Orb on staff */}
            <circle cx="82" cy="30" r="8" fill="#38BDF8" className="animate-bounce" />
            <line x1="82" y1="38" x2="82" y2="94" stroke="#92400E" strokeWidth="3.5" />
          </svg>
        );

      case 9: // 👑 Lenda - Golden Crowned Emperor of Willpower
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
            {/* Gold Crown */}
            <polygon points="32,26 40,12 50,22 60,12 68,26" fill="#FACC15" stroke="#B45309" strokeWidth="2.5" />
            <circle cx="40" cy="12" r="2" fill="#EF4444" />
            <circle cx="50" cy="22" r="2.5" fill="#3B82F6" />
            <circle cx="60" cy="12" r="2" fill="#10B981" />
            {/* Face */}
            <circle cx="50" cy="44" r="22" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
            {/* Golden Sunglasses / Visor */}
            <path d="M34 40 L66 40 L62 48 L38 48 Z" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
            <line x1="38" y1="42" x2="48" y2="46" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />
            {/* Confident Royal Grin */}
            <path d="M44 54 Q50 60 56 54" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Royal Gold Mantle */}
            <path d="M20 66 Q50 58 80 66 L86 94 L14 94 Z" fill="#EAB308" stroke="#854D0E" strokeWidth="3.5" />
            <circle cx="50" cy="74" r="6" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        );

      case 10: // ✨ Iluminado - Cosmic God of Self-Control
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
            {/* Cosmic Rainbow Rings */}
            <circle cx="50" cy="50" r="46" fill="none" stroke="#F43F5E" strokeWidth="2" opacity="0.6" className="animate-spin" style={{ animationDuration: '8s' }} strokeDasharray="10, 6" />
            <circle cx="50" cy="50" r="41" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.7" className="animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} strokeDasharray="8, 5" />
            <circle cx="50" cy="50" r="36" fill="#FDF4FF" opacity="0.25" />
            {/* Glowing Golden Monk Head */}
            <circle cx="50" cy="42" r="22" fill="#FEF08A" stroke="#F59E0B" strokeWidth="3" />
            {/* Third Eye Glowing */}
            <polygon points="50,26 53,31 50,36 47,31" fill="#06B6D4" className="animate-pulse" />
            {/* Divine Eyes */}
            <path d="M38 42 Q43 47 48 42" stroke="#4C1D95" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M52 42 Q57 47 62 42" stroke="#4C1D95" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Gentle Enlightened Smile */}
            <path d="M45 52 Q50 56 55 52" stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Cosmic Robes */}
            <path d="M22 66 Q50 58 78 66 L84 94 L16 94 Z" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="3" />
            {/* Lotus Flower Base */}
            <path d="M30 90 Q50 78 70 90 Q50 96 30 90 Z" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-3xl bg-slate-900/60 p-1.5 border-2 border-slate-700/60 shadow-game ${sizeMap[size]} ${
        isAnimated ? 'hover:scale-105 transition-transform duration-200' : ''
      } ${className}`}
    >
      {getAvatarContent()}
      {/* Small level badge pill */}
      <span className="absolute -bottom-1.5 -right-1.5 bg-gradient-to-r from-purple-600 to-amber-500 text-white font-black text-[10px] px-1.5 py-0.5 rounded-full border border-slate-900 shadow-md">
        Lv.{level}
      </span>
    </div>
  );
};
