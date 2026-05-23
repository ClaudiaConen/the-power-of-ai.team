export default function PD3Final({ checkoutUrl }: { checkoutUrl: string }) {
  return (
    <section className="pd3-final">
      <div className="pd-w" style={{ textAlign: 'center', maxWidth: '680px' }}>
        <div className="qline"></div>
        <h2 className="pd3-final-h2">
          Ich bin an deiner Seite.
        </h2>
        <p className="pd3-final-sub">
          90 Tage. Jeden Tag. Direkt in deinem Ohr.
        </p>
        <p className="pd3-final-quote">
          Selbstvertrauen schafft Vertrauen. Und Vertrauen ist die Währung, die die KI niemals drucken kann.
        </p>
        <a
          href={checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pd3-final-btn"
        >
          Ja, ich sichere mir meinen Platz am 13. Juni.
        </a>
        <div className="pd3-final-sign">
          <p className="pd3-final-italic">
            Damit du nicht perfekt wirst — sondern unverwechselbar.
          </p>
          <p className="pd3-final-italic">
            Damit du nicht auffällst — sondern im Gedächtnis bleibst.
          </p>
          <p className="pd3-final-born">
            Einzigartig bist du schon. Du wurdest so geboren.
          </p>
          <p className="pd3-final-name">— Claudia Conen</p>
        </div>
      </div>
    </section>
  );
}
