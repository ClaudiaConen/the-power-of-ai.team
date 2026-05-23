import { MapPin, CalendarDays } from 'lucide-react';
import offer2Image from '../assets/Ronny_Claudia_klaus.png';
import AccordionItem from './AccordionItem';

export default function OfferCard2() {
  return (
    <div className="oc">
      <div className="oc-bar"></div>
      <div className="oc-top">
        <div className="oc-num">02</div>
        <div className="oc-cat pk">LIVE Workshop in Köln · EXTRA TERMIN</div>
        <div className="oc-title">
          <span className="pk">Unersetzbar:</span> Der Live Tag
        </div>
      </div>
      <p className="oc-desc">
        Ein intensiver Tag mit drei Experten, der deine Positionierung im KI-Zeitalter auf ein neues Level hebt.
      </p>
      <div className="oc-dates">
        <div className="oc-dates-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CalendarDays size={14} />
          Termine — Wähle deinen Tag
        </div>
        <div className="oc2-date-row">
          <div className="oc2-date-item">
            <span className="oc2-date-wday">Do</span>
            <span className="oc2-date-val">19. Juni 2026</span>
            <span className="oc2-date-city"><MapPin size={11} /> Köln</span>
          </div>
          <span className="oc2-date-or">oder</span>
          <div className="oc2-date-item">
            <span className="oc2-date-wday">Mo</span>
            <span className="oc2-date-val">13. Juli 2026</span>
            <span className="oc2-date-city"><MapPin size={11} /> Köln</span>
          </div>
        </div>
      </div>
      <div className="oc-img" style={{ aspectRatio: '4/3' }}>
        <img src={offer2Image} alt="Klaus, Claudia & Ronny — Unersetzbar" loading="lazy" style={{ objectPosition: 'center bottom' }} />
        <div className="img-lbl">Positionierung · Wirkung · Klarheit</div>
      </div>
      <div className="acc-wrap">
        <AccordionItem
          dotColor="pk"
          name="Psychologische Klarheit für deine Positionierung"
          text="Psychologische Tiefe statt oberflächlichem Tool-Hype. Verstehe, was dich wirklich einzigartig macht."
        />
        <AccordionItem
          dotColor="pk"
          name="Menschliche Wirkung in der digitalen Welt"
          text="Wirkung, Stimme, Präsenz und Positionierung mit direktem Praxisbezug."
        />
        <AccordionItem
          dotColor="pk"
          name="Praktische KI-Integration in dein Business"
          text="KI als echtes Werkzeug nutzen — nicht als Spielerei, sondern als Abkürzung in deinem Alltag."
        />
        <AccordionItem
          dotColor="pk"
          name="Professionelle Sichtbarkeits-Strategien"
          text="Authentische Portraits für LinkedIn, Webseite und professionelle Sichtbarkeit."
        />
        <AccordionItem
          dotColor="pk"
          name="Marktreifer Gesamtauftritt"
          text="Am Ende des Tages hast du einen Auftritt, der dich unverwechselbar macht — online und offline."
        />
        <AccordionItem
          dotColor="pk"
          name="Exklusiver Workshop in Köln"
          text="Kleine Gruppe, maximale Aufmerksamkeit. Ein Tag, der alles verändert."
        />
      </div>
      <div className="oc-foot" style={{ flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--ffd)', fontSize: '24px', fontWeight: 900, color: 'var(--n)' }}>990€</span>
              <s style={{ fontSize: '14px', color: 'var(--xlt)' }}>1.500€</s>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--xlt)' }}>zzgl. MwSt.</div>
          </div>
          <a className="ob ob-pk" href="https://umsatzstimme-claudiaconen.tentary.com/p/2JjVGI/checkout" target="_blank" rel="noopener noreferrer">
            Platz sichern
          </a>
        </div>
        <a href="#unersetzbar" className="oc-more-btn">
          Mehr erfahren
        </a>
      </div>
    </div>
  );
}
