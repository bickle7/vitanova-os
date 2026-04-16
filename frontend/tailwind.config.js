/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0d0d14',
        'bg-surface': '#16161f',
        'bg-elevated': '#1e1e2a',
        'border-subtle': '#2a2a38',
        'accent': '#8b5cf6',
        'accent-warm': '#f59e0b',
        'accent-light': '#a78bfa',
        'text-primary': '#f0f0f8',
        'text-secondary': '#9090a8',
        'text-muted': '#5a5a72',
        'success': '#22c55e',
        'danger': '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-warm': '0 0 20px rgba(245, 158, 11, 0.2)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.4)',
        'sheet': '0 -8px 32px rgba(0, 0, 0, 0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
