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
      className={`bg-surface rounded-lg border border-border transition-all duration-200 ${
        hover ? 'hover:border-brand/40 hover:shadow-md' : 'shadow-sm'
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
