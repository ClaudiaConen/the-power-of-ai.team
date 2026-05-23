import { useState, useEffect } from 'react';
import { TYP_OPTIONS } from './types';
import type { ScheduleSlot } from './types';

interface Props {
  open: boolean;
  slot: ScheduleSlot | null;
  onClose: () => void;
  onSave: (data: { id?: string; von: string; bis: string; typ: string; speaker: string; thema: string }) => void;
  onDelete: (id: string) => void;
}

export default function ScheduleModal({ open, slot, onClose, onSave, onDelete }: Props) {
  const [von, setVon] = useState('11:00');
  const [bis, setBis] = useState('11:45');
  const [typ, setTyp] = useState('Speaker');
  const [speaker, setSpeaker] = useState('');
  const [thema, setThema] = useState('');

  useEffect(() => {
    if (open) {
      if (slot) {
        setVon(slot.von);
        setBis(slot.bis);
        setTyp(slot.typ);
        setSpeaker(slot.speaker);
        setThema(slot.thema);
      } else {
        setVon('11:00');
        setBis('11:45');
        setTyp('Speaker');
        setSpeaker('');
        setThema('');
      }
    }
  }, [open, slot]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSave = () => {
    onSave({ id: slot?.id, von, bis, typ, speaker, thema });
  };

  if (!open) return null;

  return (
    <div className="ap-modal-bg show" onClick={onClose}>
      <div className="ap-modal" onClick={e => e.stopPropagation()}>
        <h3>{slot ? slot.von + ' – ' + slot.bis : 'Hauptbühne Slot'}</h3>

        <div className="ap-mr">
          <div>
            <label>Von *</label>
            <input type="time" value={von} onChange={e => setVon(e.target.value)} />
          </div>
          <div>
            <label>Bis *</label>
            <input type="time" value={bis} onChange={e => setBis(e.target.value)} />
          </div>
        </div>

        <label>Typ</label>
        <select value={typ} onChange={e => setTyp(e.target.value)}>
          {TYP_OPTIONS.map(t => (
            <option key={t} value={t}>{t === 'Speaker' ? 'Speaker / Keynote' : t === 'Netzwerk-Pause' ? 'Netzwerk-Pause / Catering' : t}</option>
          ))}
        </select>

        <label>Speaker / Verantwortlich</label>
        <input value={speaker} onChange={e => setSpeaker(e.target.value)} />

        <label>Thema / Beschreibung</label>
        <input value={thema} onChange={e => setThema(e.target.value)} />

        <div className="ap-modal-actions">
          {slot && (
            <button
              className="ap-btn ap-btn-del ap-btn-sm"
              style={{ marginRight: 'auto' }}
              onClick={() => { if (confirm('Löschen?')) onDelete(slot.id); }}
            >
              Löschen
            </button>
          )}
          <button className="ap-btn" onClick={onClose}>Abbrechen</button>
          <button className="ap-btn ap-btn-pink" onClick={handleSave}>Speichern</button>
        </div>
      </div>
    </div>
  );
}
