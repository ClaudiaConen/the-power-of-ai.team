import { useEffect } from 'react';

export function useTilt(selector: string, intensity: { x: number; y: number }, baseTransform = '') {
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(selector);
    const handlers: Array<{ el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> = [];

    cards.forEach((card) => {
      const move = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `${baseTransform} rotateY(${x * intensity.x}deg) rotateX(${-y * intensity.y}deg)`;
      };
      const leave = () => {
        card.style.transform = '';
      };
      card.addEventListener('mousemove', move);
      card.addEventListener('mouseleave', leave);
      handlers.push({ el: card, move, leave });
    });

    return () => {
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, [selector, intensity.x, intensity.y, baseTransform]);
}
