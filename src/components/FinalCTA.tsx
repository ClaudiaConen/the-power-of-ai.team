import { ArrowDown } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section
      id="anfragen"
      style={{
        position: 'relative',
        padding: 'clamp(60px, 10vw, 120px) clamp(24px, 5vw, 60px)',
        background:
          'linear-gradient(170deg, var(--bg3) 0%, var(--bg) 45%, var(--bg2) 100%)',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,.10) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(212,175,55,.06) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 10%, var(--g1) 30%, var(--g3) 50%, var(--g1) 70%, transparent 90%)',
        }}
      />

      <div
        className="w"
        style={{ maxWidth: '740px', position: 'relative', zIndex: 2 }}
      >
        <div
          className="rv"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: 'var(--g1)',
            marginBottom: '28px',
            border: '1px solid rgba(184,134,11,.35)',
            padding: '8px 20px',
            background: 'rgba(212,175,55,.08)',
            borderRadius: '999px',
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'var(--g1)',
              boxShadow: '0 0 8px var(--g3)',
              animation: 'pdot 2.2s infinite',
            }}
          />
          Drei Wege &middot; Deine Wahl
        </div>

        <h2
          className="rv d1"
          style={{
            fontFamily: 'var(--ffd)',
            fontSize: 'clamp(32px, 5vw, 58px)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-1.5px',
            color: 'var(--n)',
            marginBottom: '24px',
          }}
        >
          Scanne. Wähle.{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--g1)' }}>Werde.</em>
        </h2>

        <p
          className="rv d2"
          style={{
            fontFamily: 'var(--ffs)',
            fontSize: 'clamp(18px, 2vw, 24px)',
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'var(--mid)',
            lineHeight: 1.6,
            marginBottom: '40px',
            maxWidth: '560px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          KI macht Perfektion klickbar.
          <br />
          Du machst dich unverwechselbar.
        </p>

        <div
          className="rv d3"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(12px, 3vw, 32px)',
            marginBottom: '44px',
            flexWrap: 'wrap',
          }}
        >
          {['Unverwechselbar', 'Gewinnbringend', 'Unvergesslich'].map(
            (word, i) => (
              <div
                key={word}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(12px, 3vw, 32px)',
                }}
              >
                {i > 0 && (
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: 'var(--g3)',
                      flexShrink: 0,
                    }}
                  />
                )}
                <span
                  style={{
                    fontFamily: 'var(--ffd)',
                    fontSize: 'clamp(14px, 1.5vw, 17px)',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'var(--n2)',
                  }}
                >
                  {word}
                </span>
              </div>
            )
          )}
        </div>

        <div
          className="rv d4"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="#angebote"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, var(--g1), var(--g3))',
              color: 'var(--n)',
              fontFamily: 'var(--ffb)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              padding: '16px 40px',
              textDecoration: 'none',
              transition: 'all .3s var(--ease)',
              boxShadow: '0 6px 20px rgba(212,175,55,.25)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 10px 28px rgba(212,175,55,.4)';
              el.style.background =
                'linear-gradient(135deg, var(--g3), var(--g6))';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.transform = 'none';
              el.style.boxShadow = '0 6px 20px rgba(212,175,55,.25)';
              el.style.background =
                'linear-gradient(135deg, var(--g1), var(--g3))';
            }}
          >
            Angebote entdecken
            <ArrowDown size={14} />
          </a>
          <a
            href="#kontakt"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--n2)',
              textDecoration: 'none',
              transition: 'color .2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--g1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--n2)';
            }}
          >
            Persönlich anfragen{' '}
            <span style={{ transition: 'transform .2s' }}>→</span>
          </a>
        </div>
      </div>

      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 10%, rgba(10,22,40,.08) 50%, transparent 90%)',
        }}
      />
    </section>
  );
}
