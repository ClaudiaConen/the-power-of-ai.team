import { useEffect, useMemo } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import ContactForm from './ContactForm';

const PRODUCT_MAP: Record<string, string> = {
  'power-upgrade': 'Power Upgrade – Live Punkten (530€)',
  'unersetzbar': 'Unersetzbar: Der Live Tag (990€)',
  'mentoring': 'Das Umsetzungs-Mentoring (1.497€)',
  'voice-to-brain-umsetzung': 'Voice to Brain – Gruppen-Mentoring (1.497€)',
  'voice-to-brain-umsetzung-1zu1': 'Voice to Brain – 1:1-Mentoring (4.997€)',
};

interface ContactPageProps {
  hash: string;
}

export default function ContactPage({ hash }: ContactPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const defaultProduct = useMemo(() => {
    const q = hash.split('?')[1] || '';
    const params = new URLSearchParams(q);
    const key = params.get('produkt') || '';
    return PRODUCT_MAP[key] || '';
  }, [hash]);

  return (
    <div className="contact-page">
      <header className="legal-header">
        <a
          href="#"
          className="legal-back"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = '';
          }}
        >
          <ArrowLeft size={16} />
          <span>Zurück zur Startseite</span>
        </a>
        <div
          className="legal-brand"
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <img
            src="/THE_POWER_OF.png"
            alt="The Power of AI"
            className="nav-logo"
          />
          <span className="nav-n">
            Power <em>Upgrade</em>
          </span>
        </div>
      </header>

      <section className="cp-hero">
        <div className="cp-hero-glow" />
        <div className="cp-hero-line" />
        <div className="cp-hero-content">
          <div className="cp-icon-ring">
            <MessageCircle size={28} strokeWidth={1.5} />
          </div>
          <div className="cp-badge">
            <span className="cp-badge-dot" />
            Persönlich anfragen
          </div>
          <h1 className="cp-h1">
            Schreib uns —<br />
            <em>wir melden uns.</em>
          </h1>
          <p className="cp-lead">
            Fragen zu einem Angebot, ein Problem oder einfach neugierig?
            <br />
            Wir freuen uns auf deine Nachricht.
          </p>
        </div>
      </section>

      <section className="cp-form-section">
        <div className="cp-form-glow" />
        <div className="cp-form-wrap">
          <ContactForm defaultProduct={defaultProduct} />
        </div>
      </section>

      <footer className="foot">
        <div className="foot-left">
          <img
            src="/THE_POWER_OF.png"
            alt="The Power of AI"
            className="foot-logo"
          />
          <span>&copy; 2026 Claudia Conen · Die Umsatzstimme</span>
        </div>
        <span>
          <a href="#impressum">Impressum</a> ·{' '}
          <a href="#datenschutz">Datenschutz</a> · claudiaconen.com
        </span>
        <span className="foot-credit">
          Seite erstellt von <a href="https://ki-webseite-lindemann.com/" target="_blank" rel="noopener noreferrer">Webdesign Gabi Lindemann</a>
        </span>
      </footer>
    </div>
  );
}
