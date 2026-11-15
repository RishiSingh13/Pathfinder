import React, { useEffect, useRef } from 'react';

export function Reveal({
  children,
  delay = 180,
  className = '',
  as: Component = 'div',
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      el.classList.add('is-revealed');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('is-revealed');
          }, delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Component ref={ref} className={`reveal-item ${className}`} {...props}>
      {children}
    </Component>
  );
}

export function RevealGroup({
  children,
  className = '',
  as: Component = 'div',
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const revealItems = () => {
      const items = el.querySelectorAll('.reveal-item:not(.is-revealed)');
      items.forEach((item, index) => {
        const step = index % 8; // Stagger children by 90ms (max 8 steps)
        item.style.setProperty('--i', step);
        setTimeout(() => {
          item.classList.add('is-revealed');
        }, 180);
      });
    };

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      const items = el.querySelectorAll('.reveal-item');
      items.forEach((item) => item.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          revealItems();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);

    // Watch for dynamically added/filtered items
    const mutationObserver = new MutationObserver(() => {
      revealItems();
    });
    mutationObserver.observe(el, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // Whenever children change (e.g. search/filter updates), reveal new items immediately
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll('.reveal-item:not(.is-revealed)');
    items.forEach((item, index) => {
      const step = index % 8;
      item.style.setProperty('--i', step);
      setTimeout(() => {
        item.classList.add('is-revealed');
      }, 100);
    });
  }, [children]);

  return (
    <Component ref={ref} className={className} {...props}>
      {children}
    </Component>
  );
}
