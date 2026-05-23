import { ChevronRight } from 'lucide-react';

export default function PD3Pricing({ checkoutUrl }: { checkoutUrl: string }) {
  return (
    <section className="pd3-pricing">
      <div className="pd-w">
        <div className="pd-tl-header">
          <div className="lbl">Dein Investment</div>
          <h2 className="sh2" style={{ color: 'rgba(255,255,255,.95)' }}>
            Dein <em>Investment.</em>
          </h2>
          <p className="slead" style={{ color: 'rgba(255,255,255,.4)' }}>
            Gesamtwert aller 9 Bausteine: 7.473 €
          </p>
        </div>

        <div className="pd3-pricing-cards">
          <div className="pd3-pricing-card pd3-pricing-card--main">
            <div className="pd3-pricing-card-badge">Empfohlen</div>
            <h3 className="pd3-pricing-card-title">VOICE TO BRAIN · Gruppen-Mentoring</h3>
            <p className="pd3-pricing-card-sub">max. 25 Teilnehmer</p>
            <div className="pd3-pricing-card-old">
              Regulärer Preis: <s>1.997 €</s>
            </div>
            <div className="pd3-pricing-card-label">
              Exklusiver Kooperationspreis mit The Power of AI:
            </div>
            <div className="pd3-pricing-card-price">1.497 €</div>
            <p className="pd3-pricing-card-note">
              Dieses Angebot gilt ausschließlich im Rahmen der Kooperation zwischen Claudia Conen und The Power of AI von Ronny Barthel. Außerhalb dieser Kooperation nicht verfügbar.
            </p>
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pd3-pricing-card-btn"
            >
              Jetzt Platz sichern <ChevronRight size={14} />
            </a>
          </div>

          <div className="pd3-pricing-card pd3-pricing-card--alt">
            <h3 className="pd3-pricing-card-title">VOICE TO BRAIN · 1:1-Mentoring</h3>
            <p className="pd3-pricing-card-sub">Komplett individuell. Maximal intim. Exklusiv.</p>
            <div className="pd3-pricing-card-price pd3-pricing-card-price--alt">4.997 €</div>
            <p className="pd3-pricing-card-note">Ratenzahlung möglich.</p>
            <a
              href="#kontakt?produkt=voice-to-brain-umsetzung-1zu1"
              className="pd3-pricing-card-btn pd3-pricing-card-btn--alt"
            >
              Persönlich anfragen <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
