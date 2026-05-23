import { ChevronDown } from 'lucide-react';
import { useRef, useEffect, useState, useCallback } from 'react';

interface Props {
  title: string;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
  children: React.ReactNode;
}

export default function SFAccordion({ title, index, isOpen, onToggle, children }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const measure = useCallback(() => {
    if (bodyRef.current) {
      setHeight(bodyRef.current.scrollHeight);
    }
  }, []);

  useEffect(() => {
    measure();
  }, [isOpen, children, measure]);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el || !isOpen) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen, measure]);

  return (
    <div className={`sf-accordion${isOpen ? ' sf-accordion--open' : ''}`}>
      <button
        type="button"
        className="sf-accordion-header"
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
      >
        <span className="sf-accordion-num">{index + 1}</span>
        <span className="sf-accordion-title">{title}</span>
        <ChevronDown size={18} className="sf-accordion-chevron" />
      </button>
      <div
        className="sf-accordion-body"
        style={{ maxHeight: isOpen ? height + 32 : 0 }}
      >
        <div ref={bodyRef} className="sf-accordion-content">
          {children}
        </div>
      </div>
    </div>
  );
}
