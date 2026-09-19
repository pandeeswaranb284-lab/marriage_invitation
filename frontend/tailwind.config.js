/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040812',
          900: '#070c18',
          850: '#0b1329',
          800: '#111d3d',
          700: '#1a2952',
        },
        burgundy: {
          950: '#19030c',
          900: '#260613',
          850: '#34081b',
          800: '#480c25',
          700: '#631235',
        },
        gold: {
          100: '#fbf5e7',
          200: '#f4e5c3',
          300: '#edd09b',
          400: '#dfba73',
          500: '#c5a059',
          600: '#a88138',
          700: '#8c6d33',
          800: '#694e22',
        },
        champagne: {
          DEFAULT: '#f7e7ce',
          light: '#fdf7ee',
          dark: '#eed4a6',
        },
        ivory: {
          50: '#fdfbf7',
          100: '#f7f2e7',
          200: '#eee5d3',
          300: '#dfd2b9',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        cinzelDeco: ['"Cinzel Decorative"', 'serif'],
        tamil: ['"Noto Serif Tamil"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'royal': '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(197, 160, 89, 0.25)',
        'gold-glow': '0 0 25px rgba(197, 160, 89, 0.35)',
        'gold-glow-lg': '0 0 50px rgba(197, 160, 89, 0.5)',
        'card-inner': 'inset 0 2px 15px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'light-sweep': 'lightSweep 4s ease-in-out infinite',
        'float-gentle': 'floatGentle 6s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        lightSweep: {
          '0%': { transform: 'translateX(-100%) rotate(45deg)' },
          '100%': { transform: 'translateX(200%) rotate(45deg)' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
