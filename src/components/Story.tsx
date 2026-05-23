import claudiaEvent from '../assets/photo_2026-03-31_17.34.27.jpeg';

export default function Story() {
  return (
    <section className="sec" style={{ padding: '80px 60px' }}>
      <div className="w story-grid">
        <div className="rv">
          <div className="lbl">Meine Berufung</div>
          <h2 className="sh2" style={{ fontSize: 'clamp(24px,3.5vw,40px)' }}>
            Seit meinem 11. Lebensjahr weiß ich: Menschen sind <em>unverwechselbar.</em>
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--mid)', lineHeight: 1.7, marginTop: '16px' }}>
            Was als unvergessliches Erlebnis begann, wurde meine Berufung: Ich weiß, deine
            Persönlichkeit ist unaufhaltbar — und ich weiß, wie du dich im Gehirn anderer Menschen
            verankern kannst.
          </p>
          <p style={{ fontSize: '15px', color: 'var(--mid)', lineHeight: 1.7, marginTop: '12px' }}>
            <strong style={{ color: 'var(--n)' }}>
              Nutze deine Persönlichkeit als Marke.
            </strong>{' '}
            Werde im KI-Zeitalter unverwechselbar — und schaffe dir Freiraum durch
            KI-Unterstützung.
          </p>
          <a href="#angebote" className="btn-g" style={{ marginTop: '16px' }}>
            Entdecke deinen Weg <span className="ar">→</span>
          </a>
        </div>
        <div className="rv d2 story-img">
          <img
            src={claudiaEvent}
            style={{ width: '100%', display: 'block' }}
            alt="Claudia Conen bei einem Live-Event — emotionaler Verkauf und Wirkung"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
