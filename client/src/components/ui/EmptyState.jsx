import React from 'react';
import { SearchX } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = SearchX,
  title = 'No results found',
  description = 'Try adjusting your search criteria or filter options.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`text-center py-12 px-4 bg-surface border border-dashed border-border rounded-lg ${className}`}>
      <div className="w-12 h-12 rounded-full bg-surface-subtle text-ink-muted mx-auto flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
      <p className="text-sm text-ink-muted max-w-sm mx-auto mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
