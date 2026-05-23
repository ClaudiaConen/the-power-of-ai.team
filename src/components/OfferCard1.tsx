import { CalendarDays, Monitor } from 'lucide-react';
import offer1Image from '../assets/Ronny_Claudia.png';
import AccordionItem from './AccordionItem';

export default function OfferCard1() {
  return (
    <div className="oc">
      <div className="oc-bar"></div>
      <div className="oc-top">
        <div className="oc-num">01</div>
        <div className="oc-cat">Pitch-Training Live-Bühne</div>
        <div className="oc-title">
          Power Upgrade
          <br />
          <em>Live Punkten</em>
        </div>
      </div>
      <p className="oc-desc">
        Präsentiere dich auf einer echten Bühne vor Publikum — mit professioneller
        Begleitung und bleibenden Eindrücken.
      </p>
      <div className="oc-dates">
        <div className="oc-dates-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Monitor size={14} />
          Live-Training im Zoom
        </div>
        <div className="oc-dates-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CalendarDays size={13} style={{ color: 'var(--pk)', flexShrink: 0 }} />
            Donnerstag · 30. April 2026
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <div className="oc1-slot">
            <span className="oc1-slot-time">17:00 – 20:00</span>
            <span className="oc1-slot-label">Abends</span>
          </div>
        </div>
      </div>
      <div className="oc-img" style={{ aspectRatio: '4/3' }}>
        <img src={offer1Image} alt="Claudia & Ronny — Power Upgrade" loading="lazy" style={{ objectPosition: 'center bottom' }} />
        <div className="img-lbl">Ein Pitch, der bleibt. Fotos, die wirken.</div>
      </div>
      <div className="acc-wrap">
        <AccordionItem
          dotColor="g"
          name="Deine Bühne. Vor Publikum + Foto + Video + Pitchen."
          text="Nutze das gesamte Event für deine Sichtbarkeit, um und für Marketing hochwertiges Bild und Videomaterial zu produzieren."
        />
        <AccordionItem
          dotColor="pk"
          name="Vorbereitet im Zoom-Call und mit Online-Modulen"
          text="Du erhältst zusätzliche Module, um selbstbewusst und charismatisch zu werden zum Thema Stimme und charismatisch auftreten. 35 Jahre Business-Erfahrung in Performance, Stimmwirkung, emotionalem Verkauf, Psychologie und Führungskräfte-Coaching erwarten dich, um deine Positionierung im K.I.-Zeitalter unverwechselbar zu gestalten."
        />
        <AccordionItem
          dotColor="g"
          name="Charisma, Storytelling und gewinnbringende Wirkung"
          text="Die Aufmerksamkeit eines Menschen war noch nie so gering wie heute. Punkte blitzschnell mit den Erkenntnissen der Naturwissenschaften, wie du dich im Gehirn der Zuhörer verankerst. Ronny Barthel begleitet den ganzen Tag und macht professionelle Fotos für dein Marketing, deine Webseite, deine Sichtbarkeit. Du erhältst Fotos vor Teilnehmern und in Gesprächen — optimal für dein Marketing."
        />
        <AccordionItem
          dotColor="pk"
          name="Die Neurowissenschaft des Zuhörens"
          text="Verstehe, wie das Gehirn beim Zuhören funktioniert — und nutze dieses Wissen, um deine Botschaft unwiderstehlich zu machen. Täglich bin ich in deinem Ohr durch Audionachricht-Impulse und wir treffen uns live im Zoomcall einmal die Woche."
        />
        <AccordionItem
          dotColor="g"
          name="Elevatorpitch Selbstlernkurs inklusive"
          text="Der komplette Online-Kurs zum Elevatorpitch — damit du auch nach dem Event weiter an deinem Pitch feilen kannst."
        />
        <AccordionItem
          dotColor="g"
          name="Workbook geschenkt"
          text="Dein persönliches Workbook zum Ausfüllen und Mitnehmen — alle Übungen und Erkenntnisse an einem Ort."
        />
      </div>
      <div className="oc-foot" style={{ flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--ffd)', fontSize: '24px', fontWeight: 900, color: 'var(--n)' }}>530€</span>
              <s style={{ fontSize: '14px', color: 'var(--xlt)' }}>779€</s>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--xlt)' }}>zzgl. MwSt.</div>
          </div>
          <a
            className="ob ob-g"
            href="https://umsatzstimme-claudiaconen.tentary.com/p/MKGnIr/checkout"
            target="_blank"
            rel="noopener noreferrer"
          >
            Platz sichern
          </a>
        </div>
        <a
          href="#power-upgrade"
          className="oc-more-btn"
        >
          Mehr erfahren
        </a>
      </div>
    </div>
  );
}
