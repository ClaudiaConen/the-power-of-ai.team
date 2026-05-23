import { ChevronRight } from 'lucide-react';

export default function SpaCTA() {
  return (
    <section className="spa-cta">
      <div className="spa-cta-inner">
        <p className="spa-cta-eyebrow">VERPASSE DEN ANSCHLUSS NICHT</p>
        <h2 className="spa-cta-h2">
          Werde Teil der Community.
        </h2>
        <p className="spa-cta-sub">
          Vernetze dich mit Speakern, Unternehmern und Coaches &mdash;
          und nutze die Kraft der Gemeinschaft für deinen Erfolg.
        </p>
        <div className="spa-cta-buttons">
          <a
            href="https://www.skool.com/the-power-of-ai/about?ref=c6865d085a4f482a8b73ac2e3a731de7"
            target="_blank"
            rel="noopener noreferrer"
            className="spa-cta-btn-primary"
          >
            Zur Community <ChevronRight size={14} />
          </a>
          <a href="#speaker-formular" className="spa-cta-btn-ghost">
            Speaker-Anmeldung <ChevronRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
