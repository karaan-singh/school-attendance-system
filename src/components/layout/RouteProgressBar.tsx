'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // When pathname changes, complete the bar
  useEffect(() => {
    if (isVisible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Intercept click on internal links to start progress bar instantly (<16ms)
  useEffect(() => {
    let t1: ReturnType<typeof setTimeout> | null = null;
    let t2: ReturnType<typeof setTimeout> | null = null;

    const clearTimers = () => {
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
      t1 = null;
      t2 = null;
    };

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        !target.getAttribute('download') &&
        target.target !== '_blank'
      ) {
        try {
          const targetUrl = new URL(href, window.location.origin);
          if (targetUrl.pathname !== window.location.pathname) {
            clearTimers();
            setIsVisible(true);
            setProgress(25);
            t1 = setTimeout(() => setProgress(65), 120);
            t2 = setTimeout(() => setProgress(85), 350);
          }
        } catch {
          // ignore invalid URLs
        }
      }
    };

    window.addEventListener('click', handleClick, { capture: true });
    return () => {
      window.removeEventListener('click', handleClick, { capture: true });
      clearTimers();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 right-0 z-[9999] h-1 overflow-hidden bg-transparent"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 shadow-[0_0_12px_rgba(59,130,246,0.8)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}
