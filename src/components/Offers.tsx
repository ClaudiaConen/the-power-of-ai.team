import OfferCardBook from './OfferCardBook';
import OfferCard2 from './OfferCard2';
import OfferCard3 from './OfferCard3';

export default function Offers() {
  return (
    <section className="sec" id="angebote">
      <div className="w">
        <div className="lbl rv">
          Drei Wege zur Unverwechselbarkeit ·{' '}
          <span style={{ color: 'var(--pk)' }}>alle mit KI als Abkürzung</span>
        </div>
        <h2 className="sh2 rv d1">
          Wo stehst du —
          <br />
          <em>was brauchst du jetzt?</em>
        </h2>
        <p className="slead rv d2"></p>
        <div className="ocols rv d3">
          <OfferCardBook />
          <OfferCard2 />
          <OfferCard3 />
        </div>
      </div>
    </section>
  );
}
