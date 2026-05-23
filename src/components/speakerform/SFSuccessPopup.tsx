import { useEffect, useRef } from 'react';
import { X, CheckCircle, MessageCircle, Clock, Users, Zap } from 'lucide-react';

interface SFSuccessPopupProps {
  open: boolean;
  onClose: () => void;
  vorname: string;
}

export default function SFSuccessPopup({ open, onClose, vorname }: SFSuccessPopupProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const highlights = [
    { icon: Clock, text: 'Letzte Updates & Zeitplan-\u00C4nderungen: Du verpasst garantiert nichts.' },
    { icon: MessageCircle, text: 'Direkt-Draht zum Orga-Team: Kurze Wege bei Fragen oder W\u00FCnschen.' },
    { icon: Users, text: 'Networking: Erster Kontakt zu den anderen Speakern des Events.' },
    { icon: Zap, text: 'Ready for Action: Alle Infos, die du am Event-Tag wissen musst.' },
  ];

  return (
    <div className="sfp-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="sfp-dialog">
        <button className="sfp-close" onClick={onClose} aria-label="Schlie&szlig;en">
          <X size={20} />
        </button>

        <div className="sfp-top-bar" />

        <div className="sfp-icon-ring">
          <CheckCircle size={36} strokeWidth={1.5} />
        </div>

        <h2 className="sfp-title">
          Willkommen: Deine Anmeldung &amp; n&auml;chste Schritte <span className="sfp-mic">&#127908;</span>
        </h2>

        <div className="sfp-body">
          <p className="sfp-greeting">
            Hallo {vorname || 'Speaker'},
          </p>
          <p>
            vielen Dank f&uuml;r deine Anmeldung als Speaker und den Kauf deines Paketes! Wir freuen uns riesig, dich an Bord zu haben und gemeinsam mit dir ein gro&szlig;artiges Event zu gestalten.
          </p>
          <p className="sfp-confirmed">
            Deine Buchung ist best&auml;tigt und wir bereiten im Hintergrund bereits alles vor.
          </p>

          <div className="sfp-divider" />

          <h3 className="sfp-sub">So geht es jetzt weiter:</h3>
          <p>
            Damit du am Event-Tag den Kopf frei hast und bestens informiert bist, werden wir dich sp&auml;testens <strong>3 Tage vor dem Event</strong> in unsere offizielle <strong>WhatsApp-Gruppe</strong> einladen.
          </p>
          <p className="sfp-highlight-intro">
            Dort hast du den direkten Draht zu uns und findest alles an einem Ort:
          </p>

          <ul className="sfp-highlights">
            {highlights.map((h, i) => (
              <li key={i} className="sfp-hl-item">
                <span className="sfp-hl-icon"><h.icon size={18} strokeWidth={1.8} /></span>
                <span>{h.text}</span>
              </li>
            ))}
          </ul>

          <p className="sfp-outro">
            Wir freuen uns auf deine Expertise und eine geniale Zusammenarbeit!
          </p>

          <p className="sfp-sign">
            Beste Gr&uuml;&szlig;e,<br />
            <strong>Dein Orga-Team</strong>
          </p>
        </div>

        <button className="sfp-cta" onClick={onClose}>
          Alles klar, verstanden!
        </button>
      </div>
    </div>
  );
}
