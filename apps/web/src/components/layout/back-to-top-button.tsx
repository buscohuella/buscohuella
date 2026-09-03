'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BackToTopButton({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 520);

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  const scrollToTop = () => {
    const reducedMotion =
      document.documentElement.dataset.reducedMotion === 'true' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={label}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-5 right-5 z-50 inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface-elevated text-primary shadow-[var(--shadow-md)] transition-[opacity,transform,box-shadow,background-color,color] duration-500 ease-out hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground hover:shadow-[var(--shadow-lg)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft motion-reduce:transition-none sm:bottom-8 sm:right-8 sm:size-12 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </button>
  );
}
