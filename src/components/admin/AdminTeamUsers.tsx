import { useCallback, useEffect, useState } from 'react';
import { UserPlus, Trash2, KeyRound, ShieldCheck, RefreshCw, X, Copy } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  rolle: string;
}

const ROLES: { value: string; label: string; color: string; bg: string }[] = [
  { value: 'super_admin', label: 'Super Admin', color: '#0f172a', bg: '#dbeafe' },
  { value: 'event_manager', label: 'Event Manager', color: '#0f766e', bg: '#ccfbf1' },
  { value: 'content_manager', label: 'Content Manager', color: '#92400e', bg: '#fef3c7' },
  { value: 'support', label: 'Support', color: '#334155', bg: '#e2e8f0' },
];

function roleMeta(rolle: string) {
  return ROLES.find((r) => r.value === rolle) ?? ROLES[3];
}

function generatePassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const digits = '23456789';
  const special = '!@#$%*-+';
  const all = upper + lower + digits + special;
  const arr = new Uint32Array(16);
  crypto.getRandomValues(arr);
  const pick = (s: string, n: number) => s[n % s.length];
  let out =
    pick(upper, arr[0]) +
    pick(lower, arr[1]) +
    pick(digits, arr[2]) +
    pick(special, arr[3]);
  for (let i = 4; i < 16; i++) out += pick(all, arr[i]);
  return out.split('').sort(() => 0.5 - Math.random()).join('');
}

