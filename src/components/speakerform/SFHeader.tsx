export default function SFHeader() {
  return (
    <header className="sf-header">
      <div className="sf-header-hero">
        <img
          src="/ThePowerOFAIHeader_3_copy2.png"
          alt="The Power of AI"
          className="sf-header-hero-img"
        />
        <div className="sf-header-hero-overlay" />
      </div>
      <div className="sf-header-content">
        <p className="sf-eyebrow">THE POWER OF AI</p>
        <h1 className="sf-title">Speaker-Anmeldung</h1>
        <p className="sf-subtitle">Trag dich ein.</p>
        <a
          href="https://free.the-power-of.ai/?event=6"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '24px',
            padding: '14px 32px',
            background: 'var(--pk)',
            color: '#fff',
            fontFamily: 'var(--ffd)',
            fontWeight: 700,
            fontSize: '15px',
            borderRadius: '60px',
            textDecoration: 'none',
            letterSpacing: '.3px',
            transition: 'transform .2s, box-shadow .2s',
            boxShadow: '0 4px 24px rgba(192,38,211,.35)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(192,38,211,.45)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(192,38,211,.35)'; }}
        >
          Gratis Ticket sichern
        </a>
      </div>
    </header>
  );
}
