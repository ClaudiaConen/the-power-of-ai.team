import { useEffect } from 'react';

export function useCounterAnimation() {
  useEffect(() => {
    const counters = document.querySelectorAll<HTMLElement>('.sn');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const el = e.target as HTMLElement;
          if (e.isIntersecting && !el.dataset.done) {
            el.dataset.done = '1';
            const match = el.textContent?.match(/\d+/);
            if (match) {
              const target = parseInt(match[0]);
              const sup = el.querySelector('sup');
              const supClone = sup ? sup.cloneNode(true) : null;
              let current = 0;
              const step = Math.ceil(target / 40);
              const iv = setInterval(() => {
                current += step;
                if (current >= target) {
                  current = target;
                  clearInterval(iv);
                }
                el.textContent = String(current);
                if (supClone) el.appendChild(supClone.cloneNode(true));
              }, 25);
            }
          }
        });
      },
      { threshold: 0.3 }
    );
    counters.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);
}
