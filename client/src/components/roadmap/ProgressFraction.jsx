import React from 'react';

export default function ProgressFraction({
  completedCoreCount = 0,
  totalCoreCount = 0,
  percentage = 0,
  studiedCoreCount = 0,
  knownCoreCount = 0,
  size = 'md',
  showDetails = true,
  className = '',
}) {
  const fractionText = `${completedCoreCount} of ${totalCoreCount} core topics`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-ink">
          {fractionText}
        </span>
        <span className="font-bold text-brand tabular-nums">
          {percentage}%
        </span>
      </div>

      {/* Progress Bar Container */}
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`Progress: ${percentage}% (${fractionText})`}
        className={`w-full bg-surface-subtle border border-border rounded-full overflow-hidden ${
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        }`}
      >
        <div
          className="h-full bg-brand transition-all duration-300 rounded-full"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>

      {showDetails && (
        <div className="flex items-center justify-between text-[11px] text-ink-muted">
          <span>
            {studiedCoreCount > 0 && `${studiedCoreCount} studied`}
            {knownCoreCount > 0 && `${studiedCoreCount > 0 ? ', ' : ''}${knownCoreCount} already knew`}
            {completedCoreCount === 0 && 'Not started yet'}
          </span>
          <span className="text-ink-faint">Core only</span>
        </div>
      )}
    </div>
  );
}