export default function AdminTeamUsers({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ email: '', name: '', rolle: 'event_manager', password: '' });
  const [creating, setCreating] = useState(false);
  const [createdCred, setCreatedCred] = useState<{ email: string; password: string } | null>(null);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, name, rolle')
      .order('email');
    if (error) {
      showToast('error', 'Team-Mitglieder konnten nicht geladen werden.');
    } else {
      setUsers(data ?? []);
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const callApi = async (body: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { ok: false, error: 'Nicht eingeloggt' };
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-user-management`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: json?.error ?? 'Fehler' };
    return { ok: true };
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creating) return;
    setCreating(true);
    const password = form.password.trim() || generatePassword();
    const res = await callApi({
      action: 'create_user',
      email: form.email.trim().toLowerCase(),
      name: form.name.trim(),
      rolle: form.rolle,
      password,
    });
    if (res.ok) {
      showToast('success', 'Teammitglied angelegt.');
      setCreatedCred({ email: form.email.trim().toLowerCase(), password });
      setForm({ email: '', name: '', rolle: 'event_manager', password: '' });
      load();
    } else {
      showToast('error', res.error ?? 'Anlegen fehlgeschlagen.');
    }
    setCreating(false);
  };

  const changeRole = async (u: AdminUser, rolle: string) => {
    if (rolle === u.rolle) return;
    const res = await callApi({ action: 'update_role', user_id: u.id, rolle });
    if (res.ok) {
      showToast('success', 'Rolle aktualisiert.');
      load();
    } else {
      showToast('error', res.error ?? 'Aktualisierung fehlgeschlagen.');
    }
  };

  const resetPassword = async (u: AdminUser) => {
    const redirect = `${window.location.origin}/#admin-reset`;
    const res = await callApi({ action: 'reset_password', user_id: u.id, redirect_to: redirect });
    if (res.ok) showToast('success', `Reset-Mail an ${u.email} gesendet.`);
    else showToast('error', res.error ?? 'Reset fehlgeschlagen.');
  };

  const remove = async (u: AdminUser) => {
    if (!confirm(`Teammitglied ${u.email} wirklich löschen?`)) return;
    const res = await callApi({ action: 'delete_user', user_id: u.id });
    if (res.ok) {
      showToast('success', 'Teammitglied gelöscht.');
      load();
    } else {
      showToast('error', res.error ?? 'Löschen fehlgeschlagen.');
    }
  };

  return (
    <div className="sf-card" style={{ padding: 20, marginTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, color: '#0f172a', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={18} /> Team-Verwaltung
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
            Verwalte Admin-Zugänge und Rollen für dein Team.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="ad-btn ad-btn--ghost" onClick={load} disabled={loading}>
            <RefreshCw size={14} /> Neu laden
          </button>
          <button className="ad-btn" onClick={() => setShowAdd(true)}>
            <UserPlus size={14} /> Teammitglied hinzufügen
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>Name</th>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>E-Mail</th>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>Rolle</th>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: 20, textAlign: 'center', color: '#64748b' }}>Lade...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 20, textAlign: 'center', color: '#64748b' }}>Noch keine Teammitglieder.</td></tr>
            ) : users.map((u) => {
              const meta = roleMeta(u.rolle);
              const isSelf = u.id === currentUserId;
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: 10 }}>
                    {u.name || <span style={{ color: '#94a3b8' }}>–</span>}
                    {isSelf && <span style={{ marginLeft: 6, fontSize: 11, color: '#2563eb' }}>(du)</span>}
                  </td>
                  <td style={{ padding: 10 }}>{u.email}</td>
                  <td style={{ padding: 10 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 12,
                        background: meta.bg,
                        color: meta.color,
                        fontWeight: 600,
                        fontSize: 12,
                      }}>{meta.label}</span>
                      <select
                        value={u.rolle}
                        onChange={(e) => changeRole(u, e.target.value)}
                        style={{
                          fontSize: 12,
                          padding: '4px 6px',
                          border: '1px solid #e2e8f0',
                          borderRadius: 6,
                          background: '#fff',
                        }}
                      >
                        {ROLES.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td style={{ padding: 10, textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        className="ad-btn ad-btn--ghost"
                        style={{ padding: '6px 10px', fontSize: 12 }}
                        onClick={() => resetPassword(u)}
                      >
                        <KeyRound size={12} /> Reset
                      </button>
                      <button
                        className="ad-btn ad-btn--ghost"
                        style={{ padding: '6px 10px', fontSize: 12, color: isSelf ? '#94a3b8' : '#b91c1c' }}
                        onClick={() => remove(u)}
                        disabled={isSelf}
                        title={isSelf ? 'Du kannst dich nicht selbst löschen.' : 'Teammitglied löschen'}
                      >
                        <Trash2 size={12} /> Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div
          onClick={() => { if (!creating) { setShowAdd(false); setCreatedCred(null); } }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="sf-card"
            style={{ width: '100%', maxWidth: 460, padding: 24, position: 'relative' }}
          >
            <button
              onClick={() => { if (!creating) { setShowAdd(false); setCreatedCred(null); } }}
              style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            {createdCred ? (
              <>
                <h3 style={{ margin: 0, color: '#065f46' }}>Zugang erstellt</h3>
                <p style={{ fontSize: 13, color: '#475569', marginTop: 8 }}>
                  Speichere diese Daten jetzt – das Passwort wird nicht erneut angezeigt.
                </p>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, marginTop: 12 }}>
                  <div style={{ fontSize: 12, color: '#64748b' }}>E-Mail</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 14 }}>{createdCred.email}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 10 }}>Passwort</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <code style={{ fontFamily: 'monospace', fontSize: 14, wordBreak: 'break-all' }}>{createdCred.password}</code>
                    <button
                      className="ad-btn ad-btn--ghost"
                      style={{ padding: '4px 8px' }}
                      onClick={() => { navigator.clipboard.writeText(createdCred.password); showToast('success', 'Kopiert.'); }}
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
                <button
                  className="ad-btn"
                  style={{ marginTop: 16, width: '100%' }}
                  onClick={() => { setShowAdd(false); setCreatedCred(null); }}
                >
                  Fertig
                </button>
              </>
            ) : (
              <form onSubmit={handleCreate}>
                <h3 style={{ margin: 0 }}>Neues Teammitglied</h3>
                <div className="sf-field" style={{ marginTop: 14 }}>
                  <label className="sf-label">Name</label>
                  <input className="sf-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="sf-field">
                  <label className="sf-label">E-Mail</label>
                  <input className="sf-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="sf-field">
                  <label className="sf-label">Rolle</label>
                  <select
                    className="sf-input"
                    value={form.rolle}
                    onChange={(e) => setForm({ ...form, rolle: e.target.value })}
                  >
                    {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div className="sf-field">
                  <label className="sf-label">Start-Passwort <span style={{ color: '#64748b', fontWeight: 400 }}>(leer = automatisch generieren)</span></label>
                  <input
                    className="sf-input"
                    type="text"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Mind. 10 Zeichen oder leer lassen"
                    minLength={form.password ? 10 : 0}
                  />
                </div>
                <button type="submit" className="sf-submit-btn" disabled={creating} style={{ marginTop: 8 }}>
                  <span className="sf-submit-btn-glow" />
                  <UserPlus size={16} />
                  {creating ? 'Erstelle...' : 'Teammitglied anlegen'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
