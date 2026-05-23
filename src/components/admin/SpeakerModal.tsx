import { useEffect, useState } from 'react';
import { X, Check, XCircle, RotateCcw, ExternalLink, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';
import { FORMAT_LABELS, STADT_LABELS, QUELLE_LABELS, STATUS_LABELS } from './AdminTable';
import InvoiceSection from './InvoiceSection';

interface Speaker {
  id: string;
  created_at: string;
  status: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  unternehmen: string;
  quelle: string;
  quelle_sonstiges: string;
  kontaktperson: string;
  foto_url: string;
  video_url: string;
  titel: string;
  beschreibung: string;
  kernbotschaft: string;
  format: string;
  stadt: string;
  link1: string;
  link2: string;
  link3: string;
  r_firma: string;
  r_strasse: string;
  r_plz: string;
  r_stadt: string;
  r_ustid: string;
  upgrade_keynote15: boolean;
  upgrade_keynote25: boolean;
  upgrade_barcamp_room: boolean;
  upgrade_7stage: boolean;
  upgrade_shooting: boolean;
  upgrade_workshop: boolean;
  upgrade_coaching: boolean;
  gesamtpreis_netto: number;
  consent_foto: boolean;
  consent_werbung: boolean;
  consent_urheber: boolean;
  consent_content: boolean;
  consent_dsgvo: boolean;
  notizen_intern: string;
  anmoderation: string;
  gutscheincode: string;
  rabatt_netto: number;
}

interface Props {
  speakerId: string;
  onClose: () => void;
  onStatusChange: () => void;
}

export default function SpeakerModal({ speakerId, onClose, onStatusChange }: Props) {
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadSpeaker();
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [speakerId]);

  const loadSpeaker = async () => {
    const { data } = await supabase.from('speakers').select('*').eq('id', speakerId).maybeSingle();
    if (data) {
      setSpeaker(data);
      setNotes(data.notizen_intern || '');
    }
  };

  const updateStatus = async (status: string) => {
    const { error } = await supabase.from('speakers').update({
      status,
      status_changed_at: new Date().toISOString(),
      status_changed_by: 'admin',
    }).eq('id', speakerId);

    if (error) {
      showToast('error', 'Status konnte nicht geändert werden.');
      return;
    }

    showToast('success', `Status auf "${STATUS_LABELS[status]}" geändert.`);
    loadSpeaker();
    onStatusChange();
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    const { error } = await supabase.from('speakers').update({ notizen_intern: notes }).eq('id', speakerId);
    if (error) {
      showToast('error', 'Notizen konnten nicht gespeichert werden.');
    } else {
      showToast('success', 'Notizen gespeichert.');
    }
    setSavingNotes(false);
  };

  if (!speaker) return null;

  const initials = (speaker.vorname[0] || '') + (speaker.nachname[0] || '');

  return (
    <div className="ad-modal-backdrop" onClick={onClose}>
      <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ad-modal-close" onClick={onClose}><X size={20} /></button>

        <div className="ad-modal-header">
          <div className="ad-modal-avatar">{initials}</div>
          <div>
            <h2 className="ad-modal-name">{speaker.vorname} {speaker.nachname}</h2>
            <p className="ad-modal-company">{speaker.unternehmen}</p>
          </div>
        </div>

        <div className="ad-modal-badges">
          <span className="ad-badge ad-badge--lila">{FORMAT_LABELS[speaker.format] || speaker.format}</span>
          <span className="ad-badge ad-badge--blue">{STADT_LABELS[speaker.stadt] || speaker.stadt}</span>
          <span className={`ad-status ${speaker.status === 'eingereicht' ? 'ad-status--yellow' : speaker.status === 'bestaetigt' ? 'ad-status--green' : 'ad-status--red'}`}>
            {STATUS_LABELS[speaker.status] || speaker.status}
          </span>
        </div>

        <div className="ad-modal-scroll">
          <div className="ad-modal-section">
            <h3>Vortragstitel</h3>
            <p>{speaker.titel}</p>
          </div>
          <div className="ad-modal-section">
            <h3>Kurzbeschreibung</h3>
            <p>{speaker.beschreibung}</p>
          </div>
          <div className="ad-modal-section">
            <h3>Kernbotschaft</h3>
            <p>{speaker.kernbotschaft}</p>
          </div>
          {speaker.anmoderation && (
            <div className="ad-modal-section">
              <h3>Anmoderationstext</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{speaker.anmoderation}</p>
            </div>
          )}

          <div className="ad-modal-grid">
            <div>
              <h3>E-Mail</h3>
              <p>{speaker.email}</p>
            </div>
            <div>
              <h3>Telefon</h3>
              <p>{speaker.telefon || '—'}</p>
            </div>
            <div>
              <h3>Quelle</h3>
              <p>
                {QUELLE_LABELS[speaker.quelle] || speaker.quelle}
                {speaker.quelle === 'sonstiges' && speaker.quelle_sonstiges && (
                  <span className="ad-cell-sub"> ({speaker.quelle_sonstiges})</span>
                )}
              </p>
            </div>
            {speaker.kontaktperson && (
              <div>
                <h3>Kontaktperson</h3>
                <p>{speaker.kontaktperson}</p>
              </div>
            )}
            <div>
              <h3>Eingangsdatum</h3>
              <p>{new Date(speaker.created_at).toLocaleDateString('de-DE')}</p>
            </div>
          </div>

          {(speaker.link1 || speaker.link2 || speaker.link3) && (
            <div className="ad-modal-section">
              <h3>Links</h3>
              <div className="ad-modal-links">
                {[speaker.link1, speaker.link2, speaker.link3].filter(Boolean).map((link, i) => (
                  <a key={i} href={link} target="_blank" rel="noopener noreferrer"><ExternalLink size={12} /> {link}</a>
                ))}
              </div>
            </div>
          )}

          <div className="ad-modal-section">
            <h3>Gebuchte Leistungen</h3>
            <div className="ad-consents">
              {[
                { active: true, label: 'Basis-Paket (3 Min Pitch + Stand + Barcamp)' },
                { active: speaker.upgrade_keynote15, label: '+15 Min Keynote (+500 \u20ac)' },
                { active: speaker.upgrade_keynote25, label: '+25 Min Keynote (+750 \u20ac)' },
                { active: speaker.upgrade_barcamp_room, label: 'Barcamp-Room 30 Min (+170 \u20ac)' },
                { active: speaker.upgrade_7stage, label: 'The 7 Stage (+1.777 \u20ac)' },
                { active: speaker.upgrade_shooting, label: 'Professionelles Shooting (+500 \u20ac)' },
                { active: speaker.upgrade_workshop, label: 'Performance Workshop (+177 \u20ac)' },
                { active: speaker.upgrade_coaching, label: '1:1 Coaching (+377 \u20ac)' },
              ].map(({ active, label }) => (
                <div key={label} className="ad-consent-row">
                  {active ?
                    <CheckCircle size={14} className="ad-consent-yes" /> :
                    <AlertCircle size={14} className="ad-consent-no" />}
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 12, fontWeight: 600, fontSize: 15 }}>
              Gesamtpreis: {speaker.gesamtpreis_netto?.toLocaleString('de-DE') ?? '500'} &euro; netto
            </p>
            {speaker.gutscheincode && (
              <p style={{ marginTop: 4, fontSize: 13, color: '#16a34a' }}>
                Gutschein &bdquo;{speaker.gutscheincode}&ldquo; &mdash; {speaker.rabatt_netto?.toLocaleString('de-DE') ?? '0'} &euro; Rabatt
              </p>
            )}
          </div>

          <div className="ad-modal-section">
            <h3>Rechnungsadresse</h3>
            <p>{speaker.r_firma}<br />{speaker.r_strasse}<br />{speaker.r_plz} {speaker.r_stadt}{speaker.r_ustid ? <><br />USt-IdNr.: {speaker.r_ustid}</> : null}</p>
          </div>

          {speaker.foto_url && (
            <div className="ad-modal-section">
              <h3>Profilfoto</h3>
              <img src={speaker.foto_url} alt="Profilfoto" className="ad-modal-photo" />
            </div>
          )}

          {speaker.video_url && (
            <div className="ad-modal-section">
              <h3>Video-Intro</h3>
              {speaker.video_url.match(/\.(mp4|mov|m4v|webm)$/i) ? (
                <video
                  src={speaker.video_url}
                  controls
                  preload="metadata"
                  style={{ width: '100%', maxWidth: 400, borderRadius: 8, marginBottom: 8 }}
                />
              ) : speaker.video_url.match(/\.(mp3|m4a)$/i) ? (
                <audio src={speaker.video_url} controls preload="metadata" style={{ width: '100%', maxWidth: 400, marginBottom: 8 }} />
              ) : null}
              <a href={speaker.video_url} target="_blank" rel="noopener noreferrer" className="ad-btn ad-btn--ghost">
                <ExternalLink size={14} /> In neuem Tab &ouml;ffnen
              </a>
            </div>
          )}

          <div className="ad-modal-section">
            <h3>Einverständniserklärungen</h3>
            <div className="ad-consents">
              {[
                { key: 'consent_foto', label: 'Foto- & Videoaufnahmen' },
                { key: 'consent_werbung', label: 'Nutzung zu Werbezwecken' },
                { key: 'consent_urheber', label: 'Urheberrecht' },
                { key: 'consent_content', label: 'Content Policy' },
                { key: 'consent_dsgvo', label: 'Datenschutz & AGB' },
              ].map(({ key, label }) => (
                <div key={key} className="ad-consent-row">
                  {speaker[key as keyof Speaker] ?
                    <CheckCircle size={14} className="ad-consent-yes" /> :
                    <AlertCircle size={14} className="ad-consent-no" />}
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ad-modal-section">
            <h3>Interne Notizen</h3>
            <textarea className="sf-input sf-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="z. B. Thema passt zu Block 2, Video prüfen..." />
            <button className="ad-btn ad-btn--ghost" onClick={saveNotes} disabled={savingNotes} style={{ marginTop: 8 }}>
              <Save size={14} /> {savingNotes ? 'Speichern...' : 'Notizen speichern'}
            </button>
          </div>

          <InvoiceSection speaker={speaker} />
        </div>

        <div className="ad-modal-actions">
          {speaker.status === 'eingereicht' && (
            <>
              <button className="ad-btn ad-btn--green" onClick={() => updateStatus('bestaetigt')}>
                <Check size={14} /> Bestätigen
              </button>
              <button className="ad-btn ad-btn--red" onClick={() => updateStatus('abgelehnt')}>
                <XCircle size={14} /> Ablehnen
              </button>
            </>
          )}
          {(speaker.status === 'bestaetigt' || speaker.status === 'abgelehnt') && (
            <button className="ad-btn ad-btn--ghost" onClick={() => updateStatus('eingereicht')}>
              <RotateCcw size={14} /> Zurück auf Eingereicht
            </button>
          )}
          <button className="sf-submit-btn" onClick={onClose} style={{ marginLeft: 'auto', width: 'auto', padding: '10px 24px' }}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
