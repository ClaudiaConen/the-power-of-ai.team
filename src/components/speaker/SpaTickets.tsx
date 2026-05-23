import { Star, ChevronRight } from 'lucide-react';

export default function SpaTickets() {
  return (
    <section id="spa-pakete" className="spa-tickets">
      <div className="spa-tickets-inner">
        <p className="spa-tickets-eyebrow">SICHERE DIR DEINEN PLATZ</p>
        <h2 className="spa-tickets-h2">Sichere dir deinen Platz.</h2>

        <div className="spa-tickets-grid">
          <div className="spa-ticket spa-ticket--free">
            <div className="spa-ticket-bar" />
            <div className="spa-ticket-top">
              <span className="spa-ticket-label spa-ticket-label--entry">DEIN EINSTIEG</span>
              <h3 className="spa-ticket-title">Free Ticket</h3>
              <p className="spa-ticket-sub">Business Netzwerk Day</p>
            </div>
            <ul className="spa-ticket-list">
              <li>Eintritt zum Event</li>
              <li>Breakout Sessions</li>
              <li>Networking &amp; Austausch</li>
              <li>Skool Community</li>
            </ul>
            <div className="spa-ticket-bottom">
              <a
                href="https://free.the-power-of.ai/?event=6"
                className="spa-ticket-btn spa-ticket-btn--outline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ticket sichern <ChevronRight size={14} />
              </a>
              <span className="spa-ticket-note">Community inklusive</span>
            </div>
          </div>

          <div className="spa-ticket spa-ticket--starter spa-ticket--featured">
            <div className="spa-ticket-bar" />
            <div className="spa-ticket-top">
              <span className="spa-ticket-badge">
                <Star size={12} /> BELIEBTESTE WAHL
              </span>
              <span className="spa-ticket-label spa-ticket-label--basis">BASIS-PAKET</span>
              <h3 className="spa-ticket-title">
                Starter Pitch<br />&amp; Keynote
              </h3>
              <p className="spa-ticket-sub">Deine Bühne. Dein Stand.</p>
            </div>
            <ul className="spa-ticket-list">
              <li>Pitch auf der Bühne</li>
              <li>Rollup + Standtisch</li>
              <li>Barcamp + Videoaufzeichnung</li>
            </ul>
            <div className="spa-ticket-upgrades">
              <span className="spa-ticket-upgrades-label">+ UPGRADES (Flip-Pills)</span>
              <div className="spa-ticket-pills">
                <span className="spa-pill">+15 Keynote</span>
                <span className="spa-pill">+25 Keynote</span>
                <span className="spa-pill">Profi-Shooting</span>
                <span className="spa-pill">BC-Room</span>
              </div>
            </div>
            <div className="spa-ticket-bottom">
              <a href="#speaker-formular" className="spa-ticket-btn spa-ticket-btn--primary">
                Basis-Paket buchen <ChevronRight size={14} />
              </a>
            </div>
          </div>

          <div className="spa-ticket spa-ticket--stage">
            <div className="spa-ticket-bar" />
            <div className="spa-ticket-top">
              <span className="spa-ticket-label spa-ticket-label--signature">SIGNATURE EXPERIENCE</span>
              <span className="spa-ticket-label spa-ticket-label--allin">ALL-IN UPGRADE</span>
              <h3 className="spa-ticket-title">The 7 Stage</h3>
              <p className="spa-ticket-sub">Werde unvergesslich.</p>
            </div>
            <ul className="spa-ticket-list spa-ticket-list--no-arrow">
              <li>7 Profi-Fotos</li>
              <li>7 Short-Clips Social Media</li>
              <li>+ Keynote-Highlight-Video</li>
              <li>7 Vorab-Impulse</li>
              <li>+ Workbook &middot; + Profi-Keynote</li>
            </ul>
            <div className="spa-ticket-price">
              <span className="spa-ticket-amount">1.777 &euro;</span>
              <span className="spa-ticket-price-note">zzgl. Basis-Paket</span>
            </div>
            <div className="spa-ticket-bottom">
              <a href="#speaker-formular?stage7=1" className="spa-ticket-btn spa-ticket-btn--primary">
                The 7 Stage buchen <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </div>

        <p className="spa-tickets-vat">Alle Preise zzgl. MwSt.</p>
      </div>
    </section>
  );
}
