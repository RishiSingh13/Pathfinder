import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Body with pop entrance */}
      <div
        ref={modalRef}
        className={`relative w-full ${maxWidth} bg-surface rounded-xl border border-border shadow-lift p-6 z-10 pop-in origin-center shadow-inset-glow`}
      >
        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-border/70">
          <div>
            <h3 id="modal-title" className="text-lg font-semibold text-ink">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-ink-muted mt-1 leading-relaxed">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-muted hover:text-ink p-1 rounded-md hover:bg-surface-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
