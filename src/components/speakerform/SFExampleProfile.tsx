import { ExternalLink } from 'lucide-react';

export default function SFExampleProfile() {
  return (
    <div className="sf-card sf-example">
      <span className="sf-example-badge">BEISPIEL-PROFIL — SO SIEHT DEIN EINTRAG AUS</span>

      <div className="sf-example-top">
        <div className="sf-example-info">
          <h3 className="sf-example-name">Claudia Conen</h3>
          <p className="sf-example-role">Keynote Speakerin · Pitch-Trainerin · KI-Managerin</p>
          <div className="sf-example-badges">
            <span className="sf-badge sf-badge--pink">Keynote 15 Min</span>
            <span className="sf-badge sf-badge--blue">Köln</span>
          </div>
        </div>
      </div>

      <div className="sf-example-vimeo">
        <iframe
          src="https://player.vimeo.com/video/1186277047?badge=0&autopause=0&player_id=0&app_id=58479"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          title="The Power of AI"
        ></iframe>
      </div>

      <div className="sf-example-fields">
        <div className="sf-example-field">
          <span className="sf-example-field-label">Vortragstitel</span>
          <p>Die Wirkungskraft des Elevator Pitch im KI-Zeitalter</p>
        </div>
        <div className="sf-example-field">
          <span className="sf-example-field-label">Kurzbeschreibung <span className="sf-char-count">365/500</span></span>
          <p>KI-Perfektion ist klickbar. Unverwechselbarkeit überzeugt. Deine hörbare Persönlichkeit ist dein stärkstes Marketinginstrument. Claudia Conen zeigt, wie du im KI-Zeitalter mit Stimme, Haltung und einer klaren Botschaft Vertrauen aufbaust, im Kopf bleibst und KI als kluge Abkürzung nutzt – für mehr Tempo, mehr Klarheit und mehr echte Verbindung.</p>
        </div>
        <div className="sf-example-field">
          <span className="sf-example-field-label">Kernbotschaft <span className="sf-char-count">62/140</span></span>
          <p>KI kann perfektionieren. Vertrauen entsteht durch Persönlichkeit.</p>
        </div>

        <div className="sf-example-field">
          <span className="sf-example-field-label">Die Botschaft</span>
          <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden' }}>
            <img
              src="/photo_2026-04-24_17.14.42.jpeg"
              alt="Die Botschaft"
              style={{ width: '100%', display: 'block', borderRadius: '10px' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,.7))',
              padding: '24px 12px 12px',
            }}>
              <audio
                src="/audioklein.mp4"
                controls
                preload="metadata"
                style={{ width: '100%', height: '36px' }}
              />
            </div>
          </div>
        </div>

        <div className="sf-example-field">
          <span className="sf-example-field-label">Links</span>
          <div className="sf-example-links">
            <a href="https://www.linkedin.com/in/claudia-conen-die-stimme/" target="_blank" rel="noopener noreferrer"><ExternalLink size={12} /> linkedin.com/in/claudia-conen-die-stimme</a>
            <a href="https://claudiaconen.com" target="_blank" rel="noopener noreferrer"><ExternalLink size={12} /> claudiaconen.com</a>
            <a href="https://www.instagram.com/claudia_conen_umsatzstimme/" target="_blank" rel="noopener noreferrer"><ExternalLink size={12} /> instagram.com/claudia_conen_umsatzstimme</a>
          </div>
        </div>
      </div>

    </div>
  );
}
