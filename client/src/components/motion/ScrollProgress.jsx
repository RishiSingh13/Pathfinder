import React, { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScale(Math.min(1, Math.max(0, totalScroll / windowHeight)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2px] bg-brass z-50 origin-left pointer-events-none transition-transform duration-75 ease-out shadow-[0_0_8px_rgba(176,141,87,0.4)]"
      style={{ transform: `scaleX(${scale})` }}
      aria-hidden="true"
    />
  );
}

