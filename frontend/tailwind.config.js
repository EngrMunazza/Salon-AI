/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: '#FBF3EF',
        espresso: '#2E211C',
        rose: {
          DEFAULT: '#C97B84',
          light: '#E3ABA8',
          dark: '#A85D66',
        },
        gold: {
          DEFAULT: '#B98B4E',
          light: '#D9B98A',
        },
        line: '#E8DCD4',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px -20px rgba(46, 33, 28, 0.25)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        rise: 'rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        glow: 'glow 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
