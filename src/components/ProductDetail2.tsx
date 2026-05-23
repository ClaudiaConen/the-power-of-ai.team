import { useEffect } from 'react';
import { ArrowLeft, Brain, Mic, Sparkles, Camera, Target, MapPin, CheckCircle2, XCircle, ChevronRight, CalendarDays } from 'lucide-react';

export default function ProductDetail2() {
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
            <div className="nav-n"><span className="pk">Unersetzbar</span></div>
            <div className="nav-s">Der Live Tag</div>
          </div>
        </div>
      </header>

      <section className="pd-hero">
        <div className="pd-hero-bg"></div>
        <div className="pd-hero-in">
          <div className="pd-hero-text">
            <div className="pd-badge">
              <span className="pd-badge-dot"></span>
              Unersetzbar · Der Live Tag
            </div>
            <h1 className="pd-h1">
              Ein Tag. Drei Experten.
              <br />
              Deine <em>Transformation</em>
              <br />
              im KI-Zeitalter.
            </h1>
            <p className="pd-lead">
              KI macht vieles schneller. Sichtbar bleiben die, die Technik mit Persönlichkeit, Präsenz und klarer Positionierung verbinden.
            </p>
            <p className="pd-lead" style={{ marginTop: '12px' }}>
              Du verbindest psychologische Klarheit, menschliche Wirkung, KI-Praxis und professionelle Sichtbarkeit in einem <strong>marktreifen Gesamtauftritt.</strong>
            </p>
            <div className="pd-hero-cta">
              <a
                href="https://umsatzstimme-claudiaconen.tentary.com/p/2JjVGI/checkout"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-p"
              >
                Jetzt Platz sichern — 990€ zzgl. MwSt.
              </a>
            </div>
          </div>
          <div className="pd-hero-img">
            <img src="/KlausClaudiaRonny_(1).png" alt="Klaus, Claudia Conen und Ronny Barthel — Unersetzbar, der Live Tag fuer Positionierung und Wirkung" width="420" height="560" fetchPriority="high" />
          </div>
        </div>
      </section>

      <section className="pd-what">
        <div className="pd-w">
          <div className="pd-what-label">Das erwartet dich an diesem Tag</div>
          <div className="pd-what-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="pd-what-item">
              <div className="pd-what-icon"><Brain size={20} /></div>
              <h3>Psychologische Klarheit</h3>
              <p>Tiefe statt oberflächlichem Tool-Hype für deine Positionierung</p>
            </div>
            <div className="pd-what-item">
              <div className="pd-what-icon"><Mic size={20} /></div>
              <h3>Menschliche Wirkung</h3>
              <p>Wirkung, Stimme, Präsenz und Positionierung mit direktem Praxisbezug</p>
            </div>
            <div className="pd-what-item">
              <div className="pd-what-icon"><Sparkles size={20} /></div>
              <h3>KI-Integration</h3>
              <p>Praktische KI-Praxis als echtes Werkzeug in deinem Business</p>
            </div>
            <div className="pd-what-item">
              <div className="pd-what-icon"><Camera size={20} /></div>
              <h3>Professionelle Sichtbarkeit</h3>
              <p>Authentische Portraits für LinkedIn, Website und professionelle Sichtbarkeit</p>
            </div>
            <div className="pd-what-item">
              <div className="pd-what-icon"><Target size={20} /></div>
              <h3>Marktreifer Gesamtauftritt</h3>
              <p>Am Ende des Tages bist du unverwechselbar — online und offline</p>
            </div>
            <div className="pd-what-item">
              <div className="pd-what-icon" style={{ color: 'var(--pk)' }}><MapPin size={20} /></div>
              <h3>Exklusiv in Köln</h3>
              <p>Kleine Gruppe, maximale Aufmerksamkeit. Ein Tag, der alles verändert</p>
            </div>
          </div>
          <div className="pd2-dates">
            <div className="pd2-dates-header">
              <CalendarDays size={20} />
              <h3>Termine — Wähle deinen Tag</h3>
            </div>
            <div className="pd2-dates-grid">
              <div className="pd2-date-card">
                <div className="pd2-date-day">Donnerstag</div>
                <div className="pd2-date-full">19. Juni 2026</div>
                <div className="pd2-date-loc">
                  <MapPin size={14} />
                  Köln
                </div>
              </div>
              <div className="pd2-date-divider">oder</div>
              <div className="pd2-date-card">
                <div className="pd2-date-day">Montag</div>
                <div className="pd2-date-full">13. Juli 2026</div>
                <div className="pd2-date-loc">
                  <MapPin size={14} />
                  Köln
                </div>
              </div>
            </div>
          </div>

          <p className="pd-manifesto">
            Sichtbar bleiben die, die Technik mit Persönlichkeit, Präsenz und klarer Positionierung verbinden.
            <br />
            <strong>Weil Austauschbarkeit keine Option ist.</strong>
          </p>
        </div>
      </section>

      <div className="ruleg"></div>

      <section className="pd-timeline">
        <div className="pd-w">
          <div className="pd-tl-header">
            <div className="lbl">Dein Tag</div>
            <h2 className="sh2">
              Was dich <em>erwartet</em>
            </h2>
            <p className="slead">
              Ein Tag. Drei Experten. Maximale Wirkung.
            </p>
          </div>

          <div className="pd-tl">
            <div className="pd-tl-line"></div>

            <div className="pd-tl-step">
              <div className="pd-tl-marker">
                <span>1</span>
              </div>
              <div className="pd-tl-card">
                <div className="pd-tl-tag">Fundament</div>
                <h3 className="pd-tl-title">Psychologische Klarheit für deine Positionierung</h3>
                <p className="pd-tl-text">
                  Psychologische Tiefe statt oberflächlichem Tool-Hype. Verstehe, was dich wirklich einzigartig macht — und wie du das klar kommunizierst.
                </p>
                <div className="pd-tl-icon"><Brain size={28} strokeWidth={1.5} /></div>
              </div>
            </div>

            <div className="pd-tl-step">
              <div className="pd-tl-marker pd-tl-marker--pk">
                <span>2</span>
              </div>
              <div className="pd-tl-card">
                <div className="pd-tl-tag" style={{ color: 'var(--pk)' }}>Wirkung</div>
                <h3 className="pd-tl-title">Menschliche Wirkung in der digitalen Welt</h3>
                <p className="pd-tl-text">
                  Wirkung, Stimme, Präsenz und Positionierung mit direktem Praxisbezug. Du lernst, wie du einen Raum veränderst — auch digital.
                </p>
                <div className="pd-tl-icon"><Mic size={28} strokeWidth={1.5} /></div>
              </div>
            </div>

            <div className="pd-tl-step">
              <div className="pd-tl-marker">
                <span>3</span>
              </div>
              <div className="pd-tl-card">
                <div className="pd-tl-tag">Praxis</div>
                <h3 className="pd-tl-title">Praktische KI-Integration in dein Business</h3>
                <p className="pd-tl-text">
                  KI als echtes Werkzeug nutzen — nicht als Spielerei, sondern als Abkürzung in deinem Alltag. Du setzt direkt um.
                </p>
                <div className="pd-tl-icon"><Sparkles size={28} strokeWidth={1.5} /></div>
              </div>
            </div>

            <div className="pd-tl-step">
              <div className="pd-tl-marker pd-tl-marker--pk">
                <span>4</span>
              </div>
              <div className="pd-tl-card">
                <div className="pd-tl-tag" style={{ color: 'var(--pk)' }}>Sichtbarkeit</div>
                <h3 className="pd-tl-title">Professionelle Sichtbarkeits-Strategien</h3>
                <p className="pd-tl-text">
                  Authentische Portraits für LinkedIn, Website und professionelle Sichtbarkeit. Dein Auftritt bekommt ein Gesicht, das wirkt.
                </p>
                <div className="pd-tl-icon"><Camera size={28} strokeWidth={1.5} /></div>
              </div>
            </div>

            <div className="pd-tl-step">
              <div className="pd-tl-marker pd-tl-marker--gold">
                <span>5</span>
              </div>
              <div className="pd-tl-card pd-tl-card--highlight">
                <div className="pd-tl-tag" style={{ color: 'var(--g2)' }}>Das Ergebnis</div>
                <h3 className="pd-tl-title">Dein marktreifer Gesamtauftritt</h3>
                <p className="pd-tl-subtitle">Positionierung · Wirkung · Klarheit</p>
                <ul className="pd-tl-list pd-tl-list--gold">
                  <li>Psychologische Klarheit über deine Positionierung</li>
                  <li>Menschliche Wirkung, die Vertrauen schafft</li>
                  <li>KI als integriertes Werkzeug in deinem Business</li>
                  <li>Professionelle Sichtbarkeit mit authentischen Portraits</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pd-result">
            <div className="pd-result-line"></div>
            <h3 className="pd-result-title">Du gehst raus mit:</h3>
            <div className="pd-result-items">
              <div className="pd-result-item">
                <Brain size={18} />
                <span>Klarheit über deine Positionierung</span>
              </div>
              <div className="pd-result-item">
                <Mic size={18} />
                <span>Wirkung, die Vertrauen weckt</span>
              </div>
              <div className="pd-result-item">
                <Camera size={18} />
                <span>Authentischen Portraits für deine Marke</span>
              </div>
              <div className="pd-result-item">
                <Target size={18} />
                <span>Einem marktreifen Gesamtauftritt</span>
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
                  <span>Selbstständig, Unternehmer, Führungskraft, Berater oder Experte mit Verantwortung bist</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="pd-aud-check" />
                  <span>KI nicht nur nutzen, sondern deine eigene Wirkung damit gezielt verstärken willst</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="pd-aud-check" />
                  <span>Nicht austauschbar auftreten willst, sondern klarer, relevanter und merkfähiger werden möchtest</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="pd-aud-check" />
                  <span>Psychologische Tiefe statt oberflächlichem Tool-Hype suchst</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="pd-aud-check" />
                  <span>Wirkung, Stimme, Präsenz und Positionierung mit direktem Praxisbezug erleben willst</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="pd-aud-check" />
                  <span>Authentische Portraits für LinkedIn, Website und professionelle Sichtbarkeit brauchst</span>
                </li>
              </ul>
            </div>
            <div className="pd-aud-no">
              <div className="pd-aud-head pd-aud-head--no">Das ist nicht für dich, wenn du:</div>
              <ul className="pd-aud-list">
                <li>
                  <XCircle size={16} className="pd-aud-x" />
                  <span>Nur ein weiteres Tool-Seminar suchst, ohne an deiner persönlichen Wirkung zu arbeiten</span>
                </li>
                <li>
                  <XCircle size={16} className="pd-aud-x" />
                  <span>Glaubst, dass KI allein dir Sichtbarkeit und Vertrauen schenkt</span>
                </li>
                <li>
                  <XCircle size={16} className="pd-aud-x" />
                  <span>Austauschbar bleiben willst und dich hinter Technik versteckst</span>
                </li>
                <li>
                  <XCircle size={16} className="pd-aud-x" />
                  <span>Nicht bereit bist, dich einen ganzen Tag intensiv mit deiner Positionierung auseinanderzusetzen</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="pd-honest">
            Sei ehrlich zu dir. Wenn du dich in der ersten Liste wiederfindest, ist dieser Tag für dich gemacht.
          </p>
        </div>
      </section>

      <section className="pd-bottom-cta">
        <div className="pd-w" style={{ textAlign: 'center' }}>
          <div className="qline"></div>
          <h2 className="sh2 sh2-lt" style={{ marginBottom: '14px' }}>
            Bereit für deinen <em>Tag?</em>
          </h2>
          <p style={{ fontFamily: 'var(--ffs)', fontSize: '20px', fontStyle: 'italic', color: 'rgba(255,255,255,.65)', marginBottom: '32px' }}>
            Ein Tag. Drei Experten. Deine Transformation im KI-Zeitalter.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="https://umsatzstimme-claudiaconen.tentary.com/p/2JjVGI/checkout"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-p"
              style={{ background: 'linear-gradient(135deg,var(--g1),var(--g3))', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Jetzt Platz sichern — 990€ zzgl. MwSt. <ChevronRight size={14} />
            </a>
            <a
              href="#kontakt?produkt=unersetzbar"
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
