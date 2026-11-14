import { useEffect, useRef } from 'react';

/**
 * useReveal - IntersectionObserver hook for weighted, unhurried editorial scroll reveal
 * @param {Object} options
 * @param {number} [options.delay=180] - Deliberate delay (150-250ms) after element intersects
 * @param {number} [options.threshold=0.15] - Intersection threshold
 * @param {string} [options.rootMargin="0px 0px -8% 0px"] - Viewport margin
 */
export function useReveal(options = {}) {
  const ref = useRef(null);
  const delay = options.delay ?? 180;
  const threshold = options.threshold ?? 0.15;
  const rootMargin = options.rootMargin ?? '0px 0px -8% 0px';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      el.classList.add('is-revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('is-revealed');
            }, delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [delay, threshold, rootMargin]);

  return ref;
}

