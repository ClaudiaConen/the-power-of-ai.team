import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function SpaAudio() {
  const [slide, setSlide] = useState(0);
  const slides = ['Bild 1', 'Bild 2', 'Bild 3'];

  const prev = () => setSlide((s) => (s === 0 ? slides.length - 1 : s - 1));
  const next = () => setSlide((s) => (s === slides.length - 1 ? 0 : s + 1));

  return (
    <section className="spa-audio">
      <div className="spa-audio-inner">
        <div className="spa-audio-left">
          <div className="spa-audio-wave">
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                className="spa-audio-bar"
                style={{ animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
          <div className="spa-audio-text">
            <p className="spa-audio-label">AUDIO + BILDER-SLIDER</p>
            <p className="spa-audio-sub">Audio-Botschaft + Bilder-Slider &middot; Persönlich von Ronny</p>
          </div>
        </div>
        <div className="spa-audio-right">
          <button className="spa-audio-nav spa-audio-nav--prev" onClick={prev} aria-label="Vorheriges Bild">
            <ChevronLeft size={18} />
          </button>
          <div className="spa-audio-slides">
            {slides.map((label, i) => (
              <div
                key={i}
                className={`spa-audio-slide${i === slide ? ' spa-audio-slide--active' : ''}`}
              >
                <span>{label}</span>
              </div>
            ))}
          </div>
          <button className="spa-audio-nav spa-audio-nav--next" onClick={next} aria-label="Nächstes Bild">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
