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
<<<<<<< HEAD
      className={`bg-surface rounded-lg border border-border shadow-card transition-all duration-300 ease-smooth ${
        hover
          ? 'hover:border-brass/50 hover:shadow-lift hover:-translate-y-1'
=======
      className={`bg-surface rounded-lg border border-border shadow-card transition-all duration-300 ease-premium ${
        hover
          ? 'hover:border-brass/50 hover:shadow-lift hover:-translate-y-0.5'
>>>>>>> ee7e2e0795074dda19dad019b6a85befd5f355d8
          : ''
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
