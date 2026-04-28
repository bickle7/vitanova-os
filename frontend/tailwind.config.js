/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary':  '#08080e',
        'bg-surface':  '#0e0e18',
        'bg-elevated': '#151520',
        'border-subtle': '#242435',
        'accent':       '#d4a843',
        'accent-warm':  '#e8c56a',
        'accent-light': '#f0d99a',
        'text-primary':   '#f2f0ea',
        'text-secondary': '#8a8a9a',
        'text-muted':     '#52526a',
        'success': '#22c55e',
        'danger':  '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'slide-up':  'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-in':   'fadeIn 0.2s ease-out',
        'scale-in':  'scaleIn 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
        'shimmer':   'shimmer 2s infinite',
      },
      keyframes: {
        slideUp: {
          '0%':   { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-accent': '0 0 24px rgba(212, 168, 67, 0.25)',
        'glow-warm':   '0 0 16px rgba(232, 197, 106, 0.15)',
        'card':        '0 2px 12px rgba(0, 0, 0, 0.5)',
        'sheet':       '0 -8px 40px rgba(0, 0, 0, 0.7)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
