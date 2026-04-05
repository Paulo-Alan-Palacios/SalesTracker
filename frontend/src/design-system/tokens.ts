// Re-export semantic token names as constants for use in dynamic styles
// For static styles, use Tailwind classes directly (e.g. bg-brand-primary)
export const tokens = {
  colors: {
    brandPrimary:   '#2563EB',
    brandSecondary: '#7C3AED',
    successBase:    '#16A34A',
    successSubtle:  '#DCFCE7',
    warningBase:    '#D97706',
    warningSubtle:  '#FEF3C7',
    errorBase:      '#DC2626',
  },
} as const;
