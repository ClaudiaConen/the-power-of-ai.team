import { CalendarDays } from 'lucide-react';
import claudiaSpeaking from '../assets/_Claudia_.png';
import AccordionItem from './AccordionItem';

export default function OfferCard3() {
  return (
    <div className="oc" style={{ borderBottomColor: 'var(--g3)' }}>
      <div className="oc-bar"></div>
      <div className="oc-top">
        <div className="oc-num">03</div>
        <div className="oc-cat">
          Die Umsetzer · 8 Wochen · <span style={{ color: 'var(--pk)' }}>KI integriert ab Minute 1</span>
        </div>
        <div className="oc-title">
          Das Umsetzungs-
          <br />
          <em>Mentoring</em>
        </div>
        <div className="ki-badge">KI integriert ab Minute 1</div>
      </div>
      <p className="oc-desc">
        In 90 Tagen. Raus aus der KI-Masse. Hinein in deine unverwechselbare Wirkung.
      </p>
      <div className="oc-dates">
        <div className="oc-dates-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CalendarDays size={14} />
          Start
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
          <div className="oc1-slot" style={{ flex: 'none', padding: '8px 16px' }}>
            <span className="oc1-slot-time">5. Oktober 2026</span>
            <span className="oc1-slot-label">10:00 Uhr</span>
          </div>
        </div>
      </div>
      <div className="oc-img" style={{ aspectRatio: '4/3' }}>
        <img src={claudiaSpeaking} alt="Claudia — Voice to Brain Umsetzung" loading="lazy" style={{ objectPosition: 'center bottom' }} />
        <div className="img-lbl">Umsetzen · Begleiten · Wachsen</div>
      </div>
      <div className="acc-wrap">
        <AccordionItem
          dotColor="g"
          name="90 Tage. Täglich in deinem Ohr."
          text=""
        />
        <AccordionItem
          dotColor="g"
          name="Selbstvertrauen schafft Vertrauen. KI-Perfektion ist klickbar."
          text=""
        />
        <AccordionItem
          dotColor="g"
          name="Nutze die unsichtbare Brücke deiner Persönlichkeit."
          text=""
        />
        <AccordionItem
          dotColor="pk"
          name="Ich bin an deiner Seite."
          text=""
        />
        <AccordionItem
          dotColor="pk"
          name="Du gehst raus mit selbstbewusster Wirkung."
          text=""
        />
        <AccordionItem
          dotColor="g"
          name="Nur 25 Teilnehmer · 1:1 optional."
          text=""
        />
      </div>
      <div
        style={{
          padding: '16px 28px',
          background: 'rgba(218,165,32,.04)',
          borderTop: '1px solid var(--bd)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--ffd)',
            fontSize: '17px',
            fontWeight: 900,
            color: 'var(--n)',
            lineHeight: 1.3,
          }}
        >
          Optional: 2 Tage Live Content Produzieren
        </div>
        <div style={{ fontSize: '12px', color: 'var(--lt)', marginTop: '4px', lineHeight: 1.5 }}>
          In kleiner Gruppe · Vor Ort in Witten (auf Nachfrage)
        </div>
      </div>
      <div className="oc-foot" style={{ flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: 'var(--ffd)',
                fontSize: '24px',
                fontWeight: 900,
                color: 'var(--n)',
              }}
            >
              1.497€
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <s style={{ fontSize: '14px', color: 'var(--xlt)' }}>2.994€</s>
              <span style={{ fontSize: '11px', color: 'var(--xlt)' }}>zzgl. MwSt.</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--xlt)' }}>
              oder 3 x 499€ · optional +2 Live-Tage
            </div>
          </div>
          <a className="ob ob-n" href="https://umsatzstimme-claudiaconen.tentary.com/p/QkM0W5/checkout" target="_blank" rel="noopener noreferrer">
            Platz sichern
          </a>
        </div>
        <a
          href="#voice-to-brain"
          className="oc-more-btn"
        >
          Mehr erfahren
        </a>
      </div>
    </div>
  );
}
