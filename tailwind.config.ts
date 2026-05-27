import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mirrors Frontend/tailwind.config.js — keep in sync with the mobile app.
        brand: {
          pink: '#FF4DA6',
          purple: '#7B3FF2',
          blue: '#00D1FF',
        },
        bg: {
          DEFAULT: '#0A0A12',
          surface: '#12121A',
          card: '#1C1C28',
          border: '#2A2A38',
        },
        ink: {
          DEFAULT: '#FFFFFF',
          secondary: '#B8B8CC',
          disabled: '#6B6B80',
        },
        status: {
          success: '#00C853',
          warn: '#FFB020',
          error: '#FF5252',
          info: '#00D1FF',
        },
        glass: {
          surface: 'rgba(8, 8, 16, 0.28)',
          'surface-light': 'rgba(255, 255, 255, 0.06)',
          border: 'rgba(255,255,255,0.10)',
          'border-strong': 'rgba(255,255,255,0.18)',
          highlight: 'rgba(255,255,255,0.06)',
        },
      },
      borderRadius: {
        xl2: '14px',
        '2xl': '18px',
        '3xl': '22px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, #FF4DA6 0%, #7B3FF2 50%, #00D1FF 100%)',
        'brand-gradient-soft':
          'linear-gradient(135deg, rgba(255,77,166,0.18), rgba(123,63,242,0.16), rgba(0,209,255,0.18))',
        'card-sheen':
          'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.00) 100%)',
      },
      boxShadow: {
        glow: '0 0 24px rgba(123, 63, 242, 0.35)',
        'glow-soft': '0 0 18px rgba(123, 63, 242, 0.18)',
        'glow-pink': '0 0 24px rgba(255, 77, 166, 0.30)',
        'glow-blue': '0 0 24px rgba(0, 209, 255, 0.30)',
        soft: '0 10px 32px -12px rgba(0, 0, 0, 0.6)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
