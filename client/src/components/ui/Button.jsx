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
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-50 disabled:cursor-not-allowed select-none hover:scale-[1.02] hover:shadow-lift active:scale-[0.97]';

  const variants = {
    primary:
      'bg-gradient-to-b from-[#7A5636] to-[#5C3F27] text-[#FBF8F3] border border-[#6B4A2F] shadow-card shadow-inset-glow hover:brightness-105 active:brightness-95',
    secondary:
      'bg-espresso text-canvas hover:bg-espresso/90 border border-espresso shadow-soft',
    outline:
      'bg-transparent text-brand border border-brand/40 hover:bg-brand-light hover:border-brand',
    ghost:
      'bg-transparent text-ink-muted hover:text-ink hover:bg-surface-subtle hover:scale-100',
    danger:
      'bg-danger text-white hover:bg-danger/90 shadow-card',
    'danger-outline':
      'bg-transparent text-danger border border-danger/30 hover:bg-danger-light hover:border-danger',
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
