import { useEffect, useState } from 'react';
import { CalendarDays, Users } from 'lucide-react';
import AccordionItem from './AccordionItem';
import { supabase } from '../lib/supabase';

export default function OfferCardBook() {
  const [reserved, setReserved] = useState(26);
  const [total, setTotal] = useState(77);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('book_project_status')
        .select('reserved_count, total_slots')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled && data) {
        setReserved(data.reserved_count);
        setTotal(data.total_slots);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="oc">
      <div className="oc-bar"></div>
      <div className="oc-top">
        <div className="oc-num">01</div>
        <div className="oc-cat">Buchprojekt · Premiere-Edition</div>
        <div className="oc-title">
          The Power of AI
          <br />
          <em>Unverwechselbar</em>
        </div>
      </div>
      <p className="oc-desc">
        Im Zeitalter der KI-Perfektion wird Persönlichkeit unbezahlbar. Werde Teil eines
        Handbuchs des Mittelstands, das zeigt, wie Unternehmer im KI-Zeitalter sichtbar
        und unverwechselbar bleiben.
      </p>
      <div className="oc-dates">
        <div
          className="oc-dates-label"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <CalendarDays size={14} />
          Veröffentlichung · Ende 2026
        </div>
        <div
          className="oc-dates-row"
          style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={13} style={{ color: 'var(--pk)', flexShrink: 0 }} />
            Limitiert auf 77 Teilnehmer
          </span>
          <span
            style={{
              fontSize: '12px',
              color: 'var(--lt)',
              letterSpacing: '.2px',
            }}
          >
            {reserved} / {total} Plätze bereits reserviert
          </span>
        </div>
      </div>
      <div className="oc-img" style={{ aspectRatio: '4/3', background: '#0a1628' }}>
        <img
          src="/Buchprojektprogramm.jpeg"
          alt="The Power of AI — Unverwechselbar. Buchprojekt-Cover."
          loading="lazy"
          style={{ objectFit: 'cover', objectPosition: 'center 35%', transform: 'scale(1.02)' }}
        />
        <div className="img-lbl">Handbuch des Mittelstands · Premiere 2026</div>
      </div>
      <div className="acc-wrap">
        <AccordionItem
          dotColor="g"
          name="4 Seiten redaktioneller Platz im Buch"
          text="Dein Portrait, deine Geschichte und deine Positionierung — professionell aufbereitet auf vier gestalteten Seiten, die bleiben."
        />
        <AccordionItem
          dotColor="pk"
          name="50 Hardcover-Bücher inklusive"
          text="Hochwertige Hardcover-Ausgaben für dein eigenes Marketing — verschenke sie an Kunden, Partner und Wegbegleiter und bleib im Gedächtnis."
        />
        <AccordionItem
          dotColor="g"
          name="Persönlicher QR-Code im Buch"
          text="Dein individueller QR-Code führt Leser direkt auf deine Webseite, dein Angebot oder deinen Kontakt — aus dem Buch in dein Business."
        />
        <AccordionItem
          dotColor="pk"
          name="Limitiert auf 77 Teilnehmer"
          text="Eine exklusive Auswahl von 77 Mittelstand-Persönlichkeiten. Sichere dir deinen Platz, solange noch Plätze der Premiere-Edition verfügbar sind."
        />
        <AccordionItem
          dotColor="g"
          name="Veröffentlichung Ende 2026"
          text="Bis Ende 2026 entsteht das Buch mit Redaktion, Fotografie und professioneller Gestaltung. Du wirst Schritt für Schritt begleitet."
        />
      </div>
      <div className="oc-foot" style={{ flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--ffd)',
                  fontSize: '24px',
                  fontWeight: 900,
                  color: 'var(--n)',
                }}
              >
                555€
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--xlt)' }}>zzgl. MwSt.</div>
          </div>
        </div>
        <a
          href="https://claudiaconen.com/buchprojekt"
          target="_blank"
          rel="noopener noreferrer"
          className="oc-more-btn"
          style={{ width: '100%' }}
        >
          Mehr erfahren
        </a>
      </div>
    </div>
  );
}
