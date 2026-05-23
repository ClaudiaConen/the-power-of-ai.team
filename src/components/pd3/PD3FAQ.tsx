import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Was genau ist Voice to Brain?',
    a: 'Voice to Brain ist ein 90-Tage-Mentoring-Programm von Claudia Conen. Du bekommst jeden Tag eine persoenliche Audio-Nachricht per WhatsApp, woechentliche Live-Calls im Zoom, persoenliches Feedback und KI-Prompts — alles darauf ausgerichtet, deine unverwechselbare Wirkung zu staerken.',
  },
  {
    q: 'Fuer wen ist das Programm gedacht?',
    a: 'Fuer Unternehmerinnen, Unternehmer, Selbststaendige, Speaker, Coaches, Beraterinnen und Expertinnen — alle, die gesehen werden wollen, ohne sich zu verbiegen. Die ihre Persoenlichkeit im KI-Zeitalter als Staerke nutzen moechten.',
  },
  {
    q: 'Was kostet Voice to Brain?',
    a: 'Das Gruppen-Mentoring (max. 25 Teilnehmer) kostet 1.497 Euro im exklusiven Kooperationspreis mit The Power of AI. Das 1:1-Mentoring kostet 4.997 Euro. Ratenzahlung ist moeglich.',
  },
  {
    q: 'Wann startet das Programm?',
    a: 'Der Kickoff ist am Montag, 5. Oktober 2026, von 10:00 bis 12:00 Uhr per Zoom. Danach erhaeltst du 90 Tage lang jeden Tag deine persoenliche Audio-Nachricht.',
  },
  {
    q: 'Wie viele Plaetze gibt es?',
    a: 'Nur 25 Plaetze. Claudia begleitet jeden Teilnehmer persoenlich — jeden Tag, 90 Tage lang. Das ist bewusst nicht skalierbar.',
  },
  {
    q: 'Was unterscheidet Voice to Brain von Online-Kursen?',
    a: 'Bei einem Online-Kurs lernst du allein und setzt selten um. Bei Voice to Brain begleitet dich Claudia Conen persoenlich — mit taeglichen Audio-Impulsen, persoenlichem Feedback auf deine Sprachnachrichten und woechentlichen Live-Calls. Es ist ein Mentoring, kein Kurs.',
  },
  {
    q: 'Welche Rolle spielt KI im Programm?',
    a: 'Du bekommst persoenliche KI-Prompts und lernst, eigene GPTs zu bauen — mit dem Fundament deiner Persoenlichkeit darin hinterlegt. So klingt dein Content nicht nach „irgendjemand mit ChatGPT", sondern nach dir.',
  },
  {
    q: 'Kann ich auch spaeter einsteigen?',
    a: 'Nein. Alle 25 Teilnehmer starten gemeinsam am 5. Oktober 2026. Das gemeinsame Starten und Dranbleiben ist ein zentraler Bestandteil des Programms.',
  },
];

export default function PD3FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const existing = document.getElementById('ld-json-faq');
    if (existing) return;

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    };

    const script = document.createElement('script');
    script.id = 'ld-json-faq';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('ld-json-faq');
      if (el) el.remove();
    };
  }, []);

  return (
    <section className="pd3-faq">
      <div className="pd-w">
        <div className="pd-tl-header">
          <div className="lbl">Haeufige Fragen</div>
          <h2 className="sh2">
            Noch Fragen? Hier sind <em>Antworten.</em>
          </h2>
        </div>
        <div className="pd3-faq-list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`pd3-faq-item ${open === i ? 'pd3-faq-item--open' : ''}`}
            >
              <button
                className="pd3-faq-q"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{faq.q}</span>
                <ChevronDown size={18} className="pd3-faq-chevron" />
              </button>
              <div className="pd3-faq-a">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
