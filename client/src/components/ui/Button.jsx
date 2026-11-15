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
    'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-50 disabled:cursor-not-allowed select-none hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.98]';

  const variants = {
    primary:
      'bg-gradient-to-b from-[#A66F3E] to-[#7D4E24] text-[#FFF9F3] border border-[#BD824D]/60 shadow-card shadow-inset-glow hover:brightness-110 active:brightness-95 hover:shadow-glow-brand',
    secondary:
      'bg-surface-subtle text-ink hover:bg-[#342B22] border border-border shadow-soft',
    outline:
      'bg-transparent text-brand border border-brand/50 hover:bg-brand-light hover:border-brand',
    ghost:
      'bg-transparent text-ink-muted hover:text-ink hover:bg-surface-subtle hover:scale-100',
    danger:
      'bg-danger text-[#141210] font-semibold hover:brightness-105 shadow-card',
    'danger-outline':
      'bg-transparent text-danger border border-danger/40 hover:bg-danger-light hover:border-danger',
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
