import { useState, useEffect } from 'react';

const WHATSAPP_URL = 'https://wa.me/4916093102073?text=Hallo%2C%20ich%20habe%20eine%20Frage%20zu%20Ihrem%20Angebot.';

export default function WhatsAppBubble() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`wa-bubble ${visible ? 'wa-bubble--in' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="WhatsApp Nachricht senden"
    >
      <span className={`wa-tooltip ${hovered ? 'wa-tooltip--show' : ''}`}>
        WhatsApp schreiben
      </span>
      <span className="wa-icon">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.004 2.667A13.28 13.28 0 0 0 2.72 15.947a13.18 13.18 0 0 0 1.92 6.867L2.667 29.333l6.72-1.92a13.28 13.28 0 0 0 6.613 1.787h.004A13.28 13.28 0 0 0 16.004 2.667Zm0 24.306a11.04 11.04 0 0 1-5.613-1.533l-.4-.24-4.16 1.187 1.2-4.08-.267-.413a10.96 10.96 0 0 1-1.707-5.947A11.05 11.05 0 0 1 16.004 4.92a11.05 11.05 0 0 1 11.053 11.027 11.06 11.06 0 0 1-11.053 11.026Zm6.053-8.266c-.333-.167-1.96-.967-2.267-1.08-.306-.107-.527-.167-.747.167-.22.333-.86 1.08-1.053 1.3-.193.22-.387.247-.72.08-.333-.167-1.407-.52-2.68-1.653-.99-.88-1.66-1.967-1.853-2.3-.193-.333-.02-.513.147-.68.147-.147.333-.387.5-.58.167-.193.22-.333.333-.553.113-.22.053-.413-.027-.58-.08-.167-.747-1.8-1.027-2.467-.267-.64-.54-.553-.747-.56l-.633-.013a1.21 1.21 0 0 0-.88.413c-.307.333-1.16 1.133-1.16 2.767s1.187 3.213 1.353 3.433c.167.22 2.34 3.573 5.667 5.013.793.34 1.413.547 1.893.7.793.253 1.52.22 2.093.133.64-.093 1.96-.8 2.24-1.573.28-.773.28-1.44.193-1.573-.08-.14-.3-.22-.633-.393Z"
            fill="#fff"
          />
        </svg>
      </span>
      <span className="wa-pulse" />
    </a>
  );
}
