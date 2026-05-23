import { useEffect, useRef } from 'react';
import brandImg from '../assets/imgi_4_hero_(1).png';

export default function BrandBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = (vh - rect.top) / (vh + rect.height);
      const offset = (progress - 0.5) * 80;
      img.style.transform = `translate3d(0, ${offset}px, 0) scale(1.15)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="bb" ref={sectionRef}>
      <div className="bb-img" ref={imgRef}>
        <img src={brandImg} alt="AI Connect Meetups" loading="lazy" />
      </div>

      <div className="bb-overlay" />

      <div className="bb-glow bb-glow--1" />
      <div className="bb-glow bb-glow--2" />
      <div className="bb-glow bb-glow--3" />

      <div className="bb-particles">
        <span className="bb-dot bb-dot--1" />
        <span className="bb-dot bb-dot--2" />
        <span className="bb-dot bb-dot--3" />
        <span className="bb-dot bb-dot--4" />
        <span className="bb-dot bb-dot--5" />
      </div>

      <div className="bb-content rv">
        <div className="bb-label">
          <span className="bb-label-dot" />
          AI Connect Meetups
        </div>
        <h2 className="bb-title">
          Wo <em>Menschen</em> und <span className="bb-pk">KI</span>
          <br />
          zusammenwachsen.
        </h2>
        <p className="bb-sub">
          Live erleben.<br />
          Gemeinsam wachsen.<br />
          Persönlichkeit trifft Technologie.
        </p>
        <a
          href="https://the-power-of-ai.team/#speaker-anmeldung"
          className="bb-cta-btn"
        >
          Speakeranmeldung
        </a>
        <div className="bb-line" />
      </div>

      <div className="bb-edge bb-edge--top" />
      <div className="bb-edge bb-edge--bottom" />
    </section>
  );
}
