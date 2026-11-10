import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorAlert({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) {
  return (
    <div
      role="alert"
      className={`p-4 rounded-lg bg-red-50 border border-red-200 text-red-900 flex items-start gap-3 ${className}`}
    >
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        {message && <p className="text-sm text-red-700 mt-1">{message}</p>}
      </div>
      {onRetry && (
        <Button
          variant="danger-outline"
          size="sm"
          onClick={onRetry}
          className="shrink-0 text-xs py-1 px-2.5"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Retry
        </Button>
      )}
    </div>
  );
}
