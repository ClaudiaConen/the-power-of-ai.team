import { useEffect } from 'react';
import { ArrowLeft, Play, MonitorSmartphone, MessageCircle, Camera, Mic, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

export default function ProductDetail1() {
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
            <div className="nav-n">Power <em>Upgrade</em></div>
            <div className="nav-s">Live punkten</div>
          </div>
        </div>
      </header>

      <section className="pd-hero">
        <div className="pd-hero-bg"></div>
        <div className="pd-hero-in">
          <div className="pd-hero-text">
            <div className="pd-badge">
              <span className="pd-badge-dot"></span>
              Power Upgrade · Live Punkten
            </div>
            <h1 className="pd-h1">
              Im KI-Zeitalter wird
              <br />
              <em>Persönlichkeit</em>
              <br />
              unbezahlbar.
            </h1>
            <p className="pd-lead">
              Algorithmen können Perfektion auf Knopfdruck liefern. Sie können Texte schreiben, Bilder erschaffen, Strategien entwickeln. Aber sie können eines nicht: <strong>Vertrauen wecken.</strong>
            </p>
            <p className="pd-lead" style={{ marginTop: '12px' }}>
              Vertrauen entsteht nur, wenn ein Mensch sichtbar wird. Echte Stimme. Echter Auftritt. Echte Persönlichkeit.
            </p>
            <div className="pd-hero-cta">
              <a
                href="https://umsatzstimme-claudiaconen.tentary.com/p/MKGnIr/checkout"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-p"
              >
                Jetzt Platz sichern — 530€
              </a>
            </div>
          </div>
          <div className="pd-hero-img">
            <img src="/ClaudiaRonny_(1).png" alt="Claudia Conen und Ronny Barthel — Power Upgrade Live Pitch Event" width="420" height="560" fetchPriority="high" />
          </div>
        </div>
      </section>

      <section className="pd-what">
        <div className="pd-w">
          <div className="pd-what-label">Genau das bekommst du hier</div>
          <div className="pd-what-grid">
            <div className="pd-what-item">
              <div className="pd-what-icon"><Mic size={20} /></div>
              <h3>Live Bühnen-Pitch</h3>
              <p>Deine Chance, live auf einer Bühne zu pitchen</p>
            </div>
            <div className="pd-what-item">
              <div className="pd-what-icon"><Play size={20} /></div>
              <h3>Echtes Publikum</h3>
              <p>Dein Publikum, das dir wirklich zuhört</p>
            </div>
            <div className="pd-what-item">
              <div className="pd-what-icon"><CheckCircle2 size={20} /></div>
              <h3>Pitch-Training</h3>
              <p>Ein Pitch-Training, das dich vorbereitet</p>
            </div>
            <div className="pd-what-item">
              <div className="pd-what-icon"><Camera size={20} /></div>
              <h3>Profi-Fotos</h3>
              <p>7 hochprofessionelle Brand-Fotos für deine Marke</p>
            </div>
            <div className="pd-what-item">
              <div className="pd-what-icon" style={{ color: 'var(--pk)' }}><Play size={20} /></div>
              <h3>Video-Beweis</h3>
              <p>Ein Video deines Auftritts als Beweis</p>
            </div>
          </div>
          <p className="pd-manifesto">
            Damit aus deiner Persönlichkeit eine Sichtbarkeit wird, die Vertrauen weckt — und bleibt.
            <br />
            <strong>Weil Persönlichkeit bleibt. Auch wenn KI alles andere austauschbar macht.</strong>
          </p>
        </div>
      </section>

      <div className="ruleg"></div>

      <section className="pd-timeline">
        <div className="pd-w">
          <div className="pd-tl-header">
            <div className="lbl">Der Weg</div>
            <h2 className="sh2">
              Wie läuft das ab?
            </h2>
            <p className="slead">
              Vom Kauf bis zur Bühne — in fünf Etappen.
            </p>
          </div>

          <div className="pd-tl">
            <div className="pd-tl-line"></div>

            <div className="pd-tl-step">
              <div className="pd-tl-marker">
                <span>1</span>
              </div>
              <div className="pd-tl-card">
                <div className="pd-tl-tag">Innerhalb 24 Stunden</div>
                <h3 className="pd-tl-title">Dein sofortiger Zugang</h3>
                <p className="pd-tl-text">
                  Direkt nach deinem Kauf bekommst du innerhalb von 24 Stunden Zugang zum 7-Schritte Online Pitch-Training.
                </p>
                <div className="pd-tl-icon"><MonitorSmartphone size={28} strokeWidth={1.5} /></div>
              </div>
            </div>

            <div className="pd-tl-step">
              <div className="pd-tl-marker pd-tl-marker--pk">
                <span>2</span>
              </div>
              <div className="pd-tl-card">
                <div className="pd-tl-tag" style={{ color: 'var(--pk)' }}>Das Herzstück</div>
                <h3 className="pd-tl-title">Die 7-Schritte-Formel</h3>
                <p className="pd-tl-text">
                  Sieben klare Schritte, mit denen du dich im Gehirn deiner Zuhörer verankerst.
                </p>
                <ul className="pd-tl-list">
                  <li>Storytelling, das hängenbleibt</li>
                  <li>Neurowissenschaftliche Erkenntnisse</li>
                </ul>
                <p className="pd-tl-text" style={{ marginTop: '8px' }}>
                  Damit verkauft sich nicht dein Produkt — sondern <strong>deine Persönlichkeit.</strong>
                </p>
                <div className="pd-tl-meta">
                  <MonitorSmartphone size={14} />
                  Du startest, wann du willst. Auf jedem Gerät · 24/7 verfügbar
                </div>
              </div>
            </div>

            <div className="pd-tl-step">
              <div className="pd-tl-marker">
                <span>3</span>
              </div>
              <div className="pd-tl-card">
                <div className="pd-tl-tag">Live-Training im Zoom</div>
                <h3 className="pd-tl-title">Donnerstag · 30. April 2026</h3>
                <div className="pd-tl-slots">
                  <div className="pd-tl-slot">
                    <span className="pd-tl-slot-time">17:00 – 20:00</span>
                    <span className="pd-tl-slot-label">Abends</span>
                  </div>
                </div>
                <p className="pd-tl-text" style={{ marginTop: '12px' }}>
                  Drei Stunden interaktives Pitch-Training. Live mit Coach. Bis dein 90-Sekunden-Pitch sitzt.
                </p>
              </div>
            </div>

            <div className="pd-tl-step">
              <div className="pd-tl-marker pd-tl-marker--pk">
                <span>4</span>
              </div>
              <div className="pd-tl-card">
                <div className="pd-tl-tag" style={{ color: 'var(--pk)' }}>Persönliches Feedback</div>
                <h3 className="pd-tl-title">Direkt per WhatsApp</h3>
                <p className="pd-tl-text">
                  Zwischen Zoom-Training und Bühnen-Auftritt bist du nicht allein. Du bekommst direktes persönliches Feedback — direkt auf WhatsApp.
                </p>
                <ul className="pd-tl-list">
                  <li>Schick deinen Pitch als Sprachnachricht oder Video</li>
                  <li>Konkretes Feedback, persönlich und direkt</li>
                  <li>Drei Runden à 90 Sekunden bis dein Pitch sitzt</li>
                </ul>
                <p className="pd-tl-accent">So gehst du sicher auf die Bühne.</p>
                <div className="pd-tl-icon"><MessageCircle size={28} strokeWidth={1.5} /></div>
              </div>
            </div>

            <div className="pd-tl-step">
              <div className="pd-tl-marker pd-tl-marker--gold">
                <span>5</span>
              </div>
              <div className="pd-tl-card pd-tl-card--highlight">
                <div className="pd-tl-tag" style={{ color: 'var(--g2)' }}>Der Moment</div>
                <h3 className="pd-tl-title">Dein Bühnen-Auftritt in Köln</h3>
                <p className="pd-tl-subtitle">Live · vor Publikum · vor der Kamera</p>
                <ul className="pd-tl-list pd-tl-list--gold">
                  <li>Deine Bühne vor Publikum</li>
                  <li>Dein 90-Sekunden Elevator-Pitch live</li>
                  <li>Video-Aufzeichnung deines Moments</li>
                  <li>7 hochprofessionelle Brand-Fotos durch Ronny Barthel</li>
                </ul>
                <div className="pd-tl-slots" style={{ marginTop: '14px' }}>
                  <div className="pd-tl-slot">
                    <span className="pd-tl-slot-label">Vormittags</span>
                  </div>
                  <div className="pd-tl-slot">
                    <span className="pd-tl-slot-label">Oder Nachmittags</span>
                  </div>
                </div>
                <p className="pd-tl-text" style={{ marginTop: '10px', fontSize: '13px', color: 'var(--xlt)' }}>
                  Anmeldung im Vorfeld zur Planung
                </p>
              </div>
            </div>
          </div>

          <div className="pd-result">
            <div className="pd-result-line"></div>
            <h3 className="pd-result-title">Du gehst raus mit:</h3>
            <div className="pd-result-items">
              <div className="pd-result-item">
                <Play size={18} />
                <span>Einem gefilmten Pitch</span>
              </div>
              <div className="pd-result-item">
                <Camera size={18} />
                <span>7 Profi-Fotos für deine Marke</span>
              </div>
              <div className="pd-result-item">
                <CheckCircle2 size={18} />
                <span>Content, der nachwirkt</span>
              </div>
              <div className="pd-result-item">
                <Mic size={18} />
                <span>Einer Klarheit, die überzeugt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ruleg"></div>

      <section className="pd-audience">
        <div className="pd-w">
          <h2 className="sh2" style={{ textAlign: 'center', marginBottom: '48px' }}>
            Ist das <em>für dich?</em>
          </h2>
          <div className="pd-aud-grid">
            <div className="pd-aud-yes">
              <div className="pd-aud-head pd-aud-head--yes">Das ist für dich, wenn du:</div>
              <ul className="pd-aud-list">
                <li>
                  <CheckCircle2 size={16} className="pd-aud-check" />
                  <span>Selbständig, Coach oder Experte bist und spürst, dass mehr in dir steckt als bisher sichtbar wird</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="pd-aud-check" />
                  <span>Eine Botschaft hast, die mehr Menschen erreichen sollte</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="pd-aud-check" />
                  <span>Es leid bist, dich hinter LinkedIn-Posts und perfekten E-Mails zu verstecken</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="pd-aud-check" />
                  <span>Verstanden hast, dass im KI-Zeitalter nicht Perfektion zählt, sondern Persönlichkeit</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="pd-aud-check" />
                  <span>Bereit bist, einmal mutig zu sein — und auf eine Bühne zu gehen</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="pd-aud-check" />
                  <span>Brand-Fotos und ein Video brauchst, die deine echte Wirkung zeigen</span>
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
                  <span>Nicht bereit bist, vor echten Menschen zu sprechen</span>
                </li>
                <li>
                  <XCircle size={16} className="pd-aud-x" />
                  <span>Auf den perfekten Moment wartest, statt ihn zu schaffen</span>
                </li>
                <li>
                  <XCircle size={16} className="pd-aud-x" />
                  <span>Glaubst, dass ein neues KI-Tool dir Sichtbarkeit schenkt</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="pd-honest">
            Sei ehrlich zu dir. Wenn du dich in der ersten Liste wiederfindest, ist das hier dein Programm.
          </p>
        </div>
      </section>

      <section className="pd-bottom-cta">
        <div className="pd-w" style={{ textAlign: 'center' }}>
          <div className="qline"></div>
          <h2 className="sh2 sh2-lt" style={{ marginBottom: '14px' }}>
            Bereit für <em>die Bühne?</em>
          </h2>
          <p style={{ fontFamily: 'var(--ffs)', fontSize: '20px', fontStyle: 'italic', color: 'rgba(255,255,255,.65)', marginBottom: '32px' }}>
            Dein Pitch. Dein Auftritt. Deine Sichtbarkeit.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="https://umsatzstimme-claudiaconen.tentary.com/p/MKGnIr/checkout"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-p"
              style={{ background: 'linear-gradient(135deg,var(--g1),var(--g3))', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Jetzt Platz sichern — 530€ <ChevronRight size={14} />
            </a>
            <a
              href="#kontakt?produkt=power-upgrade"
              className="btn-g"
              style={{ color: 'rgba(255,255,255,.5)' }}
            >
              Persönlich anfragen <span className="ar">→</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="foot">
        <span>© 2026 Claudia Conen · Die Umsatzstimme</span>
        <div style={{ display: 'flex', gap: '20px' }}>
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
