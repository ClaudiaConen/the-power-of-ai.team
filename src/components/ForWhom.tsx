export default function ForWhom() {
  return (
    <section
      className="ev-banner"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="ev-bg"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      >
        <img
          src="/imgi_10_background_(1).jpg"
          alt="Atmosphaerisches Hintergrundbild — The Power of AI"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background:
            'linear-gradient(180deg, rgba(10,22,40,.7) 0%, rgba(10,22,40,.55) 40%, rgba(10,22,40,.6) 70%, rgba(10,22,40,.85) 100%)',
        }}
      />

      <div
        className="ev-inner"
        style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: 'var(--max)',
          margin: '0 auto',
          width: '100%',
          padding: '80px 60px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '56px',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '3.5px',
              textTransform: 'uppercase' as const,
              color: '#40e0d0',
              marginBottom: '24px',
              border: '1px solid rgba(64, 224, 208, .25)',
              padding: '8px 20px',
              background: 'rgba(64, 224, 208, .06)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#40e0d0',
                boxShadow: '0 0 8px #40e0d0',
                animation: 'pdot 2.2s infinite',
              }}
            />
            Eventreihe 2026
          </div>

          <h2
            style={{
              fontFamily: 'var(--ffd)',
              fontSize: 'clamp(28px, 4.5vw, 52px)',
              fontWeight: 900,
              lineHeight: 0.98,
              letterSpacing: '-1.5px',
              color: '#fff',
              marginBottom: '24px',
              textShadow: '0 0 60px rgba(64, 224, 208, .12)',
            }}
          >
            KI Treffen in deiner{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--g5)' }}>Nähe</em>{' '}
            besuchen.
          </h2>

          <p
            style={{
              fontFamily: 'var(--ffs)',
              fontSize: 'clamp(18px, 2vw, 24px)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'rgba(255,255,255,.8)',
              lineHeight: 1.7,
              marginBottom: '18px',
              maxWidth: '460px',
            }}
          >
            Köln ist Herzensstadt von Claudia Conen.
          </p>

          <p
            style={{
              fontSize: '18px',
              fontWeight: 400,
              color: 'rgba(255,255,255,.72)',
              lineHeight: 1.75,
              maxWidth: '480px',
              marginBottom: '14px',
            }}
          >
            Und genau hier startet bald auch unsere Eventreihe im Barcamp-Stil.
          </p>

          <p
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: 'rgba(255,255,255,.85)',
              lineHeight: 1.75,
              maxWidth: '480px',
              marginBottom: '40px',
            }}
          >
            Kein festes Programm. Keine Frontalvorträge.
          </p>

          <a
            href="https://the-power-of.ai/de/ki-treffen/2026-05-03-koeln-ai-connect-koeln"
            target="_blank"
            rel="noopener noreferrer"
            className="ev-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #e040a0, #40e0d0)',
              color: '#fff',
              fontFamily: 'var(--ffb)',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase' as const,
              padding: '15px 36px',
              textDecoration: 'none',
              transition: 'all .3s var(--ease)',
            }}
          >
            GRATIS Ticket für das Event sichern
            <span style={{ fontSize: '14px', transition: 'transform .2s var(--ease)' }}>&#8594;</span>
          </a>
        </div>

        <div
          className="ev-flyer"
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow:
              '0 8px 40px rgba(0,0,0,.35), 0 0 80px rgba(64, 224, 208, .08)',
            border: '1px solid rgba(255,255,255,.1)',
            transition: 'transform .5s var(--ease), box-shadow .5s var(--ease)',
          }}
        >
          <img
            src="/WhatsApp_Image_2026-04-09_at_17.26.30_(1).jpeg"
            alt="AI Connect - 03.05.2026 Motorworld Koeln"
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      </div>
    </section>
  );
}
