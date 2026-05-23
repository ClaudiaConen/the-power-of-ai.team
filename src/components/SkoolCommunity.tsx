import { Users, MapPin, Calendar, Sparkles, ExternalLink } from 'lucide-react';

const SKOOL_URL = 'https://www.skool.com/the-power-of-ai';

const features = [
  { icon: Users, label: 'KI-Anwender & Experten' },
  { icon: Sparkles, label: 'Austausch auf Augenhöhe' },
  { icon: Calendar, label: 'Regelmäßige Live-Meetups' },
  { icon: MapPin, label: 'Begegnungen in deiner Nähe' },
];

export default function SkoolCommunity() {
  return (
    <section
      id="community"
      style={{
        position: 'relative',
        padding: 'clamp(70px, 9vw, 120px) clamp(24px, 5vw, 60px)',
        background:
          'linear-gradient(165deg, var(--bg3) 0%, var(--bg) 45%, var(--bg2) 100%)',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 12% 15%, rgba(224,64,160,.10) 0%, transparent 55%), radial-gradient(ellipse at 88% 85%, rgba(64,224,208,.10) 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, rgba(212,175,55,.06) 0%, transparent 65%)',
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
          height: '2px',
          background:
            'linear-gradient(90deg, transparent 8%, var(--pk) 25%, var(--pk-cyan) 50%, var(--pk) 75%, transparent 92%)',
          opacity: 0.7,
        }}
      />

      <div
        className="w"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(32px, 5vw, 72px)',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            className="rv"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '3.5px',
              textTransform: 'uppercase',
              color: '#fff',
              marginBottom: '24px',
              padding: '8px 18px',
              background: 'var(--brand-grad)',
              borderRadius: '999px',
              boxShadow: '0 6px 20px var(--brand-shadow)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 0 10px rgba(255,255,255,.8)',
                animation: 'pdot 2.2s infinite',
              }}
            />
            Community auf Skool · Kostenlos
          </div>

          <h2
            className="rv d1"
            style={{
              fontFamily: 'var(--ffd)',
              fontSize: 'clamp(30px, 4.6vw, 54px)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-1.2px',
              color: 'var(--n)',
              marginBottom: '22px',
            }}
          >
            Triff echte KI-Anwender —{' '}
            <em
              style={{
                fontStyle: 'italic',
                background: 'var(--brand-grad)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              live &amp; persönlich.
            </em>
          </h2>

          <p
            className="rv d2"
            style={{
              fontFamily: 'var(--ffs)',
              fontSize: 'clamp(17px, 1.7vw, 20px)',
              lineHeight: 1.65,
              color: 'var(--mid)',
              marginBottom: '28px',
              maxWidth: '560px',
              fontStyle: 'italic',
            }}
          >
            Hier triffst du auf KI-Anwender und Experten — zum Austausch, zum
            Netzwerken und für echte Begegnungen bei regelmäßigen
            Live-Meetups in deiner Nähe.
          </p>

          <ul
            className="rv d3"
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 36px 0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
              maxWidth: '560px',
            }}
          >
            {features.map(({ icon: Icon, label }) => (
              <li
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--n2)',
                }}
              >
                <span
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    display: 'grid',
                    placeItems: 'center',
                    background: 'var(--brand-grad)',
                    color: '#fff',
                    flexShrink: 0,
                    boxShadow: '0 4px 14px var(--brand-shadow)',
                  }}
                >
                  <Icon size={16} strokeWidth={2.25} />
                </span>
                <span>{label}</span>
              </li>
            ))}
          </ul>

          <div
            className="rv d4"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              flexWrap: 'wrap',
            }}
          >
            <a
              href={SKOOL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--brand-grad)',
                color: '#fff',
                fontFamily: 'var(--ffb)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                padding: '16px 34px',
                textDecoration: 'none',
                transition: 'all .3s var(--ease)',
                minHeight: '48px',
                boxSizing: 'border-box',
                boxShadow: '0 8px 24px var(--brand-shadow)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = '0 14px 32px var(--brand-shadow-strong)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'none';
                el.style.boxShadow = '0 8px 24px var(--brand-shadow)';
              }}
            >
              Zur Skool-Community
              <ExternalLink size={14} />
            </a>
            <span
              style={{
                fontSize: '13px',
                color: 'var(--lt)',
                fontStyle: 'italic',
              }}
            >
              Kostenlos beitreten · keine Kreditkarte
            </span>
          </div>
        </div>

        <div className="rv d2" style={{ position: 'relative' }}>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: '-2px',
              borderRadius: '22px',
              background: 'var(--brand-grad)',
              opacity: 0.6,
              filter: 'blur(14px)',
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              padding: 'clamp(28px, 4vw, 40px)',
              borderRadius: '20px',
              background:
                'linear-gradient(165deg, #ffffff 0%, var(--bg3) 100%)',
              border: '1px solid rgba(224,64,160,.18)',
              boxShadow:
                '0 30px 60px rgba(10,22,40,.12), 0 8px 24px var(--brand-shadow)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '22px',
              }}
            >
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '16px',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: 'var(--ffd)',
                  fontWeight: 900,
                  fontSize: '34px',
                  color: '#fff',
                  background: 'var(--brand-grad)',
                  boxShadow: '0 12px 30px var(--brand-shadow-strong)',
                  flexShrink: 0,
                }}
              >
                S
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: 'var(--pk)',
                    marginBottom: '4px',
                  }}
                >
                  Skool Community
                </div>
                <div
                  style={{
                    fontFamily: 'var(--ffd)',
                    fontSize: 'clamp(20px, 2.4vw, 26px)',
                    fontWeight: 800,
                    color: 'var(--n)',
                    lineHeight: 1.15,
                  }}
                >
                  The Power of AI
                </div>
              </div>
            </div>

            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.65,
                color: 'var(--mid)',
                margin: '0 0 24px 0',
              }}
            >
              Eine wachsende Community aus Speakern, Selbstständigen und
              Neugierigen, die KI im Alltag wirklich einsetzen — und sich bei
              Live-Meetups persönlich treffen.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 0',
                borderTop: '1px solid rgba(10,22,40,.08)',
                borderBottom: '1px solid rgba(10,22,40,.08)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex' }}>
                {[
                  'linear-gradient(135deg, #e040a0, #f094d0)',
                  'linear-gradient(135deg, #40e0d0, #7be4d9)',
                  'linear-gradient(135deg, #D4AF37, #F4D03F)',
                  'linear-gradient(135deg, #e86ab8, #40e0d0)',
                ].map((bg, i) => (
                  <div
                    key={i}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: bg,
                      border: '2px solid #fff',
                      marginLeft: i === 0 ? 0 : '-10px',
                      boxShadow: '0 3px 8px rgba(10,22,40,.12)',
                    }}
                  />
                ))}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--mid)' }}>
                <strong style={{ color: 'var(--n)', fontWeight: 700 }}>
                  Netzwerk
                </strong>{' '}
                aus Unternehmern, Speakern &amp; KI-Fans
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {['Austausch', 'Networking', 'Live-Meetups', 'Praxis'].map(
                (tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      padding: '6px 12px',
                      borderRadius: '999px',
                      color: 'var(--pk)',
                      background: 'rgba(224,64,160,.08)',
                      border: '1px solid rgba(224,64,160,.22)',
                    }}
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
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
