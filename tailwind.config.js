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
        aura: {
          bg: '#07080B',
          surface: '#111319',
          'surface-hover': '#1A1D27',
          glass: 'rgba(255, 255, 255, 0.05)',
          'glass-border': 'rgba(255, 255, 255, 0.10)',
          'glass-hover': 'rgba(255, 255, 255, 0.09)',
          accent: '#FAFAFA',
          muted: '#8A8F9E',
          dim: '#525666',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Geist Sans',
          'Inter',
          'system-ui',
          'sans-serif'
        ],
        mono: ['Geist Mono', 'SF Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '4px',
        glass: '24px',
        heavy: '40px',
      },
      boxShadow: {
        'glass-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'artwork-glow': '0 20px 50px 0 rgba(0, 0, 0, 0.65)',
        'pill-hover': '0 4px 20px 0 rgba(255, 255, 255, 0.15)',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        marquee: 'marquee 18s linear infinite',
      }
    },
  },
  plugins: [],
}
