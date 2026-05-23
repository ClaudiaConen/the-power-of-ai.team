import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import SpaHero from './speaker/SpaHero';
import SpaTickets from './speaker/SpaTickets';
import SpaAudio from './speaker/SpaAudio';
import SpaSkool from './speaker/SpaSkool';
import SpaJourney from './speaker/SpaJourney';
import SpaTeam from './speaker/SpaTeam';
import SpaCTA from './speaker/SpaCTA';

export default function SpeakerAnmeldung() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="spa">
      <header className="spa-nav">
        <a
          href="#"
          className="spa-back"
          onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}
        >
          <ArrowLeft size={16} />
          <span>Zurück zur Startseite</span>
        </a>
        <div className="spa-brand">
          <span className="spa-brand-name">The Power of <em>AI</em></span>
          <span className="spa-brand-sub">Speaker-Anmeldung</span>
        </div>
      </header>

      <SpaHero />

      <SpaTickets />

      <div className="ruleg" />

      <SpaAudio />

      <SpaSkool />

      <div className="ruleg" />

      <SpaJourney />

      <div className="ruleg" />

      <SpaTeam />

      <SpaCTA />

      <footer className="foot">
        <div className="foot-left">
          <img src="/THE_POWER_OF.png" alt="The Power of AI" className="foot-logo" />
          <span>&copy; 2026 Claudia Conen &middot; Die Umsatzstimme</span>
        </div>
        <span>
          <a href="#kontakt">Kontakt</a> &middot;{' '}
          <a href="#impressum">Impressum</a> &middot;{' '}
          <a href="#datenschutz">Datenschutz</a> &middot;{' '}
          <a href="#speaker-anmeldung">Speaker-Anmeldung</a> &middot;{' '}
          <a href="#power-of-ai-anmeldung">Anmeldung Speakerpackage</a>
        </span>
        <span className="foot-credit">
          Seite erstellt von{' '}
          <a href="https://ki-webseite-lindemann.com/" target="_blank" rel="noopener noreferrer">
            Webdesign Gabi Lindemann
          </a>
        </span>
      </footer>
    </div>
  );
}
