/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        monk: {
          bg: '#0F111A',
          card: '#181B2A',
          cardHover: '#202438',
          cardBorder: '#2E344D',
          primary: '#8B5CF6',     // Epic Violet
          primaryLight: '#A78BFA',
          accent: '#F59E0B',      // Gold / XP
          accentHover: '#D97706',
          green: '#10B981',       // Success / Emerald
          greenLight: '#34D399',
          orange: '#F97316',      // Fire / Streaks
          coral: '#EF4444',       // Alert / Uncontrolled
          blue: '#3B82F6',        // Workouts
          cyan: '#06B6D4',        // Stats
        }
      },
      fontFamily: {
        sans: ['"Fredoka"', '"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
        game: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'game-sm': '0 3px 0 0 rgba(0, 0, 0, 0.4)',
        'game': '0 5px 0 0 rgba(0, 0, 0, 0.35)',
        'game-lg': '0 8px 0 0 rgba(0, 0, 0, 0.4)',
        'game-gold': '0 4px 0 0 #B45309',
        'game-purple': '0 4px 0 0 #6D28D9',
        'game-green': '0 4px 0 0 #047857',
        'game-orange': '0 4px 0 0 #C2410C',
        'game-blue': '0 4px 0 0 #1D4ED8',
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.35)',
        'glow-purple': '0 0 25px rgba(139, 92, 246, 0.35)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.35)',
      },
      animation: {
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'xp-fly': 'xpFly 1s ease-out forwards',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.85 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        xpFly: {
          '0%': { opacity: 1, transform: 'translateY(0) scale(1)' },
          '50%': { opacity: 1, transform: 'translateY(-30px) scale(1.15)' },
          '100%': { opacity: 0, transform: 'translateY(-60px) scale(0.9)' },
        },
        pop: {
          '0%': { transform: 'scale(0.85)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
