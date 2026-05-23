import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight, Copy } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';

interface Coupon {
  id: string;
  code: string;
  discount_value: number;
  max_uses: number;
  current_uses: number;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean;
  created_at: string;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newValidUntil, setNewValidUntil] = useState('');
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      showToast('error', 'Gutscheine konnten nicht geladen werden.');
    } else {
      setCoupons(data || []);
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => { loadCoupons(); }, [loadCoupons]);

  const handleCreate = async () => {
    const code = newCode.trim().toUpperCase();
    const value = parseFloat(newValue);
    if (!code) { showToast('error', 'Bitte einen Code eingeben.'); return; }
    if (!value || value <= 0) { showToast('error', 'Bitte einen g\u00FCltigen Betrag eingeben.'); return; }

    setSaving(true);
    const payload: Record<string, unknown> = {
      code,
      discount_value: value,
      max_uses: 1,
      valid_until: newValidUntil || null,
    };

    const { error } = await supabase.from('coupons').insert(payload);
    if (error) {
      if (error.code === '23505') {
        showToast('error', 'Dieser Code existiert bereits.');
      } else {
        showToast('error', 'Gutschein konnte nicht erstellt werden.');
      }
    } else {
      showToast('success', `Gutschein "${code}" erstellt.`);
      setNewCode('');
      setNewValue('');
      setNewValidUntil('');
      setShowForm(false);
      loadCoupons();
    }
    setSaving(false);
  };

  const toggleActive = async (coupon: Coupon) => {
    const { error } = await supabase
      .from('coupons')
      .update({ active: !coupon.active })
      .eq('id', coupon.id);
    if (error) {
      showToast('error', 'Status konnte nicht ge\u00E4ndert werden.');
    } else {
      loadCoupons();
    }
  };

  const deleteCoupon = async (coupon: Coupon) => {
    if (coupon.current_uses > 0) {
      showToast('error', 'Eingeloeste Gutscheine k\u00F6nnen nicht gel\u00F6scht werden.');
      return;
    }
    const { error } = await supabase.from('coupons').delete().eq('id', coupon.id);
    if (error) {
      showToast('error', 'Gutschein konnte nicht gel\u00F6scht werden.');
    } else {
      showToast('success', 'Gutschein gel\u00F6scht.');
      loadCoupons();
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast('success', `"${code}" kopiert.`);
  };

  const fmtDate = (d: string | null) => {
    if (!d) return '\u2014';
    return new Date(d).toLocaleDateString('de-DE');
  };

  const isExpired = (c: Coupon) => {
    if (!c.valid_until) return false;
    return new Date(c.valid_until) < new Date();
  };

  return (
    <div className="ad-coupons">
      <div className="ad-coupons-header">
        <h3 className="ad-coupons-title">Gutscheine verwalten</h3>
        <button className="ad-btn ad-btn--ghost" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> Neuer Gutschein
        </button>
      </div>

      {showForm && (
        <div className="ad-coupon-form">
          <div className="ad-coupon-form-row">
            <div className="sf-field">
              <label className="sf-label">Code</label>
              <input
                className="sf-input"
                type="text"
                placeholder="z.B. EARLYBIRD50"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                maxLength={30}
              />
            </div>
            <div className="sf-field" style={{ maxWidth: 140 }}>
              <label className="sf-label">Rabatt (netto)</label>
              <input
                className="sf-input"
                type="number"
                placeholder="50"
                min={1}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </div>
            <div className="sf-field" style={{ maxWidth: 180 }}>
              <label className="sf-label">G&uuml;ltig bis <span className="sf-optional">(optional)</span></label>
              <input
                className="sf-input"
                type="date"
                value={newValidUntil}
                onChange={(e) => setNewValidUntil(e.target.value)}
              />
            </div>
          </div>
          <div className="ad-coupon-form-actions">
            <button className="ad-btn" onClick={handleCreate} disabled={saving}>
              {saving ? 'Wird erstellt...' : 'Gutschein erstellen'}
            </button>
            <button className="ad-btn ad-btn--ghost" onClick={() => setShowForm(false)}>Abbrechen</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="ad-muted" style={{ padding: '16px 0' }}>Lade Gutscheine...</p>
      ) : coupons.length === 0 ? (
        <p className="ad-muted" style={{ padding: '16px 0' }}>Noch keine Gutscheine erstellt.</p>
      ) : (
        <div className="ad-coupon-list">
          {coupons.map((c) => {
            const used = c.current_uses >= c.max_uses;
            const expired = isExpired(c);
            return (
              <div key={c.id} className={`ad-coupon-card${!c.active ? ' ad-coupon-card--inactive' : ''}${used ? ' ad-coupon-card--used' : ''}${expired ? ' ad-coupon-card--expired' : ''}`}>
                <div className="ad-coupon-card-top">
                  <div className="ad-coupon-code-wrap">
                    <span className="ad-coupon-code">{c.code}</span>
                    <button className="ad-coupon-copy" onClick={() => copyCode(c.code)} title="Code kopieren">
                      <Copy size={12} />
                    </button>
                  </div>
                  <span className="ad-coupon-value">&minus;{c.discount_value.toLocaleString('de-DE')} &euro;</span>
                </div>
                <div className="ad-coupon-card-meta">
                  <span>{used ? 'Eingelöst' : expired ? 'Abgelaufen' : !c.active ? 'Deaktiviert' : 'Verfügbar'}</span>
                  <span>{c.current_uses}/{c.max_uses} genutzt</span>
                  <span>Bis: {fmtDate(c.valid_until)}</span>
                  <span>Erstellt: {fmtDate(c.created_at)}</span>
                </div>
                <div className="ad-coupon-card-actions">
                  <button
                    className="ad-coupon-toggle"
                    onClick={() => toggleActive(c)}
                    title={c.active ? 'Deaktivieren' : 'Aktivieren'}
                  >
                    {c.active ? <ToggleRight size={20} className="ad-coupon-toggle--on" /> : <ToggleLeft size={20} />}
                  </button>
                  <button
                    className="ad-coupon-delete"
                    onClick={() => deleteCoupon(c)}
                    title="L\u00F6schen"
                    disabled={c.current_uses > 0}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
