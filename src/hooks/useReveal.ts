import { useEffect } from 'react';

export function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('on');
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.rv').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
