import { useEffect } from 'react';

export function useScrollNav() {
  useEffect(() => {
    const handler = () => {
      const nav = document.getElementById('nav');
      if (nav) nav.classList.toggle('s', window.scrollY > 50);
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);
}
