import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import SFHeader from './SFHeader';
import SFSteps from './SFSteps';
import SFExampleProfile from './SFExampleProfile';
import SFForm from './SFForm';

export default function SpeakerFormPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sf-page">
      <div className="sf-blob sf-blob--pink" />
      <div className="sf-blob sf-blob--lila" />
      <div className="sf-blob sf-blob--blue" />

      <nav className="sf-nav">
        <a
          href="#speaker-anmeldung"
          className="sf-nav-back"
          onClick={(e) => { e.preventDefault(); window.location.hash = '#speaker-anmeldung'; }}
        >
          <ArrowLeft size={16} />
          <span>Zurück</span>
        </a>
        <span className="sf-nav-brand">The Power of <em>AI</em></span>
        <div className="sf-nav-links">
          <a href="#speaker-formular" className="sf-nav-pill sf-nav-pill--active">Speaker-Anmeldung</a>
          <a href="#admin" className="sf-nav-pill">Admin</a>
        </div>
      </nav>

      <div className="sf-container">
        <SFHeader />
        <SFSteps />
        <SFExampleProfile />
        <SFForm />
      </div>

      <footer className="foot">
        <a
          href="https://the-power-of-ai.team"
          target="_blank"
          rel="noopener noreferrer"
          className="sf-foot-cta"
        >
          JETZT Wirkung steigern
        </a>
        <div className="foot-left">
          <img src="/THE_POWER_OF.png" alt="The Power of AI" className="foot-logo" />
          <span>© 2026 Claudia Conen · Die Umsatzstimme</span>
        </div>
        <span>
          <a href="#kontakt">Kontakt</a> ·{' '}
          <a href="#impressum">Impressum</a> ·{' '}
          <a href="#datenschutz">Datenschutz</a>
        </span>
      </footer>
    </div>
  );
}
