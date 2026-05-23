import { useEffect, useState } from 'react';
import { ArrowRight, Star, BookOpen, Users, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

const COVER_SRC = '/ThePowerofAIBuch.png';

export default function BookProject() {
  const [reserved, setReserved] = useState(26);
  const [total, setTotal] = useState(77);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('book_project_status')
        .select('reserved_count, total_slots')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled && data) {
        setReserved(data.reserved_count);
        setTotal(data.total_slots);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const pct = Math.min(100, Math.round((reserved / total) * 100));

  return (
    <section
      id="buchprojekt"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 20% 10%, rgba(224,64,160,.08) 0%, transparent 55%), radial-gradient(ellipse at 85% 85%, rgba(64,224,208,.07) 0%, transparent 55%), #0a1628',
        padding: '110px 0 120px',
        borderTop: '1px solid rgba(255,255,255,.06)',
        borderBottom: '1px solid rgba(255,255,255,.06)',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,22,40,.0) 0%, rgba(10,22,40,.35) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="bp-inner"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 'var(--max)',
          margin: '0 auto',
          width: '100%',
          padding: '0 60px',
          display: 'grid',
          gridTemplateColumns: '1.05fr .95fr',
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
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#f094d0',
              marginBottom: '28px',
              border: '1px solid rgba(224, 64, 160, .35)',
              padding: '8px 18px',
              borderRadius: '999px',
              background: 'rgba(224, 64, 160, .08)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Sparkles size={14} strokeWidth={2.2} />
            Unkopierbar im KI-Zeitalter
          </div>

          <h2
            style={{
              fontFamily: 'var(--ffd)',
              fontSize: 'clamp(34px, 5.2vw, 64px)',
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: '-1.8px',
              color: '#fff',
              marginBottom: '20px',
            }}
          >
            Schreib dich ins{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #e040a0 0%, #40e0d0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontStyle: 'italic',
              }}
            >
              Gedächtnis
            </span>
            <span style={{ color: '#fff' }}>.</span>
          </h2>

          <p
            style={{
              fontFamily: 'var(--ffd)',
              fontSize: 'clamp(18px, 2vw, 24px)',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '10px',
            }}
          >
            77 Mittelstand-Unternehmer.
          </p>

          <p
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'rgba(255,255,255,.55)',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}
          >
            Premiere · The Power of AI · 2026
          </p>

          <p
            style={{
              fontSize: '17px',
              color: 'rgba(255,255,255,.78)',
              lineHeight: 1.7,
              marginBottom: '36px',
              maxWidth: '520px',
            }}
          >
            Ein <strong style={{ color: '#fff' }}>Handbuch des Mittelstands</strong>: 77 Persönlichkeiten zeigen, wie
            sich Unternehmen, Selbstständigkeit und Unternehmertum im KI-Zeitalter verändern.{' '}
            <strong style={{ color: '#fff' }}>Im Zeitalter der KI-Perfektion wird Persönlichkeit unbezahlbar.</strong>
          </p>

          <a
            href="https://claudiaconen.com/buchprojekt"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Weitere Infos zum Buchprojekt auf claudiaconen.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 30px',
              background: 'linear-gradient(135deg, #e040a0 0%, #40e0d0 100%)',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '.3px',
              textDecoration: 'none',
              borderRadius: '999px',
              boxShadow: '0 12px 32px rgba(224, 64, 160, .35)',
              transition: 'transform .25s var(--ease), box-shadow .25s var(--ease)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(224, 64, 160, .5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(224, 64, 160, .35)';
            }}
          >
            Weitere Infos zum Buchprojekt
            <ArrowRight size={18} strokeWidth={2.4} />
          </a>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '26px',
              marginTop: '36px',
              fontSize: '14px',
              color: 'rgba(255,255,255,.75)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Star size={16} color="#f4d03f" fill="#f4d03f" strokeWidth={1.5} />
              Premiere-Edition
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} color="#40e0d0" strokeWidth={2} />
              Hardcover-Qualität
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="#f094d0" strokeWidth={2} />
              Limitiert auf 77
            </span>
          </div>
        </div>

        <div
          className="bp-book-stage"
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '520px',
            perspective: '1800px',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              bottom: '40px',
              width: '70%',
              height: '40px',
              background: 'radial-gradient(ellipse, rgba(0,0,0,.55) 0%, transparent 70%)',
              filter: 'blur(14px)',
              zIndex: 1,
            }}
          />

          <div className="bp-book">
            <img
              src={COVER_SRC}
              alt="Buchcover: The Power of AI — Unverwechselbar. Wie KI unseren Mittelstand verändert."
              className="bp-book-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div
        className="bp-status"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 'var(--max)',
          margin: '72px auto 0',
          padding: '0 60px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,.04), rgba(255,255,255,.02))',
            border: '1px solid rgba(255,255,255,.1)',
            borderRadius: '20px',
            padding: '28px 32px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '14px',
              marginBottom: '16px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: '#40e0d0',
                  marginBottom: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#40e0d0',
                    boxShadow: '0 0 10px #40e0d0',
                    animation: 'pdot 2.2s infinite',
                  }}
                />
                Live · Aktueller Stand
              </div>
              <div
                style={{
                  fontFamily: 'var(--ffd)',
                  fontSize: 'clamp(24px, 3vw, 32px)',
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1.1,
                }}
              >
                <span style={{ color: '#e040a0' }}>{reserved}</span>
                <span style={{ color: 'rgba(255,255,255,.55)' }}> / {total}</span>{' '}
                <span style={{ fontSize: '.72em', fontWeight: 700 }}>Premiere-Plätze</span>
              </div>
            </div>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,.65)',
                maxWidth: '380px',
                lineHeight: 1.55,
              }}
            >
              Bis Ende 2026 wird produziert. Premiere-Edition — einmalige Ausgabe.
            </p>
          </div>

          <div
            style={{
              position: 'relative',
              height: '10px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #e040a0 0%, #40e0d0 100%)',
                borderRadius: '999px',
                transition: 'width .8s var(--ease)',
                boxShadow: '0 0 18px rgba(224,64,160,.35)',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
              fontSize: '12px',
              color: 'rgba(255,255,255,.6)',
              letterSpacing: '.5px',
            }}
          >
            <span>Reserviert</span>
            <span style={{ color: '#40e0d0', fontWeight: 700 }}>{pct}%</span>
          </div>
        </div>
      </div>

      <style>{`
        .bp-book {
          position: relative;
          width: clamp(260px, 28vw, 380px);
          transform-style: preserve-3d;
          animation: bpBookSpin 7.5s ease-in-out infinite alternate;
          transition: transform .6s var(--ease);
          filter: drop-shadow(0 34px 56px rgba(0,0,0,.6));
          will-change: transform;
        }
        .bp-book-cover {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
        }
        .bp-book:hover {
          animation-play-state: paused;
          transform: rotateY(4deg) rotateX(1deg) scale(1.03);
        }
        @keyframes bpBookSpin {
          0%   { transform: rotateY(-6deg) rotateX(3deg) translateY(0); }
          50%  { transform: rotateY(2deg)  rotateX(1deg) translateY(-8px); }
          100% { transform: rotateY(8deg)  rotateX(2deg) translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bp-book { animation: none; transform: rotateY(0deg); }
        }
        @media (max-width: 900px) {
          .bp-inner {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
            padding: 0 24px !important;
          }
          .bp-book-stage {
            order: -1;
            min-height: 380px !important;
          }
          .bp-status {
            padding: 0 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
