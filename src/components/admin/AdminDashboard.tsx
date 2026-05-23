import { useState, useEffect, useCallback } from 'react';
import { LogOut, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';
import AdminStats from './AdminStats';
import AdminFilters from './AdminFilters';
import AdminTable from './AdminTable';
import SpeakerModal from './SpeakerModal';
import AdminCoupons from './AdminCoupons';
import AdminContactSubmissions from './AdminContactSubmissions';
import AdminTeamUsers from './AdminTeamUsers';

interface Speaker {
  id: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  unternehmen: string;
  titel: string;
  beschreibung: string;
  kernbotschaft: string;
  format: string;
  stadt: string;
  status: string;
  quelle: string;
  quelle_sonstiges: string;
  kontaktperson: string;
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
  created_at: string;
  notizen_intern: string;
  anmoderation: string;
  foto_url: string;
  video_url: string;
  gutscheincode: string;
  rabatt_netto: number;
  consent_foto: boolean;
  consent_werbung: boolean;
  consent_urheber: boolean;
  consent_content: boolean;
  consent_dsgvo: boolean;
}

export default function AdminDashboard() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [filter, setFilter] = useState('alle');
  const [search, setSearch] = useState('');
  const [modalId, setModalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.hash = '#admin';
      return;
    }
    const { data: admin } = await supabase.from('admin_users').select('id, rolle').eq('id', session.user.id).maybeSingle();
    if (!admin) {
      await supabase.auth.signOut();
      window.location.hash = '#admin';
      return;
    }
    setCurrentUserId(admin.id);
    setCurrentRole(admin.rolle);
    setAuthed(true);
    loadSpeakers();
  };

  const loadSpeakers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('speakers').select('*').order('created_at', { ascending: false });
    if (error) {
      showToast('error', 'Daten konnten nicht geladen werden.');
    } else {
      setSpeakers(data || []);
    }
    setLoading(false);
  }, [showToast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.hash = '#admin';
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('speakers').update({
      status,
      status_changed_at: new Date().toISOString(),
      status_changed_by: 'admin',
    }).eq('id', id);
    if (error) {
      showToast('error', 'Status konnte nicht geändert werden.');
    } else {
      showToast('success', 'Status geändert.');
      loadSpeakers();
    }
  };

  const exportCSV = () => {
    const BOM = '\uFEFF';
    const headers = [
      'Vorname', 'Nachname', 'E-Mail', 'Telefon', 'Unternehmen',
      'Titel', 'Beschreibung', 'Kernbotschaft', 'Anmoderation',
      'Format', 'Stadt', 'Status', 'Quelle', 'Quelle Sonstiges', 'Kontaktperson',
      'Link 1', 'Link 2', 'Link 3', 'Foto-URL', 'Video-URL',
      'Keynote 15', 'Keynote 25', 'Barcamp-Room', 'The 7 Stage', 'Shooting', 'Workshop', 'Coaching',
      'Gutscheincode', 'Rabatt netto', 'Preis netto', 'MwSt.', 'Preis brutto',
      'Rechnung Firma', 'Rechnung Stra\u00DFe', 'Rechnung PLZ', 'Rechnung Stadt', 'USt-IdNr',
      'Consent Foto', 'Consent Werbung', 'Consent Urheber', 'Consent Content', 'Consent DSGVO',
      'Datum', 'Notizen',
    ];
    const rows = speakers.map((s) => {
      const netto = s.gesamtpreis_netto || 500;
      const mwst = Math.round(netto * 19) / 100;
      return [
        s.vorname, s.nachname, s.email, s.telefon, s.unternehmen,
        s.titel, s.beschreibung, s.kernbotschaft, s.anmoderation,
        s.format, s.stadt, s.status, s.quelle, s.quelle_sonstiges, s.kontaktperson,
        s.link1, s.link2, s.link3, s.foto_url, s.video_url,
        s.upgrade_keynote15 ? 'Ja' : 'Nein',
        s.upgrade_keynote25 ? 'Ja' : 'Nein',
        s.upgrade_barcamp_room ? 'Ja' : 'Nein',
        s.upgrade_7stage ? 'Ja' : 'Nein',
        s.upgrade_shooting ? 'Ja' : 'Nein',
        s.upgrade_workshop ? 'Ja' : 'Nein',
        s.upgrade_coaching ? 'Ja' : 'Nein',
        s.gutscheincode,
        s.rabatt_netto ? s.rabatt_netto.toLocaleString('de-DE') : '0',
        netto.toLocaleString('de-DE'),
        mwst.toLocaleString('de-DE'),
        (netto + mwst).toLocaleString('de-DE'),
        s.r_firma, s.r_strasse, s.r_plz, s.r_stadt, s.r_ustid,
        s.consent_foto ? 'Ja' : 'Nein',
        s.consent_werbung ? 'Ja' : 'Nein',
        s.consent_urheber ? 'Ja' : 'Nein',
        s.consent_content ? 'Ja' : 'Nein',
        s.consent_dsgvo ? 'Ja' : 'Nein',
        new Date(s.created_at).toLocaleDateString('de-DE'),
        s.notizen_intern,
      ].map((v) => `"${(String(v ?? '')).replace(/"/g, '""')}"`).join(';');
    });

    const csv = BOM + headers.join(';') + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `speaker-export-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'CSV-Export heruntergeladen.');
  };

  const counts = {
    total: speakers.length,
    eingereicht: speakers.filter((s) => s.status === 'eingereicht').length,
    bestaetigt: speakers.filter((s) => s.status === 'bestaetigt').length,
    abgelehnt: speakers.filter((s) => s.status === 'abgelehnt').length,
  };

  const filtered = speakers
    .filter((s) => filter === 'alle' || s.status === filter)
    .filter((s) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        `${s.vorname} ${s.nachname}`.toLowerCase().includes(q) ||
        s.unternehmen.toLowerCase().includes(q) ||
        s.titel.toLowerCase().includes(q)
      );
    });

  return (
    <div className="sf-page">
      <div className="sf-blob sf-blob--pink" />
      <div className="sf-blob sf-blob--lila" />
      <div className="sf-blob sf-blob--blue" />

      <nav className="sf-nav">
        <div className="sf-nav-left">
          <span className="sf-nav-brand">The Power of <em>AI</em></span>
          <span className="ad-nav-title">Speaker-Management</span>
        </div>
        <div className="sf-nav-links">
          <button className="ad-btn ad-btn--ghost" onClick={exportCSV}>
            <Download size={14} /> CSV Export
          </button>
          <button className="ad-btn ad-btn--ghost" onClick={handleLogout}>
            <LogOut size={14} /> Abmelden
          </button>
        </div>
      </nav>

      <div className="ad-container">
        <AdminStats counts={counts} />
        <AdminFilters filter={filter} search={search} onFilterChange={setFilter} onSearchChange={setSearch} />

        {loading ? (
          <div className="sf-card ad-empty"><p>Lade Daten...</p></div>
        ) : (
          <AdminTable
            speakers={filtered}
            onView={(id) => setModalId(id)}
            onConfirm={(id) => updateStatus(id, 'bestaetigt')}
            onReject={(id) => updateStatus(id, 'abgelehnt')}
          />
        )}

        {authed && <AdminContactSubmissions />}

        <AdminCoupons />

        {authed && currentRole === 'super_admin' && (
          <AdminTeamUsers currentUserId={currentUserId} />
        )}
      </div>

      {modalId && (
        <SpeakerModal
          speakerId={modalId}
          onClose={() => setModalId(null)}
          onStatusChange={loadSpeakers}
        />
      )}
    </div>
  );
}
