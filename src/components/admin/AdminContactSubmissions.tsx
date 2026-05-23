import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, Mail, Phone, RefreshCw, Search, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  product: string | null;
  message: string;
  created_at: string;
}

export default function AdminContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
  const mailHref = (email: string) =>
    `mailto:${email}?subject=${encodeURIComponent('Ihre Anfrage bei The Power of AI')}`;

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    setDeletingId(null);
    if (error) {
      console.error('[AdminContactSubmissions] delete failed', error);
      showToast('error', 'Loeschen fehlgeschlagen. Bitte erneut versuchen.');
      return;
    }
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    setConfirmDeleteId(null);
    if (expandedId === id) setExpandedId(null);
    showToast('success', 'Anfrage geloescht.');
  };

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoadError('Session abgelaufen. Bitte melde dich erneut an.');
      setSubmissions([]);
      setLoading(false);
      showToast('error', 'Session abgelaufen – bitte erneut einloggen.');
      setTimeout(() => { window.location.hash = '#admin'; }, 1200);
      return;
    }

    const { data, error } = await supabase
      .from('contact_submissions')
      .select('id, name, email, phone, product, message, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[AdminContactSubmissions] load failed', error);
      setLoadError(error.message || 'Unbekannter Fehler beim Laden.');
      showToast('error', 'Anfragen konnten nicht geladen werden.');
    } else {
      setSubmissions((data as ContactSubmission[]) || []);
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!search) return submissions;
    const q = search.toLowerCase();
    return submissions.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.product || '').toLowerCase().includes(q) ||
      (s.phone || '').toLowerCase().includes(q) ||
      s.message.toLowerCase().includes(q)
    );
  }, [submissions, search]);

  const exportCSV = () => {
    if (!submissions.length) return;
    const BOM = '\uFEFF';
    const headers = ['Datum', 'Name', 'E-Mail', 'Telefon', 'Produkt', 'Nachricht'];
    const rows = submissions.map((s) => [
      new Date(s.created_at).toLocaleString('de-DE'),
      s.name,
      s.email,
      s.phone || '',
      s.product || '',
      s.message,
    ].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';'));
    const csv = BOM + headers.join(';') + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kontaktanfragen-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="sf-card" style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--sf-txt1)' }}>
            Kontaktanfragen
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--sf-txt3)' }}>
            Live aus der Datenbank. {submissions.length} Eintr{submissions.length === 1 ? 'ag' : 'äge'} gesamt.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="ad-btn ad-btn--ghost" onClick={load} disabled={loading}>
            <RefreshCw size={14} /> Aktualisieren
          </button>
          <button className="ad-btn ad-btn--ghost" onClick={exportCSV} disabled={!submissions.length}>
            <Download size={14} /> CSV Export
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--sf-txt3)' }} />
        <input
          type="text"
          placeholder="Suche in Name, E-Mail, Produkt, Nachricht..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px 10px 34px',
            borderRadius: 8,
            border: '1px solid rgba(0,0,0,0.1)',
            fontSize: 13,
            background: '#fff',
          }}
        />
      </div>

      {loading ? (
        <div className="ad-empty"><p>Lade Anfragen...</p></div>
      ) : loadError ? (
        <div className="ad-empty" style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.25)' }}>
          <p style={{ color: '#b91c1c', fontWeight: 600, margin: 0 }}>Anfragen konnten nicht geladen werden.</p>
          <p style={{ fontSize: 12, color: 'var(--sf-txt3)', margin: '6px 0 0' }}>
            {loadError}
          </p>
          <button className="ad-btn ad-btn--ghost" onClick={load} style={{ marginTop: 10 }}>
            <RefreshCw size={14} /> Erneut versuchen
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="ad-empty">
          <p>{submissions.length === 0 ? 'Noch keine Anfragen eingegangen.' : 'Keine Treffer für diese Suche.'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((s) => {
            const open = expandedId === s.id;
            return (
              <div
                key={s.id}
                style={{
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 10,
                  background: '#fff',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(open ? null : s.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: 12,
                    width: '100%',
                    padding: '12px 14px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--sf-txt1)' }}>
                      {s.name || '(ohne Name)'}
                      {s.product ? (
                        <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 999, background: 'rgba(212,83,126,0.08)', color: 'var(--sf-pink)' }}>
                          {s.product}
                        </span>
                      ) : null}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--sf-txt3)', marginTop: 2, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <a
                        href={mailHref(s.email)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'inherit', textDecoration: 'none' }}
                      >
                        <Mail size={11} /> {s.email}
                      </a>
                      {s.phone ? (
                        <a
                          href={telHref(s.phone)}
                          onClick={(e) => e.stopPropagation()}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'inherit', textDecoration: 'none' }}
                        >
                          <Phone size={11} /> {s.phone}
                        </a>
                      ) : null}
                      <span>{new Date(s.created_at).toLocaleString('de-DE')}</span>
                    </div>
                    {!open && (
                      <div style={{ fontSize: 12, color: 'var(--sf-txt2)', marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.message}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--sf-txt3)', alignSelf: 'center' }}>
                    {open ? 'Schließen' : 'Öffnen'}
                  </div>
                </button>
                {open && (
                  <div style={{ padding: '0 14px 14px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '12px 0', alignItems: 'center' }}>
                      <a className="ad-btn ad-btn--ghost" href={mailHref(s.email)}>
                        <Mail size={14} /> E-Mail schreiben
                      </a>
                      {s.phone ? (
                        <a className="ad-btn ad-btn--ghost" href={telHref(s.phone)}>
                          <Phone size={14} /> Anrufen
                        </a>
                      ) : null}
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {confirmDeleteId === s.id ? (
                          <>
                            <span style={{ fontSize: 12, color: '#b91c1c', alignSelf: 'center' }}>
                              Wirklich loeschen?
                            </span>
                            <button
                              type="button"
                              className="ad-btn"
                              onClick={() => handleDelete(s.id)}
                              disabled={deletingId === s.id}
                              style={{ background: '#dc2626', color: '#fff', border: '1px solid #dc2626' }}
                            >
                              <Trash2 size={14} />
                              {deletingId === s.id ? 'Loescht...' : 'Loeschen'}
                            </button>
                            <button
                              type="button"
                              className="ad-btn ad-btn--ghost"
                              onClick={() => setConfirmDeleteId(null)}
                              disabled={deletingId === s.id}
                            >
                              Abbrechen
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="ad-btn ad-btn--ghost"
                            onClick={() => setConfirmDeleteId(s.id)}
                            style={{ color: '#b91c1c', borderColor: 'rgba(220,38,38,0.3)' }}
                          >
                            <Trash2 size={14} /> Loeschen
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.55, color: 'var(--sf-txt1)', background: 'rgba(0,0,0,0.02)', padding: 12, borderRadius: 8 }}>
                      {s.message}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
