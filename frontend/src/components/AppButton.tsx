import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-brand-primary text-white hover:opacity-90',
  secondary: 'bg-brand-secondary text-white hover:opacity-90',
  ghost:     'bg-transparent text-brand-primary border border-brand-primary hover:bg-neutral-200',
  danger:    'bg-error-base text-white hover:opacity-90',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-body-sm rounded-sm',
  md: 'px-4 py-2 text-body-md rounded-md',
  lg: 'px-6 py-3 text-heading-sm rounded-md',
};

export function AppButton({ variant = 'primary', size = 'md', loading = false, children, disabled, className = '', ...props }: AppButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
