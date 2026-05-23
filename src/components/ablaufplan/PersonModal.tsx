import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { KATEGORIE_OPTIONS } from './types';
import type { TeamMember } from './types';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface Props {
  open: boolean;
  person: TeamMember | null;
  defaultKategorie: string;
  onClose: () => void;
  onSave: (data: Omit<TeamMember, 'id' | 'city_id' | 'sort_order'> & { id?: string }) => void;
  onDelete: (id: string) => void;
}

export default function PersonModal({ open, person, defaultKategorie, onClose, onSave, onDelete }: Props) {
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [rolle, setRolle] = useState('');
  const [kategorie, setKategorie] = useState(defaultKategorie);
  const [telefon, setTelefon] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('red');
  const [whatsapp, setWhatsapp] = useState(false);
  const [notizen, setNotizen] = useState('');
  const [fotoPreview, setFotoPreview] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setFotoFile(null);
      setUploading(false);
      setUploadError('');
      if (person) {
        const parts = person.name.split(' ');
        setVorname(parts[0] || '');
        setNachname(parts.slice(1).join(' ') || '');
        setRolle(person.rolle);
        setKategorie(person.kategorie);
        setTelefon(person.telefon);
        setEmail(person.email);
        setStatus(person.status);
        setWhatsapp(person.whatsapp);
        setNotizen(person.notizen);
        setFotoPreview(person.foto_url || '');
      } else {
        setVorname('');
        setNachname('');
        setRolle('');
        setKategorie(defaultKategorie);
        setTelefon('');
        setEmail('');
        setStatus('red');
        setWhatsapp(false);
        setNotizen('');
        setFotoPreview('');
      }
    }
  }, [open, person, defaultKategorie]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !uploading) onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, uploading]);

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('Datei zu groß (max. 5 MB)');
      return;
    }
    setFotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setFotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!vorname.trim() || uploading) return;
    setUploadError('');

    let finalUrl = fotoPreview;

    if (fotoFile) {
      setUploading(true);
      const ext = fotoFile.name.split('.').pop();
      const path = `team-fotos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('speaker-uploads').upload(path, fotoFile);
      if (error) {
        setUploading(false);
        setUploadError('Upload fehlgeschlagen: ' + error.message);
        return;
      }
      const { data } = supabase.storage.from('speaker-uploads').getPublicUrl(path);
      finalUrl = data.publicUrl;
      setUploading(false);
    }

    const fullName = vorname.trim() + (nachname.trim() ? ' ' + nachname.trim() : '');
    onSave({
      id: person?.id,
      name: fullName,
      rolle,
      kategorie,
      telefon,
      email,
      status,
      whatsapp,
      notizen,
      foto_url: finalUrl,
    });
  };

  const initials = person
    ? person.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (!open) return null;

  return (
    <div className="ap-modal-bg show" onClick={uploading ? undefined : onClose}>
      <div className="ap-modal" onClick={e => e.stopPropagation()}>
        <h3>{person ? person.name : 'Person hinzufügen'}</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <div
            className="ap-avatar"
            style={{ width: 56, height: 56, fontSize: 18, background: 'linear-gradient(135deg,#e040a0,#40e0d0)', cursor: 'pointer' }}
            onClick={() => fileRef.current?.click()}
          >
            {fotoPreview ? (
              <img src={fotoPreview} alt="Profilfoto Vorschau" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleFoto} />
          <div>
            <div style={{ fontSize: 11, color: 'var(--ap-muted)' }}>
              {fotoFile ? fotoFile.name : 'Foto hochladen'}
            </div>
            {uploadError && (
              <div style={{ fontSize: 11, color: 'var(--ap-red)', marginTop: 2 }}>{uploadError}</div>
            )}
          </div>
        </div>

        <div className="ap-mr">
          <div>
            <label>Vorname *</label>
            <input value={vorname} onChange={e => setVorname(e.target.value)} />
          </div>
          <div>
            <label>Nachname</label>
            <input value={nachname} onChange={e => setNachname(e.target.value)} />
          </div>
        </div>

        <label>Rolle / Aufgabe *</label>
        <input value={rolle} onChange={e => setRolle(e.target.value)} placeholder="z. B. Technik-Leitung" />

        <label>Kategorie</label>
        <select value={kategorie} onChange={e => setKategorie(e.target.value)}>
          {KATEGORIE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <div className="ap-mr">
          <div>
            <label>Telefon</label>
            <input value={telefon} onChange={e => setTelefon(e.target.value)} />
          </div>
          <div>
            <label>E-Mail</label>
            <input value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="ap-mr">
          <div>
            <label>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="green">Bestätigt</option>
              <option value="yellow">In Arbeit</option>
              <option value="red">Offen</option>
            </select>
          </div>
          <div>
            <label>WhatsApp</label>
            <select value={whatsapp ? 'yes' : 'no'} onChange={e => setWhatsapp(e.target.value === 'yes')}>
              <option value="no">Nein</option>
              <option value="yes">Ja</option>
            </select>
          </div>
        </div>

        <label>Notizen</label>
        <textarea value={notizen} onChange={e => setNotizen(e.target.value)} placeholder="Intern" />

        <div className="ap-modal-actions">
          {person && (
            <button
              className="ap-btn ap-btn-del ap-btn-sm"
              style={{ marginRight: 'auto' }}
              onClick={() => { if (confirm('Löschen?')) onDelete(person.id); }}
            >
              Löschen
            </button>
          )}
          <button className="ap-btn" onClick={onClose} disabled={uploading}>Abbrechen</button>
          <button className="ap-btn ap-btn-pink" onClick={handleSave} disabled={uploading} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {uploading && <Loader2 size={12} style={{ animation: 'ap-spin 0.6s linear infinite' }} />}
            {uploading ? 'Lädt hoch...' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  );
}
