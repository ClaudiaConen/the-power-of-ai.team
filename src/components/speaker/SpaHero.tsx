export default function SpaHero() {
  return (
    <section className="spa-hero">
      <div className="spa-hero-accent" />
      <div className="spa-hero-inner">
        <h1 className="spa-hero-h1">The Power of AI</h1>
        <p className="spa-hero-sub spa-hero-sub--gold">Wirkungskraft Mensch im KI-Zeitalter</p>

        <div className="spa-hero-video">
          <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', borderRadius: '16px', overflow: 'hidden' }}>
            <iframe
              src="https://player.vimeo.com/video/1186288566?badge=0&autopause=0&player_id=0&app_id=58479"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              referrerPolicy="strict-origin-when-cross-origin"
              title="The Power of AI"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>

        <div className="spa-hero-buttons">
          <a
            href="https://free.the-power-of.ai/?event=6"
            className="spa-btn-koeln"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="spa-btn-koeln-glow" />
            Gratisticket sichern
          </a>
          <a
            href="#spa-pakete"
            className="spa-btn-ghost"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('spa-pakete')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Alle Pakete ansehen
          </a>
        </div>
      </div>
    </section>
  );
}
