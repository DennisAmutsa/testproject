/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy:       '#0a0e1a',   // deepest background - exact mockup color
          dark:       '#0d1220',   // secondary background
          card:       '#111827',   // card backgrounds
          gold:       '#f5c518',   // primary accent - exact mockup gold
          'gold-hover':'#e6b400',  // gold on hover
          'gold-light':'#fff8e0',  // pale gold for backgrounds
          muted:      '#6b7280',   // muted text
          border:     '#1f2937',   // borders
          surface:    '#161d2e',   // elevated surfaces
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease-in-out',
        'slide-up':  'slideUp 0.35s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
