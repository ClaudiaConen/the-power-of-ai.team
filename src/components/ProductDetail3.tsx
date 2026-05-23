import { useEffect } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import PD3Hero from './pd3/PD3Hero';
import PD3Intro from './pd3/PD3Intro';
import PD3Science from './pd3/PD3Science';
import PD3Phases from './pd3/PD3Phases';
import PD3Blocks from './pd3/PD3Blocks';
import PD3Schedule from './pd3/PD3Schedule';
import PD3Audience from './pd3/PD3Audience';
import PD3Pricing from './pd3/PD3Pricing';
import PD3Final from './pd3/PD3Final';
import PD3FAQ from './pd3/PD3FAQ';

const CHECKOUT_URL = 'https://umsatzstimme-claudiaconen.tentary.com/p/QkM0W5/checkout';

export default function ProductDetail3() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pd">
      <header className="pd-nav">
        <a href="#" className="pd-back" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}>
          <ArrowLeft size={16} />
          <span>Zurück zur Startseite</span>
        </a>
        <div className="nav-l" style={{ pointerEvents: 'none' }}>
          <img src="/THE_POWER_OF.png" alt="The Power of AI" className="nav-logo" />
          <div>
            <div className="nav-n">Voice to <em>Brain</em></div>
            <div className="nav-s">Umsetzung · 90 Tage</div>
          </div>
        </div>
      </header>

      <PD3Hero checkoutUrl={CHECKOUT_URL} />

      <PD3Intro />

      <div className="ruleg"></div>

      <PD3Science />

      <div className="ruleg"></div>

      <PD3Phases />

      <div className="ruleg"></div>

      <PD3Blocks />

      <div className="ruleg"></div>

      <PD3Schedule />

      <div className="ruleg"></div>

      <PD3Audience />

      <PD3Pricing checkoutUrl={CHECKOUT_URL} />

      <PD3Final checkoutUrl={CHECKOUT_URL} />

      <PD3FAQ />

      <section className="pd-bottom-cta">
        <div className="pd-w" style={{ textAlign: 'center' }}>
          <div className="qline"></div>
          <h2 className="sh2 sh2-lt" style={{ marginBottom: '14px' }}>
            Bist du <em>dabei?</em>
          </h2>
          <p className="pd-bottom-cta-lead">
            KI-Perfektion gibt's auf Mausklick. Persönlichkeit nicht.
          </p>
          <p className="pd-bottom-cta-sub">
            Selbsterkenntnis bereitet den Weg zu deinem Selbstbewusstsein.
          </p>
          <div className="pd-bottom-cta-actions">
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-p pd-bottom-cta-btn"
            >
              Ja, ich sichere mir meinen Platz am 13. Juni <ChevronRight size={14} />
            </a>
            <a
              href="#kontakt?produkt=voice-to-brain-umsetzung"
              className="btn-g pd-bottom-cta-link"
            >
              Persönlich anfragen <span className="ar">→</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="foot">
        <span>© 2026 Claudia Conen · Die Umsatzstimme</span>
        <div className="foot-links">
          <a href="#impressum">Impressum</a>
          <a href="#datenschutz">Datenschutz</a>
        </div>
        <span className="foot-credit">
          Seite erstellt von <a href="https://ki-webseite-lindemann.com/" target="_blank" rel="noopener noreferrer">Webdesign Gabi Lindemann</a>
        </span>
      </footer>
    </div>
  );
}
