import { Eye, Check, XCircle } from 'lucide-react';

interface Speaker {
  id: string;
  vorname: string;
  nachname: string;
  unternehmen: string;
  titel: string;
  format: string;
  stadt: string;
  status: string;
  quelle: string;
  kontaktperson: string;
  gesamtpreis_netto: number;
}

interface Props {
  speakers: Speaker[];
  onView: (id: string) => void;
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
}

const FORMAT_LABELS: Record<string, string> = {
  pitch3: 'Pitch 3 Min',
  keynote15: 'Keynote 15 Min',
  keynote25: 'Keynote 25 Min',
  barcamp: 'Barcamp',
  '7stage': 'The 7 Stage',
};

const STADT_LABELS: Record<string, string> = {
  koeln: 'Köln',
  muenchen: 'München',
  hamburg: 'Hamburg',
};

const QUELLE_LABELS: Record<string, string> = {
  skool: 'Skool',
  social: 'Social Media / Influencer',
  empfehlung: 'Empfehlung',
  website: 'Website',
  event: 'Event',
  google: 'Google',
  podcast: 'Podcast',
  sonstiges: 'Sonstiges',
};

const STATUS_CLASS: Record<string, string> = {
  eingereicht: 'ad-status--yellow',
  bestaetigt: 'ad-status--green',
  abgelehnt: 'ad-status--red',
};

const STATUS_LABELS: Record<string, string> = {
  eingereicht: 'Eingereicht',
  bestaetigt: 'Bestätigt',
  abgelehnt: 'Abgelehnt',
};

export { FORMAT_LABELS, STADT_LABELS, QUELLE_LABELS, STATUS_LABELS };

export default function AdminTable({ speakers, onView, onConfirm, onReject }: Props) {
  if (speakers.length === 0) {
    return (
      <div className="sf-card ad-empty">
        <p>Noch keine Einreichungen vorhanden.</p>
      </div>
    );
  }

  return (
    <div className="ad-table-wrap">
      <table className="ad-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Thema</th>
            <th>Format</th>
            <th>Stadt</th>
            <th>Status</th>
            <th>Preis</th>
            <th>Quelle</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {speakers.map((s) => (
            <tr key={s.id}>
              <td>
                <span className="ad-cell-name">{s.vorname} {s.nachname}</span>
                <span className="ad-cell-sub">{s.unternehmen}</span>
              </td>
              <td className="ad-cell-thema">{s.titel}</td>
              <td><span className="ad-badge ad-badge--lila">{FORMAT_LABELS[s.format] || s.format}</span></td>
              <td><span className="ad-badge ad-badge--blue">{STADT_LABELS[s.stadt] || s.stadt}</span></td>
              <td><span className={`ad-status ${STATUS_CLASS[s.status] || ''}`}>{STATUS_LABELS[s.status] || s.status}</span></td>
              <td className="ad-cell-price">{s.gesamtpreis_netto ? `${s.gesamtpreis_netto.toLocaleString('de-DE')} \u20ac` : '500 \u20ac'}</td>
              <td>
                {QUELLE_LABELS[s.quelle] || s.quelle}
                {s.quelle === 'empfehlung' && s.kontaktperson && (
                  <span className="ad-cell-sub"> ({s.kontaktperson})</span>
                )}
              </td>
              <td className="ad-cell-actions">
                <button className="ad-btn ad-btn--ghost" onClick={() => onView(s.id)} title="Details">
                  <Eye size={14} /> Details
                </button>
                {s.status === 'eingereicht' && (
                  <>
                    <button className="ad-btn ad-btn--green" onClick={() => onConfirm(s.id)} title="Bestätigen">
                      <Check size={14} />
                    </button>
                    <button className="ad-btn ad-btn--red" onClick={() => onReject(s.id)} title="Ablehnen">
                      <XCircle size={14} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
