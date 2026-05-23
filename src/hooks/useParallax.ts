import { useEffect } from 'react';

export function useParallax() {
  useEffect(() => {
    const heroBg = document.querySelector<HTMLElement>('.hero-bg-img');
    if (!heroBg) return;

    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 5;
      heroBg.style.transform = `scale(1.05) translateX(${x}px) translateY(${y}px)`;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
}
