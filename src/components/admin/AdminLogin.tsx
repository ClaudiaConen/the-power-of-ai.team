import { useState, useEffect } from 'react';
import { LogIn, KeyRound, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';

type Mode = 'login' | 'forgot';

export default function AdminLogin() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.from('admin_users').select('id').eq('id', session.user.id).maybeSingle().then(({ data }) => {
          if (data) window.location.hash = '#admin-dashboard';
        });
      }
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: admin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle();

      if (!admin) {
        await supabase.auth.signOut();
        showToast('error', 'Kein Admin-Zugang für dieses Konto.');
        setLoading(false);
        return;
      }

      window.location.hash = '#admin-dashboard';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
      showToast('error', `Login fehlgeschlagen: ${msg}`);
    }

    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/#admin-reset`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo });
      if (error) throw error;
      showToast('success', 'Falls die Adresse bekannt ist, wurde eine Reset-Mail versendet.');
      setMode('login');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
      showToast('error', `Reset fehlgeschlagen: ${msg}`);
    }
    setLoading(false);
  };

  return (
    <div className="sf-page">
      <div className="sf-blob sf-blob--pink" />
      <div className="sf-blob sf-blob--lila" />
      <div className="sf-blob sf-blob--blue" />

      <nav className="sf-nav">
        <a href="#" className="sf-nav-back" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}>
          <span className="sf-nav-brand">The Power of <em>AI</em></span>
        </a>
        <div className="sf-nav-links">
          <a href="#speaker-formular" className="sf-nav-pill">Speaker-Anmeldung</a>
          <a href="#admin" className="sf-nav-pill sf-nav-pill--active">Admin</a>
        </div>
      </nav>

      <div className="sf-login-wrap">
        <div className="sf-card sf-login-card">
          <p className="sf-eyebrow">THE POWER OF AI</p>
          <h1 className="sf-title" style={{ fontSize: 22 }}>
            {mode === 'login' ? 'Admin-Bereich' : 'Passwort zurücksetzen'}
          </h1>
          <p className="sf-subtitle">
            {mode === 'login'
              ? 'Zugang nur für autorisiertes Team.'
              : 'Gib deine Admin-E-Mail ein. Du erhältst einen Link zum Setzen eines neuen Passworts.'}
          </p>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="sf-login-form">
              <div className="sf-field">
                <label className="sf-label">E-Mail</label>
                <input className="sf-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="sf-field">
                <label className="sf-label">Passwort</label>
                <input className="sf-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="sf-submit-btn" disabled={loading} style={{ marginTop: 8 }}>
                <span className="sf-submit-btn-glow" />
                <LogIn size={16} />
                {loading ? 'Anmeldung...' : 'Einloggen'}
              </button>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                style={{
                  marginTop: 12,
                  background: 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  cursor: 'pointer',
                  fontSize: 13,
                  textDecoration: 'underline',
                  padding: 4,
                }}
              >
                Passwort vergessen?
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgot} className="sf-login-form">
              <div className="sf-field">
                <label className="sf-label">E-Mail</label>
                <input className="sf-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="sf-submit-btn" disabled={loading} style={{ marginTop: 8 }}>
                <span className="sf-submit-btn-glow" />
                <KeyRound size={16} />
                {loading ? 'Sende...' : 'Reset-Mail senden'}
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{
                  marginTop: 12,
                  background: 'transparent',
                  border: 'none',
                  color: '#475569',
                  cursor: 'pointer',
                  fontSize: 13,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: 4,
                }}
              >
                <ArrowLeft size={14} /> Zurück zum Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
