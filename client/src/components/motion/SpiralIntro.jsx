import React, { useEffect, useState, useMemo } from 'react';
import { Compass } from 'lucide-react';

export default function SpiralIntro({ variant = 'site', onDone }) {
  const storageKey = variant === 'site' ? 'intro_seen' : 'login_intro_seen';
  const isSite = variant === 'site';

  // Check if intro has already run or reduced motion is preferred
  const [shouldRun, setShouldRun] = useState(() => {
    if (typeof window === 'undefined') return false;
    const seen = sessionStorage.getItem(storageKey);
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    return !seen && !prefersReduced;
  });

  const [phase, setPhase] = useState('drawing'); // 'drawing' -> 'title' -> 'exiting' -> 'done'
  const [showSkip, setShowSkip] = useState(false);

  // Generate smooth logarithmic spiral path
  const spiralPath = useMemo(() => {
    const cx = 200, cy = 200;
    const turns = 3.5;
    const totalPoints = 140;
    const a = 2.5;
    const b = 0.18;
    let d = '';
    for (let i = 0; i <= totalPoints; i++) {
      const theta = (i / totalPoints) * turns * 2 * Math.PI;
      const r = a * Math.exp(b * theta);
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      if (i === 0) d += `M ${x.toFixed(2)} ${y.toFixed(2)}`;
      else d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }
    return d;
  }, []);

  const finish = () => {
    try {
      sessionStorage.setItem(storageKey, 'true');
    } catch {
      // Ignore storage errors in private browsing
    }
    document.body.style.overflow = '';
    setShouldRun(false);
    onDone?.();
  };

  useEffect(() => {
    if (!shouldRun) {
      onDone?.();
      return;
    }

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Show skip button
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, isSite ? 600 : 400);

    let titleTimer;
    let exitTimer;
    let doneTimer;

    if (isSite) {
      // 1.8s: Title fades in
      titleTimer = setTimeout(() => {
        setPhase('title');
      }, 1800);

      // 2.6s: Exit starts (scales 12x, clip-path circle reveals page beneath)
      exitTimer = setTimeout(() => {
        setPhase('exiting');
      }, 2600);

      // 3.5s: Complete (2600 + 900ms)
      doneTimer = setTimeout(() => {
        finish();
      }, 3500);
    } else {
      // Login variant: compact ~1.2s draw -> exit
      exitTimer = setTimeout(() => {
        setPhase('exiting');
      }, 1200);

      doneTimer = setTimeout(() => {
        finish();
      }, 1800);
    }

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(titleTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = '';
    };
  }, [shouldRun, isSite]);

  if (!shouldRun) return null;

  const isExiting = phase === 'exiting';
  const showTitle = phase === 'title' || phase === 'exiting';

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-espresso flex items-center justify-center overflow-hidden transition-all duration-[900ms] pointer-events-auto ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        clipPath: isExiting ? 'circle(150% at 50% 50%)' : 'circle(100% at 50% 50%)',
        transitionTimingFunction: 'var(--ease-premium)',
      }}
      aria-label="Welcome animation"
    >
      {/* Container for spirals and branding */}
      <div
        className={`relative flex flex-col items-center justify-center transition-all duration-[900ms] ${
          isExiting ? 'scale-[12] opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-premium)' }}
      >
        <svg
          viewBox="0 0 400 400"
          className="w-72 h-72 sm:w-96 sm:h-96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Secondary counter-rotating faint spiral */}
          <path
            d={spiralPath}
            stroke="#F3EDE4"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.3"
            style={{
              transformOrigin: '200px 200px',
              animation: isSite
                ? 'counterSpiralSite 1.8s var(--ease-premium) forwards'
                : 'counterSpiralLogin 1.2s var(--ease-premium) forwards',
            }}
          />

          {/* Primary Golden Spiral in Brass #B08D57 */}
          <path
            d={spiralPath}
            stroke="#B08D57"
            strokeWidth="1.5"
            strokeLinecap="round"
            pathLength="1000"
            strokeDasharray="1000"
            style={{
              transformOrigin: '200px 200px',
              animation: isSite
                ? 'primarySpiralSite 1.6s var(--ease-premium) forwards'
                : 'primarySpiralLogin 1.2s var(--ease-premium) forwards',
            }}
          />
        </svg>

        {/* Center Logo & Title mark */}
        {isSite && (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-out pointer-events-none ${
              showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <Compass className="w-8 h-8 text-brass mb-2" strokeWidth={1.5} />
            <h1 className="text-xl sm:text-2xl font-semibold tracking-widest text-canvas uppercase">
              PathFinder
            </h1>
            <p className="text-[11px] tracking-widest uppercase text-brass/80 mt-1 font-medium">
              Curated Roadmaps
            </p>
          </div>
        )}
      </div>

      {/* Skip button (subtle bottom-right) */}
      {showSkip && (
        <button
          type="button"
          onClick={finish}
          className="absolute bottom-6 right-8 text-xs text-canvas/60 hover:text-brass transition-colors tracking-wider uppercase font-medium focus:outline-none focus:ring-1 focus:ring-brass rounded px-2 py-1"
        >
          Skip
        </button>
      )}

      {/* Embedded scoped animation keyframes for the SVG paths */}
      <style>{`
        @keyframes primarySpiralSite {
          0% {
            stroke-dashoffset: 1000;
            transform: scale(0.6) rotate(0deg);
            opacity: 0.2;
          }
          100% {
            stroke-dashoffset: 0;
            transform: scale(1) rotate(540deg);
            opacity: 1;
          }
        }

        @keyframes counterSpiralSite {
          0% {
            stroke-dashoffset: 1000;
            transform: scale(0.6) rotate(0deg);
          }
          100% {
            stroke-dashoffset: 0;
            transform: scale(1) rotate(-360deg);
          }
        }

        @keyframes primarySpiralLogin {
          0% {
            stroke-dashoffset: 1000;
            transform: scale(0.7) rotate(0deg);
          }
          100% {
            stroke-dashoffset: 0;
            transform: scale(1) rotate(360deg);
          }
        }

        @keyframes counterSpiralLogin {
          0% {
            stroke-dashoffset: 1000;
            transform: scale(0.7) rotate(0deg);
          }
          100% {
            stroke-dashoffset: 0;
            transform: scale(1) rotate(-240deg);
          }
        }
      `}</style>
    </div>
  );
}

