import React from 'react';

export default function PageContainer({
  children,
  className = '',
  maxWidth = 'max-w-6xl',
}) {
  return (
    <main className={`mx-auto w-full ${maxWidth} px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {children}
    </main>
  );
}
