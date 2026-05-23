import { useState, useEffect } from 'react';
import { KeyRound, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';

export default function AdminPasswordReset() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(true);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (password.length < 10) {
      showToast('error', 'Passwort muss mindestens 10 Zeichen haben.');
      return;
    }
    if (password !== confirm) {
      showToast('error', 'Die Passwörter stimmen nicht überein.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      showToast('success', 'Passwort aktualisiert.');
      setTimeout(() => {
        window.location.hash = '#admin-dashboard';
      }, 1400);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
      showToast('error', `Fehler: ${msg}`);
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
      </nav>

      <div className="sf-login-wrap">
        <div className="sf-card sf-login-card">
          <p className="sf-eyebrow">THE POWER OF AI</p>
          <h1 className="sf-title" style={{ fontSize: 22 }}>Neues Passwort setzen</h1>
          <p className="sf-subtitle">
            {ready
              ? 'Wähle ein sicheres Passwort mit mindestens 10 Zeichen.'
              : 'Link wird verarbeitet...'}
          </p>

          {done ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <CheckCircle size={40} color="#16a34a" />
              <p style={{ marginTop: 12, color: '#065f46', fontWeight: 600 }}>
                Passwort erfolgreich aktualisiert.
              </p>
            </div>
          ) : ready ? (
            <form onSubmit={submit} className="sf-login-form">
              <div className="sf-field">
                <label className="sf-label">Neues Passwort</label>
                <input
                  className="sf-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={10}
                  required
                />
              </div>
              <div className="sf-field">
                <label className="sf-label">Passwort bestätigen</label>
                <input
                  className="sf-input"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  minLength={10}
                  required
                />
              </div>
              <button type="submit" className="sf-submit-btn" disabled={loading} style={{ marginTop: 8 }}>
                <span className="sf-submit-btn-glow" />
                <KeyRound size={16} />
                {loading ? 'Speichere...' : 'Passwort speichern'}
              </button>
            </form>
          ) : (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '16px 0' }}>
              Warte auf gültige Reset-Sitzung...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
