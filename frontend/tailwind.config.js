/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'surface':          'var(--color-surface)',
        'brand-primary':    'var(--color-brand-primary)',
        'brand-secondary':  'var(--color-brand-secondary)',
        'success-base':     'var(--color-success-base)',
        'success-subtle':   'var(--color-success-subtle)',
        'warning-base':     'var(--color-warning-base)',
        'warning-subtle':   'var(--color-warning-subtle)',
        'error-base':       'var(--color-error-base)',
        'neutral-100':      'var(--color-neutral-100)',
        'neutral-200':      'var(--color-neutral-200)',
        'neutral-300':      'var(--color-neutral-300)',
        'neutral-400':      'var(--color-neutral-400)',
        'neutral-500':      'var(--color-neutral-500)',
        'neutral-700':      'var(--color-neutral-700)',
        'neutral-900':      'var(--color-neutral-900)',
      },
      fontSize: {
        'heading-lg': ['2rem',    { lineHeight: '2.5rem',  fontWeight: '700' }],
        'heading-md': ['1.5rem',  { lineHeight: '2rem',    fontWeight: '600' }],
        'heading-sm': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'body-md':    ['1rem',    { lineHeight: '1.5rem',  fontWeight: '400' }],
        'body-sm':    ['0.875rem',{ lineHeight: '1.25rem', fontWeight: '400' }],
        'caption':    ['0.75rem', { lineHeight: '1rem',    fontWeight: '400' }],
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'full': '9999px',
      },
      keyframes: {
        'slide-up': {
          '0%':   { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in':  'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
