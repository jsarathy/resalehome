import { useEffect } from 'react';

export function useAnimateOnScroll(containerRef) {
  useEffect(() => {
    const els = containerRef
      ? containerRef.current?.querySelectorAll('.anim-label, .anim-heading, .anim-card')
      : document.querySelectorAll('.anim-label, .anim-heading, .anim-card');

    if (!els || !els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          // Add stagger delay based on position among siblings
          const siblings = Array.from(el.parentElement?.querySelectorAll('.anim-card') ?? []);
          const idx = siblings.indexOf(el);
          if (el.classList.contains('anim-card') && idx > 0) {
            el.style.transitionDelay = `${0.08 * idx}s`;
          }
          if (el.classList.contains('anim-heading')) {
            el.style.transitionDelay = '0.1s';
          }
          el.classList.add('visible');
          observer.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [containerRef]);
}
