import { useState, useEffect } from 'react';
import type { BarcampSlot } from './types';

interface Props {
  open: boolean;
  slot: BarcampSlot | null;
  room: number;
  onClose: () => void;
  onSave: (data: { id?: string; room: number; von: string; bis: string; speaker: string; thema: string; beschreibung: string }) => void;
  onDelete: (id: string) => void;
}

export default function BarcampModal({ open, slot, room, onClose, onSave, onDelete }: Props) {
  const [von, setVon] = useState('11:30');
  const [bis, setBis] = useState('12:00');
  const [speaker, setSpeaker] = useState('');
  const [thema, setThema] = useState('');
  const [beschreibung, setBeschreibung] = useState('');

  useEffect(() => {
    if (open) {
      if (slot) {
        setVon(slot.von);
        setBis(slot.bis);
        setSpeaker(slot.speaker);
        setThema(slot.thema);
        setBeschreibung(slot.beschreibung);
      } else {
        setVon('11:30');
        setBis('12:00');
        setSpeaker('');
        setThema('');
        setBeschreibung('');
      }
    }
  }, [open, slot]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSave = () => {
    onSave({ id: slot?.id, room: slot?.room ?? room, von, bis, speaker, thema, beschreibung });
  };

  if (!open) return null;

  return (
    <div className="ap-modal-bg show" onClick={onClose}>
      <div className="ap-modal" onClick={e => e.stopPropagation()}>
        <h3>{slot ? `Raum ${slot.room} · ${slot.von} – ${slot.bis}` : `Raum ${room} · Neuer Slot`}</h3>

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

        <label>Speaker / Moderator</label>
        <input value={speaker} onChange={e => setSpeaker(e.target.value)} />

        <label>Thema</label>
        <input value={thema} onChange={e => setThema(e.target.value)} placeholder="Worum geht es?" />

        <label>Kurzbeschreibung</label>
        <textarea value={beschreibung} onChange={e => setBeschreibung(e.target.value)} placeholder="2-3 Sätze für die Teilnehmer" />

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
