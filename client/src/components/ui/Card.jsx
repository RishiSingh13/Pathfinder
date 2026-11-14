import React from 'react';

export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) {
  return (
    <div
      className={`bg-surface rounded-lg border border-border shadow-card transition-all duration-300 ease-premium ${
        hover
          ? 'hover:border-brass/50 hover:shadow-lift hover:-translate-y-0.5'
          : ''
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
