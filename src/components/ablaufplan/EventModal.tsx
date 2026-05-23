import { useState, useEffect } from 'react';
import type { City } from './types';

interface Props {
  open: boolean;
  city: City | null;
  onClose: () => void;
  onSave: (data: { event_von: string; event_bis: string; event_datum: string }) => void;
}

export default function EventModal({ open, city, onClose, onSave }: Props) {
  const [von, setVon] = useState('11:00');
  const [bis, setBis] = useState('18:00');
  const [datum, setDatum] = useState('');

  useEffect(() => {
    if (open && city) {
      setVon(city.event_von);
      setBis(city.event_bis);
      setDatum(city.event_datum || '');
    }
  }, [open, city]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ap-modal-bg show" onClick={onClose}>
      <div className="ap-modal" onClick={e => e.stopPropagation()}>
        <h3>Event-Zeit ändern</h3>

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
          <button className="ap-btn ap-btn-pink" onClick={() => onSave({ event_von: von, event_bis: bis, event_datum: datum })}>Speichern</button>
        </div>
      </div>
    </div>
  );
}
