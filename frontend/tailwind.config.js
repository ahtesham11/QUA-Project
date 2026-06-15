/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[class*="dark"]'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        slate: {
          750: '#273347',
          850: '#172033',
          950: '#0a0f1e',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #3b82f6 0%, #6d28d9 100%)',
        'gradient-card':  'linear-gradient(145deg, #111827, #162032)',
      },
      boxShadow: {
        glow:   '0 0 40px rgba(59,130,246,0.18)',
        'glow-lg': '0 0 80px rgba(59,130,246,0.25)',
        card:   '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        spin: 'spin 0.7s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
