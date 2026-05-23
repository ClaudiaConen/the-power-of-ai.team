import { useState, useMemo } from 'react';
import { ChevronDown, ArrowRight, Tag, Loader2, Check, X } from 'lucide-react';

export interface UpgradeState {
  keynote15: boolean;
  keynote25: boolean;
  barcamp_room: boolean;
  stage7: boolean;
  shooting: boolean;
  workshop: boolean;
  coaching: boolean;
}

const PRICES = {
  basis: 500,
  keynote15: 500,
  keynote25: 750,
  barcamp_room: 170,
  stage7: 1777,
  shooting: 500,
  workshop: 177,
  coaching: 377,
};

export function calcGesamtpreis(u: UpgradeState): number {
  let total = PRICES.basis;
  if (u.keynote15) total += PRICES.keynote15;
  if (u.keynote25) total += PRICES.keynote25;
  if (u.barcamp_room) total += PRICES.barcamp_room;
  if (u.stage7) total += PRICES.stage7;
  if (u.shooting) total += PRICES.shooting;
  if (u.workshop) total += PRICES.workshop;
  if (u.coaching) total += PRICES.coaching;
  return total;
}

function fmtPrice(n: number): string {
  return n.toLocaleString('de-DE');
}

export type CouponStatus = 'idle' | 'loading' | 'valid' | 'invalid';

interface Props {
  upgrades: UpgradeState;
  onChange: (u: UpgradeState) => void;
  couponCode: string;
  couponDiscount: number;
  couponStatus: CouponStatus;
  couponMessage: string;
  onCouponCodeChange: (code: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
}

interface UpgradeRowProps {
  active: boolean;
  gold?: boolean;
  onClick: () => void;
  trigger: string;
  name: string;
  desc: string;
  price: string;
  priceSub?: string;
  tags?: string[];
  bigName?: boolean;
}

function UpgradeRow({ active, gold, onClick, trigger, name, desc, price, priceSub, tags, bigName }: UpgradeRowProps) {
  return (
    <div
      className={`upg-row${active ? ' upg-row--active' : ''}${gold ? ' upg-row--gold' : ''}`}
      onClick={onClick}
    >
      <div className={`upg-check${active ? ' upg-check--on' : ''}${gold && active ? ' upg-check--gold' : ''}`}>
        {active && <span className="upg-check-tick" />}
      </div>
      <div className="upg-row-body">
        <p className={`upg-trigger${gold ? ' upg-trigger--gold' : ''}`}>{trigger}</p>
        <p className={`upg-name${bigName ? ' upg-name--big' : ''}`}>{name}</p>
        <p className="upg-desc">{desc}</p>
        {tags && tags.length > 0 && (
          <div className="upg-tags">
            {tags.map((t) => <span key={t} className={`upg-tag${gold ? ' upg-tag--gold' : ''}`}>{t}</span>)}
          </div>
        )}
      </div>
      <div className="upg-price-col">
        <span className={`upg-price${gold ? ' upg-price--gold' : ''}`}>{price}</span>
        {priceSub && <span className="upg-price-sub">{priceSub}</span>}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="upg-section-label"><span>{children}</span></div>;
}

export default function SFPackageSelect({
  upgrades, onChange,
  couponCode, couponDiscount, couponStatus, couponMessage,
  onCouponCodeChange, onApplyCoupon, onRemoveCoupon,
}: Props) {
  const [afterEventOpen, setAfterEventOpen] = useState(false);

  const toggleKeynote = (which: 'keynote15' | 'keynote25') => {
    const other = which === 'keynote15' ? 'keynote25' : 'keynote15';
    onChange({
      ...upgrades,
      [which]: !upgrades[which],
      [other]: false,
    });
  };

  const toggle = (key: keyof UpgradeState) => {
    if (key === 'keynote15' || key === 'keynote25') {
      toggleKeynote(key);
      return;
    }
    onChange({ ...upgrades, [key]: !upgrades[key] });
  };

  const hasUpgrades = Object.values(upgrades).some(Boolean);
  const gesamtNetto = useMemo(() => calcGesamtpreis(upgrades), [upgrades]);
  const effectiveDiscount = Math.min(couponDiscount, gesamtNetto);
  const finalNetto = gesamtNetto - effectiveDiscount;
  const mwst = Math.round(finalNetto * 19) / 100;
  const brutto = finalNetto + mwst;

  const lineItems = useMemo(() => {
    const items: { label: string; value: string; isDiscount?: boolean }[] = [
      { label: 'Basis-Paket (3 Min Pitch + Stand + Barcamp)', value: `${fmtPrice(PRICES.basis)} \u20AC` },
    ];
    if (upgrades.keynote15) items.push({ label: '+15 Min Keynote', value: `${fmtPrice(PRICES.keynote15)} \u20AC` });
    if (upgrades.keynote25) items.push({ label: '+25 Min Keynote', value: `${fmtPrice(PRICES.keynote25)} \u20AC` });
    if (upgrades.barcamp_room) items.push({ label: 'Barcamp-Room 30 Min', value: `${fmtPrice(PRICES.barcamp_room)} \u20AC` });
    if (upgrades.stage7) items.push({ label: 'The 7 Stage', value: `${fmtPrice(PRICES.stage7)} \u20AC` });
    if (upgrades.shooting) items.push({ label: 'Professionelles Shooting', value: `${fmtPrice(PRICES.shooting)} \u20AC` });
    if (upgrades.workshop) items.push({ label: 'Performance Workshop', value: `${fmtPrice(PRICES.workshop)} \u20AC` });
    if (upgrades.coaching) items.push({ label: '1:1 Coaching', value: `${fmtPrice(PRICES.coaching)} \u20AC` });
    if (couponStatus === 'valid' && effectiveDiscount > 0) {
      items.push({ label: `Gutschein "${couponCode.toUpperCase()}"`, value: `\u2212${fmtPrice(effectiveDiscount)} \u20AC`, isDiscount: true });
    }
    return items;
  }, [upgrades, couponStatus, effectiveDiscount, couponCode]);

  const handleCouponKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onApplyCoupon();
    }
  };

