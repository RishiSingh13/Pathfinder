import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  error,
  helperText,
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || props.name || undefined;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        className={`w-full px-3 py-2 bg-surface text-ink text-sm rounded-md border transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-border hover:border-border-strong'
        }`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-600 font-medium">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-ink-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}
