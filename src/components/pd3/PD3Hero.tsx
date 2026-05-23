export default function PD3Hero({ checkoutUrl }: { checkoutUrl: string }) {
  return (
    <section className="pd-hero">
      <div className="pd-hero-bg"></div>
      <div className="pd-hero-in">
        <div className="pd-hero-text">
          <div className="pd-badge">
            <span className="pd-badge-dot"></span>
            Voice to Brain · 90 Tage · Umsetzung
          </div>
          <h1 className="pd-h1">
            7 Schritte raus
            <br />
            aus der <em>KI-Masse.</em>
          </h1>
          <p className="pd-lead">
            KI-Perfektion ist klickbar. Unverwechselbarkeit nicht.
          </p>
          <p className="pd-lead" style={{ marginTop: '12px' }}>
            90 Tage echte Begleitung. Jeden Tag meine Stimme in deinem Ohr. Damit du nicht perfekt wirst — sondern <strong>unverwechselbar.</strong>
          </p>
          <div className="pd-hero-cta">
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-p btn-p--gold"
            >
              Platz sichern — Start 5. Oktober 2026
            </a>
          </div>
          <div className="pd3-hero-meta">
            <span>Nur 25 Plätze</span>
            <span className="pd3-hero-meta-sep"></span>
            <span>Gruppen-Mentoring</span>
            <span className="pd3-hero-meta-sep"></span>
            <span>KI integriert</span>
          </div>
        </div>
        <div className="pd-hero-img">
          <img src="/Claudia3.jpeg" alt="Claudia Conen — Mentorin fuer Stimme, Wirkung und Charisma im KI-Zeitalter" width="420" height="560" fetchPriority="high" />
        </div>
      </div>
    </section>
  );
}
