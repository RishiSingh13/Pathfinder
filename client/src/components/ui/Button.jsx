import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-hover shadow-sm active:bg-brand-hover/90',
    secondary: 'bg-surface-subtle text-ink hover:bg-border border border-border',
    outline: 'bg-transparent text-brand border border-brand/30 hover:bg-brand-light hover:border-brand',
    ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-surface-subtle',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    'danger-outline': 'bg-transparent text-red-600 border border-red-200 hover:bg-red-50',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {children}
    </button>
  );
}
