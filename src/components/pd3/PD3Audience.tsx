import { CheckCircle2, XCircle } from 'lucide-react';

export default function PD3Audience() {
  return (
    <section className="pd-audience">
      <div className="pd-w">
        <h2 className="sh2" style={{ textAlign: 'center', marginBottom: '20px' }}>
          Für wen das <em>ist.</em>
        </h2>
        <p className="slead" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px' }}>
          Du bist Unternehmerin oder Unternehmer. Du bist selbstständig, Speaker, Coach, Beraterin, Expertin. Du hast etwas zu sagen.
        </p>
        <div className="pd-aud-grid">
          <div className="pd-aud-yes">
            <div className="pd-aud-head pd-aud-head--yes">Das ist für dich, wenn du:</div>
            <ul className="pd-aud-list">
              <li>
                <CheckCircle2 size={16} className="pd-aud-check" />
                <span>Gesehen werden willst — aber nicht um jeden Preis. Nicht auf Kosten dessen, was dich ausmacht</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="pd-aud-check" />
                <span>KI nutzen willst, ohne darin zu verschwinden</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="pd-aud-check" />
                <span>Sichtbar werden willst, ohne dich zu verbiegen</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="pd-aud-check" />
                <span>Wirkung willst — und endlich ins Umsetzen kommen möchtest</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="pd-aud-check" />
                <span>Bereit bist, 90 Tage dranzubleiben — mit echter Begleitung</span>
              </li>
            </ul>
          </div>
          <div className="pd-aud-no">
            <div className="pd-aud-head pd-aud-head--no">Das ist nicht für dich, wenn du:</div>
            <ul className="pd-aud-list">
              <li>
                <XCircle size={16} className="pd-aud-x" />
                <span>Nur noch ein weiteres Online-Programm sammelst, das auf deiner Festplatte verstaubt</span>
              </li>
              <li>
                <XCircle size={16} className="pd-aud-x" />
                <span>Glaubst, dass ein neues KI-Tool dir Sichtbarkeit und Vertrauen schenkt</span>
              </li>
              <li>
                <XCircle size={16} className="pd-aud-x" />
                <span>Nicht bereit bist, dich 90 Tage auf deine persönliche Wirkung einzulassen</span>
              </li>
              <li>
                <XCircle size={16} className="pd-aud-x" />
                <span>Auf den perfekten Moment wartest, statt ihn zu schaffen</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pd3-seats">
          <div className="pd3-seats-num">25</div>
          <div>
            <div className="pd3-seats-title">Nur 25 Plätze.</div>
            <p className="pd3-seats-text">
              Weil ich dich persönlich begleite. Jeden Tag. 90 Tage lang. Mit deinem Namen auf meinem Handy. Und weil das nicht skalierbar ist. Und auch nicht skalierbar sein soll.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