  return (
    <div className="upg-wrap">
      <div className="upg-top-bar">
        <span className="upg-top-badge">DEIN PAKET ZUSAMMENSTELLEN</span>
        <span className="upg-top-hint">Alle Preise zzgl. MwSt.</span>
      </div>

      <div className="upg-basis">
        <h4 className="upg-basis-title">Dein Basis-Paket ist immer dabei.</h4>
        <p className="upg-basis-sub">3 Minuten auf der Hauptb&uuml;hne. Dein Startschuss.</p>
        <ul className="upg-basis-features">
          <li><span className="upg-dot" />3 Min Pitch auf der Hauptb&uuml;hne</li>
          <li><span className="upg-dot" />Dein Stehtisch im Networking-Bereich</li>
          <li><span className="upg-dot" />Rollup-Pr&auml;senz im Foyer</li>
          <li><span className="upg-dot" />Teilnahme an Barcamp-Sessions</li>
          <li><span className="upg-dot" />Professionelle Aufzeichnung deiner B&uuml;hnenpr&auml;senz</li>
        </ul>
      </div>

      <div className="upg-divider" />

      <SectionLabel>MEHR ZEIT AUF DER B&Uuml;HNE</SectionLabel>

      <UpgradeRow
        active={upgrades.keynote15}
        onClick={() => toggle('keynote15')}
        trigger="Raus aus der Masse. Rein in die K&ouml;pfe."
        name="+15 Minuten Keynote"
        desc="15 Minuten auf der Hauptb&uuml;hne. Genug Zeit, um nicht nur zu pitchen — sondern zu &uuml;berzeugen."
        price={`${fmtPrice(PRICES.keynote15)} \u20AC`}
      />

      <UpgradeRow
        active={upgrades.keynote25}
        onClick={() => toggle('keynote25')}
        trigger="Deine B&uuml;hne. Deine Geschichte. Dein Moment."
        name="+25 Minuten Keynote"
        desc="25 Minuten geh&ouml;ren dir allein. Story, Tiefe, Wirkung — das volle Programm."
        price={`${fmtPrice(PRICES.keynote25)} \u20AC`}
      />

      <UpgradeRow
        active={upgrades.barcamp_room}
        onClick={() => toggle('barcamp_room')}
        trigger="Dein eigener Raum. Dein Publikum."
        name="Barcamp-Room &middot; 30 Min"
        desc="Ein Raum, eine halbe Stunde, volle Aufmerksamkeit. Workshop, Pr&auml;sentation oder Q&amp;A — du entscheidest."
        price={`${fmtPrice(PRICES.barcamp_room)} \u20AC`}
      />

      <SectionLabel>MAXIMALE SICHTBARKEIT</SectionLabel>

      <UpgradeRow
        active={upgrades.stage7}
        gold
        onClick={() => toggle('stage7')}
        trigger="Einmal auftreten. Sieben Mal wirken."
        name="The 7 Stage &middot; Signature Experience"
        desc="7 Minuten Interview, 7 Minuten B&uuml;hnenslot, 7 professionelle Fotos, 7 Short-Clips f&uuml;r Social Media, dein Keynote-Highlight-Video, 7 Vorab-Impulse zu Storytelling, Wirkung und Performance, Keynote-Workbook zur professionellen Entwicklung deiner Rede sowie individuelles Profi-Feedback im Zoom-Call oder per Audio."
        price={`${fmtPrice(PRICES.stage7)} \u20AC`}
        priceSub="zzgl. Basis"
        tags={['7 Fotos', '7 Clips', 'Video', 'Workbook']}
        bigName
      />

      <SectionLabel>PROFESSIONELLES SHOOTING</SectionLabel>

      <UpgradeRow
        active={upgrades.shooting}
        onClick={() => toggle('shooting')}
        trigger="Dein Auftritt. Perfekt in Szene gesetzt."
        name="Professionelles Foto- &amp; Videoshooting"
        desc="Professionelles Fotoshooting und Videoshooting von der B&uuml;hne oder zus&auml;tzlich neben der B&uuml;hne. Dein Auftritt in Profi-Qualit&auml;t."
        price={`${fmtPrice(PRICES.shooting)} \u20AC`}
      />

      <SectionLabel>TRAINING &amp; COACHING</SectionLabel>

      <UpgradeRow
        active={upgrades.workshop}
        onClick={() => toggle('workshop')}
        trigger="Verankere dich im Kopf deiner Zuh&ouml;rer."
        name="Performance Workshop &middot; 3h Zoom"
        desc="Intensiver Gruppen-Call: Pitch sch&auml;rfen, Wirkung trainieren, Lampenfieber besiegen. 3 Stunden, die sich auf der B&uuml;hne auszahlen."
        price={`${fmtPrice(PRICES.workshop)} \u20AC`}
      />

      <UpgradeRow
        active={upgrades.coaching}
        onClick={() => toggle('coaching')}
        trigger="Dein T&uuml;r&ouml;ffner zu Kunden, die bleiben."
        name="1:1 Coaching &middot; 3h pers&ouml;nlich"
        desc="3 Stunden. Dein Thema im Fokus – f&uuml;r Keynote oder Elevator Pitch. Mit Wirkung, die sich im Kopf verankert."
        price={`${fmtPrice(PRICES.coaching)} \u20AC`}
      />

      <div className="upg-after-event">
        <button
          type="button"
          className={`upg-after-header${afterEventOpen ? ' upg-after-header--open' : ''}`}
          onClick={() => setAfterEventOpen(!afterEventOpen)}
        >
          <span>NACH DEM EVENT — WACHSTUM &amp; WEITERBILDUNG</span>
          <ChevronDown size={16} className={`upg-after-chevron${afterEventOpen ? ' upg-after-chevron--open' : ''}`} />
        </button>
        <div className={`upg-after-body${afterEventOpen ? ' upg-after-body--open' : ''}`}>
          <p className="upg-after-intro">Nach dem Event ist vor dem Durchbruch. Diese Angebote kannst du auch sp&auml;ter noch dazubuchen — kein Zeitdruck.</p>
          <ul className="upg-after-list">
            <li><ArrowRight size={14} />Live-Workshops &amp; Trainings</li>
            <li><ArrowRight size={14} />Online-Kurse &amp; Workbooks</li>
            <li><ArrowRight size={14} />Buchprojekt &amp; Business Book</li>
            <li><ArrowRight size={14} />Fotoshooting (auch nach dem Event buchbar)</li>
            <li><ArrowRight size={14} />Community-Membership auf Skool</li>
          </ul>
          <p className="upg-after-note">Details und Preise erh&auml;ltst du nach dem Event per E-Mail.</p>
        </div>
      </div>

      <div className="upg-divider" />

      <div className="upg-coupon">
        <div className="upg-coupon-label">
          <Tag size={14} />
          <span>Dein Gutscheincode</span>
        </div>
        <div className="upg-coupon-row">
          <input
            type="text"
            className={`upg-coupon-input${couponStatus === 'valid' ? ' upg-coupon-input--valid' : ''}${couponStatus === 'invalid' ? ' upg-coupon-input--invalid' : ''}`}
            placeholder="Code eingeben"
            value={couponCode}
            onChange={(e) => onCouponCodeChange(e.target.value)}
            onKeyDown={handleCouponKeyDown}
            disabled={couponStatus === 'valid' || couponStatus === 'loading'}
          />
          {couponStatus === 'valid' ? (
            <button type="button" className="upg-coupon-btn upg-coupon-btn--remove" onClick={onRemoveCoupon}>
              <X size={14} />
            </button>
          ) : (
            <button
              type="button"
              className="upg-coupon-btn"
              onClick={onApplyCoupon}
              disabled={!couponCode.trim() || couponStatus === 'loading'}
            >
              {couponStatus === 'loading' ? <Loader2 size={14} className="upg-coupon-spin" /> : 'Einl\u00F6sen'}
            </button>
          )}
        </div>
        {couponStatus === 'valid' && (
          <div className="upg-coupon-msg upg-coupon-msg--valid">
            <Check size={13} />
            <span>{couponMessage} &mdash; {fmtPrice(effectiveDiscount)} &euro; Rabatt</span>
          </div>
        )}
        {couponStatus === 'invalid' && (
          <div className="upg-coupon-msg upg-coupon-msg--invalid">
            <X size={13} />
            <span>{couponMessage}</span>
          </div>
        )}
      </div>

      <div className="upg-summary">
        {lineItems.map((item, i) => (
          <div key={i} className={`upg-summary-line${item.isDiscount ? ' upg-summary-line--discount' : ''}`}>
            <span>{item.label}</span>
            <span className="upg-summary-dots" />
            <span>{item.value}</span>
          </div>
        ))}

        <div className="upg-summary-sep" />
        <div className="upg-summary-line">
          <span>Netto</span>
          <span className="upg-summary-dots" />
          <span>{fmtPrice(finalNetto)} &euro;</span>
        </div>
        <div className="upg-summary-line">
          <span>zzgl. 19% MwSt.</span>
          <span className="upg-summary-dots" />
          <span>{fmtPrice(mwst)} &euro;</span>
        </div>
        <div className="upg-summary-line upg-summary-line--bold">
          <span>Gesamt brutto</span>
          <span className="upg-summary-dots" />
          <span>{fmtPrice(brutto)} &euro;</span>
        </div>
      </div>

      <div className="upg-grand-total">
        <span className="upg-grand-price">{fmtPrice(finalNetto)} &euro; netto</span>
        <span className="upg-grand-hint">
          {couponStatus === 'valid' && effectiveDiscount > 0
            ? `Inkl. ${fmtPrice(effectiveDiscount)} \u20AC Gutschein-Rabatt \u00B7 Alle Preise netto zzgl. 19% MwSt.`
            : hasUpgrades
              ? 'Alle Preise netto zzgl. 19% MwSt.'
              : 'Basis-Paket \u00B7 Alle Preise netto zzgl. 19% MwSt.'
          }
        </span>
      </div>
    </div>
  );
}
