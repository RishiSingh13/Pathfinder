import React from 'react';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
}) {
  const variants = {
    neutral: 'bg-surface-subtle text-ink-muted border-border',
    brand: 'bg-brand-light text-brand border-brand-border',
    accent: 'bg-accent-light text-accent border-accent-border',
    success: 'bg-success-light text-success border-success-border',
    danger: 'bg-danger-light text-danger border-danger-border',
    info: 'bg-info-light text-info border-info-border',
    brass: 'bg-brand-light text-brass border-brass/40',
  };

  const sizes = {
    xs: 'text-[11px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors shadow-soft ${variants[variant] || variants.neutral} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
}
