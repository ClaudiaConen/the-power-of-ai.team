import mobileHeroBg from '../assets/AlledreiKlausclaudiaronny_(1).png';

export default function Hero() {
  return (
    <section className="hero hero--bg">
      <div className="hero-bg-img hero-bg-img--desktop">
        <img src="/Gabi_FVRonny_Event_(Flyer_(A4))_(1).png" alt="The Power of AI Event — Buehne und Publikum" />
      </div>
      <div className="hero-bg-img hero-bg-img--mobile">
        <img src={mobileHeroBg} alt="Klaus, Claudia Conen und Ronny Barthel — The Power of AI Team" />
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-in hero-in--single">
        <div>
          <img src="/THE_POWER_OF.png" alt="The Power of AI" className="hero-logo hero-logo--light" />
          <div className="pill pill--dark">
            <span className="pill-d pill-d--gold"></span>
            <span>Nicht lernen — Umsetzen · 2026</span>
          </div>
          <h1 className="hh hh--light">
            <span className="hh-dim">Im Zeitalter der</span>{' '}
            <span>KI-Perfektion</span>
            <br />
            <span className="hh-dim">wird</span>{' '}
            <em>Persönlichkeit</em>
            <br />
            <em>unbezahlbar.</em>
          </h1>
          <div className="hcta">
            <a
              href="#kontakt"
              className="btn-g btn-g--light"
            >
              Persönlich anfragen <span className="ar">→</span>
            </a>
          </div>
        </div>
      </div>
      <div className="scue scue--light">
        <span>Scroll</span>
        <div className="scue-b"></div>
      </div>
    </section>
  );
}
