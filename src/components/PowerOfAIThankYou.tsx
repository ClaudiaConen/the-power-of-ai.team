import { useEffect, useRef, useCallback } from 'react';
import { Calendar, ExternalLink } from 'lucide-react';

const EVENT_TITLE = 'The Power of AI – Edition Köln';
const EVENT_LOCATION = 'Motorworld Köln, Peter-Müller-Straße 12, 51063 Köln';
const EVENT_DESCRIPTION =
  'Die Unverwechselbaren – The Power of AI. Dein Event in der Motorworld Köln.\\nhttps://the-power-of-ai.team';
const EVENT_START = '20260503T110000';
const EVENT_END = '20260503T180000';

function buildGoogleCalendarUrl() {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: EVENT_TITLE,
    dates: `${EVENT_START}/${EVENT_END}`,
    location: EVENT_LOCATION,
    details: EVENT_DESCRIPTION.replace(/\\n/g, '\n'),
    ctz: 'Europe/Berlin',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildOutlookUrl() {
  const fmt = (d: string) =>
    `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T${d.slice(9, 11)}:${d.slice(11, 13)}:00`;
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: EVENT_TITLE,
    startdt: fmt(EVENT_START),
    enddt: fmt(EVENT_END),
    location: EVENT_LOCATION,
    body: EVENT_DESCRIPTION.replace(/\\n/g, '\n'),
  });
  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
}

function buildIcsBlob() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ThePowerOfAI//DE',
    'BEGIN:VEVENT',
    `DTSTART;TZID=Europe/Berlin:${EVENT_START}`,
    `DTEND;TZID=Europe/Berlin:${EVENT_END}`,
    `SUMMARY:${EVENT_TITLE}`,
    `LOCATION:${EVENT_LOCATION}`,
    `DESCRIPTION:${EVENT_DESCRIPTION.replace(/\\n/g, '\\n')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return new Blob([ics], { type: 'text/calendar;charset=utf-8' });
}

export default function PowerOfAIThankYou() {
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!stepsRef.current) return;
    const steps = stepsRef.current.querySelectorAll('.poa-ty-step');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('in'), i * 120);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    steps.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const downloadIcs = useCallback(() => {
    const blob = buildIcsBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'power-of-ai-koeln-2026.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="poa-ty">
      <header className="poa-ty-top">
        <div className="poa-ty-top-inner">
          <div className="poa-ty-logo">The Power of <span>AI</span></div>
          <div className="poa-ty-meta">Edition Köln &middot; 03.05.2026</div>
        </div>
      </header>

      <section className="poa-ty-hero">
        <div className="poa-ty-check" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <polyline points="5 12 10 17 19 8" />
          </svg>
        </div>
        <span className="poa-ty-eyebrow">Verbindlich angemeldet</span>
        <h1 className="poa-ty-h1">Es ist <em>beschlossen</em>.</h1>
        <p className="poa-ty-lead">
          Deine Entscheidung ist bei uns angekommen.<br />
          Du bist <strong>verbindlich dabei</strong> &mdash; am 03.05.2026 in der Motorworld Köln.
        </p>
      </section>

      <div className="poa-ty-divider">
        <div className="poa-ty-line" />
        <div className="poa-ty-medallion">
          <img src="/THE_POWER_OF.png" alt="The Power of AI" />
        </div>
        <div className="poa-ty-line" />
      </div>

      <section className="poa-ty-cal">
        <div className="poa-ty-cal-inner">
          <Calendar size={28} strokeWidth={1.5} className="poa-ty-cal-icon" />
          <h3 className="poa-ty-cal-title">Termin sichern</h3>
          <p className="poa-ty-cal-sub">03. Mai 2026 &middot; 11:00 &ndash; 18:00 Uhr &middot; Motorworld Köln</p>
          <div className="poa-ty-cal-btns">
            <a
              href={buildGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="poa-ty-cal-btn poa-ty-cal-google"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Google Kalender
              <ExternalLink size={13} />
            </a>
            <a
              href={buildOutlookUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="poa-ty-cal-btn poa-ty-cal-outlook"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Outlook
              <ExternalLink size={13} />
            </a>
            <button
              type="button"
              onClick={downloadIcs}
              className="poa-ty-cal-btn poa-ty-cal-ics"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              .ics Datei
            </button>
          </div>
        </div>
      </section>

      <section className="poa-ty-wa-block">
        <div className="poa-ty-wa-inner">
          <div className="poa-ty-wa-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <div className="poa-ty-wa-text">
            <h3>Du hast Fragen?</h3>
            <p>Schreib direkt auf WhatsApp an Claudia Conen.</p>
          </div>
          <a href="https://wa.me/4916099142208" className="poa-ty-wa-btn" target="_blank" rel="noopener noreferrer">
            0160 99142208
          </a>
        </div>
      </section>

      <section className="poa-ty-closing">
        <div className="poa-ty-closing-inner">
          <h2>Jetzt beginnt der Weg auf <em>deine</em> Bühne.</h2>
          <p>
            Wir freuen uns darauf, mit dir gemeinsam zu zeigen, was im KI-Zeitalter wirklich zählt:
          </p>
          <p className="poa-ty-closing-bold">Bis bald in Köln.</p>
          <p className="poa-ty-closing-hosted">
            Dieses Event wird veranstaltet von <strong>Ronny Barthel</strong>.<br />
            In Köln begrüßen dich <strong>Claudia Conen</strong> &amp; <strong>Klaus Offermann</strong> als deine Hosts vor Ort.
          </p>
        </div>
      </section>

      <footer className="poa-ty-footer">
        <div className="poa-ty-spam">Keine E-Mail erhalten? Bitte schau kurz im Spam-Ordner nach.</div>
        <div>&copy; 2026 The Power of AI &middot; Edition Köln &middot; Die Unverwechselbaren</div>
        <div className="foot-credit" style={{ marginTop: '8px' }}>
          Seite erstellt von <a href="https://ki-webseite-lindemann.com/" target="_blank" rel="noopener noreferrer">Webdesign Gabi Lindemann</a>
        </div>
      </footer>
    </div>
  );
}
