import { useState, useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: { slug: string; name: string; event_von: string; event_bis: string; event_datum: string }) => void;
}

export default function CityModal({ open, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [von, setVon] = useState('11:00');
  const [bis, setBis] = useState('18:00');
  const [datum, setDatum] = useState('');

  useEffect(() => {
    if (open) {
      setName('');
      setVon('11:00');
      setBis('18:00');
      setDatum('');
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const toSlug = (s: string) =>
    s.toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({ slug: toSlug(trimmed), name: trimmed, event_von: von, event_bis: bis, event_datum: datum });
  };

  if (!open) return null;

  return (
    <div className="ap-modal-bg show" onClick={onClose}>
      <div className="ap-modal" onClick={e => e.stopPropagation()}>
        <h3>Neue Stadt anlegen</h3>

        <label>Stadtname / Veranstaltungsort *</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="z. B. Frankfurt, Berlin, ..." />

        <div className="ap-mr">
          <div>
            <label>Beginn</label>
            <input type="time" value={von} onChange={e => setVon(e.target.value)} />
          </div>
          <div>
            <label>Ende</label>
            <input type="time" value={bis} onChange={e => setBis(e.target.value)} />
          </div>
        </div>

        <label>Datum</label>
        <input type="date" value={datum} onChange={e => setDatum(e.target.value)} />

        <div className="ap-modal-actions">
          <button className="ap-btn" onClick={onClose}>Abbrechen</button>
          <button className="ap-btn ap-btn-pink" onClick={handleSave}>Anlegen</button>
        </div>
      </div>
    </div>
  );
}
