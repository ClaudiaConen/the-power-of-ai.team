import { ChevronRight } from 'lucide-react';

export default function SpaSkool() {
  return (
    <section className="spa-skool">
      <div className="spa-skool-inner">
        <div className="spa-skool-left">
          <div className="spa-skool-icon">S</div>
          <div>
            <p className="spa-skool-label">GRATIS &middot; COMMUNITY AUF SKOOL</p>
            <p className="spa-skool-text">Sei Teil der Power-of-AI-Community.</p>
          </div>
        </div>
        <a
          href="https://www.skool.com/the-power-of-ai/about?ref=c6865d085a4f482a8b73ac2e3a731de7"
          target="_blank"
          rel="noopener noreferrer"
          className="spa-skool-btn"
        >
          Community <ChevronRight size={14} />
        </a>
      </div>
    </section>
  );
}
