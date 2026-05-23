import { useState } from 'react';

interface AccordionItemProps {
  dotColor: 'g' | 'pk';
  name: string;
  text: string;
}

export default function AccordionItem({ dotColor, name, text }: AccordionItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`acc-it${open ? ' open' : ''}`}>
      <button className="acc-btn" onClick={() => setOpen(!open)}>
        <div className="acc-l">
          <span className={`adot ${dotColor}`}></span>
          <span className="acc-name">{name}</span>
        </div>
        <div className="acc-ico"></div>
      </button>
      <div className="acc-body">
        <div className="acc-txt">{text}</div>
      </div>
    </div>
  );
}
