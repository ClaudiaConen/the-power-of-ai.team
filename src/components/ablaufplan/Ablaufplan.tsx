import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Printer, Download, RotateCcw, ChevronDown, Plus, Pencil, Check, LogIn } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';
import PersonModal from './PersonModal';
import ScheduleModal from './ScheduleModal';
import BarcampModal from './BarcampModal';
import EventModal from './EventModal';
import CityModal from './CityModal';
import {
  CATS_ALL, CAT_COLORS, SCHEDULE_COLORS,
  type City, type TeamMember, type ScheduleSlot, type BarcampSlot, type BarcampRoom,
} from './types';
import './Ablaufplan.css';

const DEFAULT_SCHEDULE = [
  { von: '11:00', bis: '11:30', typ: 'Begrüßung', sort_order: 1 },
  { von: '11:30', bis: '12:15', typ: 'Speaker', sort_order: 2 },
  { von: '12:15', bis: '13:00', typ: 'Netzwerk-Pause', sort_order: 3 },
  { von: '13:00', bis: '13:45', typ: 'Speaker', sort_order: 4 },
  { von: '13:45', bis: '14:30', typ: 'Speaker', sort_order: 5 },
  { von: '14:30', bis: '15:15', typ: 'Speaker', sort_order: 6 },
  { von: '15:15', bis: '16:00', typ: 'Netzwerk-Pause', sort_order: 7 },
  { von: '16:00', bis: '16:45', typ: 'Speaker', sort_order: 8 },
  { von: '16:45', bis: '17:30', typ: 'Speaker', sort_order: 9 },
  { von: '17:30', bis: '18:00', typ: 'Abschluss', sort_order: 10 },
];

const DEFAULT_BARCAMP = [
  { room: 1, von: '11:30', bis: '12:00', sort_order: 1 },
  { room: 1, von: '13:00', bis: '13:30', sort_order: 2 },
  { room: 1, von: '14:30', bis: '15:00', sort_order: 3 },
  { room: 1, von: '16:00', bis: '16:30', sort_order: 4 },
  { room: 2, von: '11:30', bis: '12:00', sort_order: 1 },
  { room: 2, von: '13:00', bis: '13:30', sort_order: 2 },
  { room: 2, von: '14:30', bis: '15:00', sort_order: 3 },
  { room: 2, von: '16:00', bis: '16:30', sort_order: 4 },
  { room: 3, von: '11:30', bis: '12:00', sort_order: 1 },
  { room: 3, von: '13:00', bis: '13:30', sort_order: 2 },
  { room: 3, von: '14:30', bis: '15:00', sort_order: 3 },
  { room: 3, von: '16:00', bis: '16:30', sort_order: 4 },
];

export default function Ablaufplan() {
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const { showToast } = useToast();

  const [cities, setCities] = useState<City[]>([]);
  const [activeCity, setActiveCity] = useState<City | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [barcamp, setBarcamp] = useState<BarcampSlot[]>([]);
  const [roomNames, setRoomNames] = useState<BarcampRoom[]>([]);
  const [editingRoom, setEditingRoom] = useState<number | null>(null);
  const [editingRoomName, setEditingRoomName] = useState('');
  const roomInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [openRooms, setOpenRooms] = useState<Record<number, boolean>>({});

  const [pmOpen, setPmOpen] = useState(false);
  const [pmPerson, setPmPerson] = useState<TeamMember | null>(null);
  const [pmKat, setPmKat] = useState('leadership');

  const [smOpen, setSmOpen] = useState(false);
  const [smSlot, setSmSlot] = useState<ScheduleSlot | null>(null);

  const [bmOpen, setBmOpen] = useState(false);
  const [bmSlot, setBmSlot] = useState<BarcampSlot | null>(null);
  const [bmRoom, setBmRoom] = useState(1);

  const [emOpen, setEmOpen] = useState(false);
  const [cmOpen, setCmOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.from('admin_users').select('id').eq('id', session.user.id).maybeSingle().then(({ data }) => {
          setAuthed(!!data);
          setAuthLoading(false);
        });
      } else {
        setAuthLoading(false);
      }
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginLoading) return;
    setLoginLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPw });
      if (error) throw error;
      const { data: admin } = await supabase.from('admin_users').select('id').eq('id', data.user.id).maybeSingle();
      if (!admin) {
        await supabase.auth.signOut();
        showToast('error', 'Kein Admin-Zugang f\u00FCr dieses Konto.');
        setLoginLoading(false);
        return;
      }
      setAuthed(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fehler';
      showToast('error', `Login fehlgeschlagen: ${msg}`);
    }
    setLoginLoading(false);
  };

  const loadCities = useCallback(async () => {
    const { data } = await supabase
      .from('event_cities')
      .select('*')
      .order('created_at', { ascending: true });
    if (data) {
      setCities(data);
      if (!activeCity && data.length > 0) {
        setActiveCity(data[0]);
      }
    }
  }, [activeCity]);

  useEffect(() => { if (authed) loadCities(); }, [authed, loadCities]);

  const loadCityData = useCallback(async (cityId: string) => {
    setLoading(true);
    const [teamRes, schedRes, bcRes, roomRes] = await Promise.all([
      supabase.from('event_team').select('*').eq('city_id', cityId).order('sort_order'),
      supabase.from('event_schedule').select('*').eq('city_id', cityId).order('sort_order'),
      supabase.from('event_barcamp').select('*').eq('city_id', cityId).order('room').order('sort_order'),
      supabase.from('event_barcamp_rooms').select('*').eq('city_id', cityId).order('room'),
    ]);
    setTeam(teamRes.data || []);
    setSchedule(schedRes.data || []);
    setBarcamp(bcRes.data || []);
    setRoomNames(roomRes.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (activeCity) loadCityData(activeCity.id);
  }, [activeCity, loadCityData]);

  const switchCity = (city: City) => {
    setActiveCity(city);
    setOpenRooms({});
  };

  // ═══ PERSON CRUD ═══
  const openPersonModal = (kat: string, person?: TeamMember) => {
    setPmKat(kat);
    setPmPerson(person || null);
    setPmOpen(true);
  };

  const savePerson = async (data: Omit<TeamMember, 'id' | 'city_id' | 'sort_order'> & { id?: string }) => {
    if (!activeCity) return;
    let error;
    if (data.id) {
      ({ error } = await supabase.from('event_team').update({
        name: data.name, rolle: data.rolle, kategorie: data.kategorie,
        telefon: data.telefon, email: data.email, status: data.status,
        whatsapp: data.whatsapp, notizen: data.notizen, foto_url: data.foto_url,
      }).eq('id', data.id));
    } else {
      const maxOrder = team.reduce((m, t) => Math.max(m, t.sort_order), 0);
      ({ error } = await supabase.from('event_team').insert({
        city_id: activeCity.id, name: data.name, rolle: data.rolle, kategorie: data.kategorie,
        telefon: data.telefon, email: data.email, status: data.status,
        whatsapp: data.whatsapp, notizen: data.notizen, foto_url: data.foto_url,
        sort_order: maxOrder + 1,
      }));
    }
    if (error) { showToast('error', 'Speichern fehlgeschlagen: ' + error.message); return; }
    setPmOpen(false);
    loadCityData(activeCity.id);
  };

  const deletePerson = async (id: string) => {
    if (!activeCity) return;
    const { error } = await supabase.from('event_team').delete().eq('id', id);
    if (error) { showToast('error', 'L\u00F6schen fehlgeschlagen: ' + error.message); return; }
    setPmOpen(false);
    loadCityData(activeCity.id);
  };

  // ═══ SCHEDULE CRUD ═══
  const openScheduleModal = (slot?: ScheduleSlot) => {
    setSmSlot(slot || null);
    setSmOpen(true);
  };

  const saveScheduleSlot = async (data: { id?: string; von: string; bis: string; typ: string; speaker: string; thema: string }) => {
    if (!activeCity) return;
    let error;
    if (data.id) {
      ({ error } = await supabase.from('event_schedule').update({
        von: data.von, bis: data.bis, typ: data.typ,
        speaker: data.speaker, thema: data.thema,
      }).eq('id', data.id));
    } else {
      const maxOrder = schedule.reduce((m, s) => Math.max(m, s.sort_order), 0);
      ({ error } = await supabase.from('event_schedule').insert({
        city_id: activeCity.id, von: data.von, bis: data.bis, typ: data.typ,
        track: 'main', speaker: data.speaker, thema: data.thema,
        sort_order: maxOrder + 1,
      }));
    }
    if (error) { showToast('error', 'Speichern fehlgeschlagen: ' + error.message); return; }
    setSmOpen(false);
    loadCityData(activeCity.id);
  };

  const deleteScheduleSlot = async (id: string) => {
    if (!activeCity) return;
    const { error } = await supabase.from('event_schedule').delete().eq('id', id);
    if (error) { showToast('error', 'L\u00F6schen fehlgeschlagen: ' + error.message); return; }
    setSmOpen(false);
    loadCityData(activeCity.id);
  };

  // ═══ BARCAMP CRUD ═══
  const openBarcampModal = (room: number, slot?: BarcampSlot) => {
    setBmRoom(room);
    setBmSlot(slot || null);
    setBmOpen(true);
  };

  const saveBarcampSlot = async (data: { id?: string; room: number; von: string; bis: string; speaker: string; thema: string; beschreibung: string }) => {
    if (!activeCity) return;
    let error;
    if (data.id) {
      ({ error } = await supabase.from('event_barcamp').update({
        von: data.von, bis: data.bis, speaker: data.speaker,
        thema: data.thema, beschreibung: data.beschreibung,
      }).eq('id', data.id));
    } else {
      const roomSlots = barcamp.filter(b => b.room === data.room);
      const maxOrder = roomSlots.reduce((m, b) => Math.max(m, b.sort_order), 0);
      ({ error } = await supabase.from('event_barcamp').insert({
        city_id: activeCity.id, room: data.room, von: data.von, bis: data.bis,
        speaker: data.speaker, thema: data.thema, beschreibung: data.beschreibung,
        sort_order: maxOrder + 1,
      }));
    }
    if (error) { showToast('error', 'Speichern fehlgeschlagen: ' + error.message); return; }
    setBmOpen(false);
    loadCityData(activeCity.id);
  };

  const deleteBarcampSlot = async (id: string) => {
    if (!activeCity) return;
    const { error } = await supabase.from('event_barcamp').delete().eq('id', id);
    if (error) { showToast('error', 'L\u00F6schen fehlgeschlagen: ' + error.message); return; }
    setBmOpen(false);
    loadCityData(activeCity.id);
  };

  // ═══ ROOM NAME ═══
  const startEditingRoomName = (room: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const existing = roomNames.find(r => r.room === room);
    setEditingRoom(room);
    setEditingRoomName(existing?.name || '');
    setTimeout(() => roomInputRef.current?.focus(), 0);
  };

  const saveRoomName = async (room: number) => {
    if (!activeCity) return;
    let error;
    const existing = roomNames.find(r => r.room === room);
    if (existing) {
      ({ error } = await supabase.from('event_barcamp_rooms').update({ name: editingRoomName.trim() }).eq('id', existing.id));
    } else {
      ({ error } = await supabase.from('event_barcamp_rooms').insert({
        city_id: activeCity.id, room, name: editingRoomName.trim(),
      }));
    }
    if (error) { showToast('error', 'Speichern fehlgeschlagen: ' + error.message); return; }
    setEditingRoom(null);
    loadCityData(activeCity.id);
  };

  // ═══ EVENT TIME ═══
  const saveEventTime = async (data: { event_von: string; event_bis: string; event_datum: string }) => {
    if (!activeCity) return;
    const { error } = await supabase.from('event_cities').update({
      event_von: data.event_von, event_bis: data.event_bis,
      event_datum: data.event_datum || null,
    }).eq('id', activeCity.id);
    if (error) { showToast('error', 'Speichern fehlgeschlagen: ' + error.message); return; }
    setEmOpen(false);
    const updated = { ...activeCity, ...data, event_datum: data.event_datum || null };
    setActiveCity(updated);
    setCities(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  // ═══ ADD CITY ═══
  const addCity = async (data: { slug: string; name: string; event_von: string; event_bis: string; event_datum: string }) => {
    const { data: newCity, error } = await supabase.from('event_cities').insert({
      slug: data.slug, name: data.name, event_von: data.event_von,
      event_bis: data.event_bis, event_datum: data.event_datum || null,
    }).select().maybeSingle();

    if (error) { showToast('error', 'Stadt erstellen fehlgeschlagen: ' + error.message); return; }
    if (!newCity) return;

    const schedInserts = DEFAULT_SCHEDULE.map(s => ({
      city_id: newCity.id, von: s.von, bis: s.bis, typ: s.typ,
      track: 'main', speaker: '', thema: '', sort_order: s.sort_order,
    }));
    await supabase.from('event_schedule').insert(schedInserts);

    const bcInserts = DEFAULT_BARCAMP.map(b => ({
      city_id: newCity.id, room: b.room, von: b.von, bis: b.bis,
      speaker: '', thema: '', beschreibung: '', sort_order: b.sort_order,
    }));
    await supabase.from('event_barcamp').insert(bcInserts);

    const roomInserts = [1, 2, 3].map(r => ({ city_id: newCity.id, room: r, name: '' }));
    await supabase.from('event_barcamp_rooms').insert(roomInserts);

    setCmOpen(false);
    setCities(prev => [...prev, newCity]);
    setActiveCity(newCity);
  };

  // ═══ CSV EXPORT ═══
  const exportCSV = () => {
    if (!activeCity) return;
    let c = '\uFEFF';
    c += 'TEAM\nName;Rolle;Kategorie;Telefon;E-Mail;Status;WhatsApp;Notizen\n';
    team.forEach(p => {
      c += [p.name, p.rolle, p.kategorie, p.telefon, p.email, p.status, p.whatsapp ? 'Ja' : 'Nein', p.notizen]
        .map(v => '"' + (v || '').toString().replace(/"/g, '""') + '"').join(';') + '\n';
    });
    c += '\nHAUPTBÜHNE\nVon;Bis;Typ;Speaker;Thema\n';
    [...schedule].sort((a, b) => a.von.localeCompare(b.von)).forEach(s => {
      c += [s.von, s.bis, s.typ, s.speaker, s.thema]
        .map(v => '"' + (v || '').replace(/"/g, '""') + '"').join(';') + '\n';
    });
    for (let r = 1; r <= 3; r++) {
      const rn = roomNames.find(rm => rm.room === r)?.name;
      c += `\nBARCAMP RAUM ${r}${rn ? ` – ${rn}` : ''}\nVon;Bis;Speaker;Thema;Beschreibung\n`;
      barcamp.filter(b => b.room === r).sort((a, b) => a.von.localeCompare(b.von)).forEach(b => {
        c += [b.von, b.bis, b.speaker, b.thema, b.beschreibung]
          .map(v => '"' + (v || '').replace(/"/g, '""') + '"').join(';') + '\n';
      });
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([c], { type: 'text/csv;charset=utf-8' }));
    a.download = `event-plan-${activeCity.slug}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // ═══ RESET ═══
  const handleReset = async () => {
    if (!activeCity || !confirm('Alle Daten für ' + activeCity.name + ' zurücksetzen? Team-Mitglieder und alle Einträge werden gelöscht.')) return;
    await Promise.all([
      supabase.from('event_team').delete().eq('city_id', activeCity.id),
      supabase.from('event_schedule').delete().eq('city_id', activeCity.id),
      supabase.from('event_barcamp').delete().eq('city_id', activeCity.id),
      supabase.from('event_barcamp_rooms').delete().eq('city_id', activeCity.id),
    ]);
    const schedInserts = DEFAULT_SCHEDULE.map(s => ({
      city_id: activeCity.id, von: s.von, bis: s.bis, typ: s.typ,
      track: 'main', speaker: '', thema: '', sort_order: s.sort_order,
    }));
    await supabase.from('event_schedule').insert(schedInserts);
    const bcInserts = DEFAULT_BARCAMP.map(b => ({
      city_id: activeCity.id, room: b.room, von: b.von, bis: b.bis,
      speaker: '', thema: '', beschreibung: '', sort_order: b.sort_order,
    }));
    await supabase.from('event_barcamp').insert(bcInserts);
    const roomInserts = [1, 2, 3].map(r => ({ city_id: activeCity.id, room: r, name: '' }));
    await supabase.from('event_barcamp_rooms').insert(roomInserts);
    loadCityData(activeCity.id);
  };

  // ═══ HELPERS ═══
  const formatMeta = () => {
    if (!activeCity) return '';
    let t = activeCity.event_von + ' – ' + activeCity.event_bis + ' Uhr';
    if (activeCity.event_datum) {
      t += ' · ' + new Date(activeCity.event_datum + 'T00:00').toLocaleDateString('de-DE', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      });
    }
    return t;
  };

  const leaders = team.filter(p => p.kategorie === 'leadership');
  const nonLeaders = team.filter(p => p.kategorie !== 'leadership');
  const usedCats = [...new Set(nonLeaders.map(p => p.kategorie))];
  const allCats = [...new Set([...usedCats, ...CATS_ALL])];
  const greenCount = team.filter(p => p.status === 'green').length;
  const openCount = team.filter(p => p.status === 'red').length;
  const mainFilled = schedule.filter(s => s.speaker || s.thema).length;
  const bcFilled = barcamp.filter(b => b.speaker || b.thema).length;

  const toggleRoom = (r: number) => {
    setOpenRooms(prev => ({ ...prev, [r]: !prev[r] }));
  };

  const renderPerson = (p: TeamMember) => {
    const c = CAT_COLORS[p.kategorie] || CAT_COLORS.Helfer;
    const ini = p.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const sc = p.status === 'green' ? 'ap-s-green' : p.status === 'yellow' ? 'ap-s-yellow' : 'ap-s-red';
    const dc = 'ap-dot-' + p.status;
    const st = p.status === 'green' ? 'Bestätigt' : p.status === 'yellow' ? 'In Arbeit' : 'Offen';
    return (
      <div key={p.id} className="ap-person" onClick={() => openPersonModal(p.kategorie, p)}>
        <div className="ap-avatar" style={{ background: `linear-gradient(135deg,${c.dot},${c.bg})` }}>
          {p.foto_url ? <img src={p.foto_url} alt={`Profilfoto von ${p.name}`} /> : <span>{ini}</span>}
        </div>
        <div className="ap-p-info">
          <div className="ap-p-name">{p.name}</div>
          <div className="ap-p-role">{p.rolle}</div>
          <div className="ap-p-contact">
            {p.telefon || ''}
            {p.whatsapp && <span className="ap-wa-badge">WhatsApp</span>}
            {p.email && <span> · {p.email}</span>}
          </div>
        </div>
        <span className={`ap-status ${sc}`}>
          <span className={`ap-dot ${dc}`} />
          {st}
        </span>
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="ap-root">
        <div className="ap-loading">
          <div className="ap-spinner" />
          Pr&uuml;fe Zugang...
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="ap-root">
        <div className="ap-wrap" style={{ maxWidth: 400, margin: '80px auto', padding: '0 20px' }}>
          <div className="ap-card" style={{ padding: 32 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div className="ap-eyebrow">The Power of AI</div>
              <h2 style={{ margin: '8px 0 4px' }}>Ablaufplan</h2>
              <p style={{ fontSize: 13, color: 'var(--ap-muted)' }}>Admin-Login erforderlich</p>
            </div>
            <form onSubmit={handleLogin}>
              <label style={{ fontSize: 12, fontWeight: 500 }}>E-Mail</label>
              <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} type="email" required style={{ marginBottom: 10 }} />
              <label style={{ fontSize: 12, fontWeight: 500 }}>Passwort</label>
              <input value={loginPw} onChange={e => setLoginPw(e.target.value)} type="password" required style={{ marginBottom: 16 }} />
              <button type="submit" className="ap-btn ap-btn-pink" disabled={loginLoading} style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <LogIn size={14} />
                {loginLoading ? 'Anmeldung...' : 'Einloggen'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !activeCity) {
    return (
      <div className="ap-root">
        <div className="ap-loading">
          <div className="ap-spinner" />
          Lade Daten...
        </div>
      </div>
    );
  }

  return (
    <div className="ap-root">
      <div className="ap-wrap">

        {/* Back link */}
        <a className="ap-back ap-no-print" onClick={() => { window.location.hash = ''; }}>
          <ArrowLeft size={14} /> Zurück zur Startseite
        </a>

        {/* City Selector */}
        <div className="ap-city-bar ap-no-print">
          {cities.map(c => (
            <button
              key={c.id}
              className={`ap-city-tab ${activeCity?.id === c.id ? 'active' : ''}`}
              onClick={() => switchCity(c)}
            >
              {c.name}
            </button>
          ))}
          <button className="ap-city-add" onClick={() => setCmOpen(true)}>
            <Plus size={12} style={{ marginRight: 4, verticalAlign: -2 }} />
            Neue Stadt
          </button>
        </div>

        {activeCity && (
          <>
            {/* Event Header */}
            <div className="ap-event-head">
              <div>
                <div className="ap-eyebrow">The Power of AI</div>
                <h1>{activeCity.name}</h1>
                <div className="ap-event-meta">{formatMeta()}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }} className="ap-no-print">
                <button className="ap-btn ap-btn-sm" onClick={() => setEmOpen(true)}>Uhrzeit ändern</button>
                <button className="ap-btn ap-btn-sm" onClick={() => window.print()}>
                  <Printer size={12} style={{ marginRight: 4, verticalAlign: -2 }} />Drucken
                </button>
                <button className="ap-btn ap-btn-sm" onClick={exportCSV}>
                  <Download size={12} style={{ marginRight: 4, verticalAlign: -2 }} />CSV Export
                </button>
                <button className="ap-btn ap-btn-sm ap-btn-del" onClick={handleReset}>
                  <RotateCcw size={12} style={{ marginRight: 4, verticalAlign: -2 }} />Reset
                </button>
              </div>
            </div>

            {loading ? (
              <div className="ap-loading">
                <div className="ap-spinner" />
                Lade Daten...
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="ap-summary">
                  <div className="ap-sum-card">
                    <div className="ap-sum-num">{leaders.length}</div>
                    <div className="ap-sum-label">Leitung</div>
                  </div>
                  <div className="ap-sum-card">
                    <div className="ap-sum-num">{nonLeaders.length}</div>
                    <div className="ap-sum-label">Team</div>
                  </div>
                  <div className="ap-sum-card">
                    <div className="ap-sum-num" style={{ color: 'var(--ap-teal)' }}>{greenCount}</div>
                    <div className="ap-sum-label">Bestätigt</div>
                  </div>
                  <div className="ap-sum-card">
                    <div className="ap-sum-num" style={{ color: openCount > 0 ? 'var(--ap-red)' : 'var(--ap-teal)' }}>{openCount}</div>
                    <div className="ap-sum-label">Offen</div>
                  </div>
                  <div className="ap-sum-card">
                    <div className="ap-sum-num">{mainFilled + bcFilled}/{schedule.length + barcamp.length}</div>
                    <div className="ap-sum-label">Programm</div>
                  </div>
                </div>

                {/* Kern-Leitung */}
                <div className="ap-card">
                  <div className="ap-section-label">Kern-Leitung</div>
                  {leaders.map(renderPerson)}
                  <button className="ap-btn ap-btn-add ap-btn-sm ap-no-print" onClick={() => openPersonModal('leadership')}>+ Leitung hinzufügen</button>
                </div>

                {/* Team & Dienstleister */}
                <div className="ap-card">
                  <div className="ap-section-label">Team &amp; Dienstleister</div>
                  {allCats.map(cat => {
                    const pp = team.filter(p => p.kategorie === cat);
                    const c = CAT_COLORS[cat] || CAT_COLORS.Helfer;
                    const conf = pp.filter(p => p.status === 'green').length;
                    return (
                      <div key={cat} className="ap-cat-block">
                        <div className="ap-cat-head">
                          <span className="ap-cat-dot" style={{ background: c.dot }} />
                          <span className="ap-cat-title">{cat}</span>
                          <span className="ap-cat-count">
                            {pp.length > 0 ? `${conf}/${pp.length} bestätigt` : 'leer'}
                          </span>
                        </div>
                        {pp.length > 0 ? pp.map(renderPerson) : (
                          <div className="ap-empty-slot" onClick={() => openPersonModal(cat)}>
                            <div className="ap-empty-mark">+</div>
                            <div>Person zuweisen</div>
                          </div>
                        )}
                        <button className="ap-btn ap-btn-add ap-btn-sm ap-no-print" onClick={() => openPersonModal(cat)} style={{ marginTop: 4 }}>+ {cat}</button>
                      </div>
                    );
                  })}
                </div>

                {/* Ablaufplan Hauptbuehne */}
                <div className="ap-card">
                  <div className="ap-section-label">Ablaufplan · Hauptbühne</div>
                  {[...schedule].sort((a, b) => a.von.localeCompare(b.von)).map(s => {
                    const sc = SCHEDULE_COLORS[s.typ] || SCHEDULE_COLORS['Speaker'];
                    const filled = s.speaker || s.thema;
                    return (
                      <div key={s.id} className="ap-sched-row" onClick={() => openScheduleModal(s)}>
                        <div className="ap-time-col">{s.von} – {s.bis}</div>
                        <span className="ap-type-pill" style={{ background: sc.bg, color: sc.fg }}>{s.typ}</span>
                        <div className="ap-sched-content">
                          {filled ? (
                            <>
                              <div className="ap-sched-name">{s.speaker}</div>
                              <div className="ap-sched-topic">{s.thema}</div>
                            </>
                          ) : (
                            <div className="ap-sched-free">Frei — klicken zum Befüllen</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <button className="ap-btn ap-btn-add ap-btn-sm ap-no-print" onClick={() => openScheduleModal()}>+ Hauptbühne Slot</button>
                </div>

                {/* Barcamp Raeume */}
                <div className="ap-card">
                  <div className="ap-section-label">Barcamp-Räume · Zeitgleich</div>
                  <div className="ap-bc-grid">
                    {[1, 2, 3].map(r => {
                      const slots = barcamp.filter(b => b.room === r).sort((a, b) => a.von.localeCompare(b.von));
                      const filled = slots.filter(s => s.speaker || s.thema).length;
                      const isOpen = openRooms[r] || false;
                      const rName = roomNames.find(rm => rm.room === r)?.name || '';
                      const isEditing = editingRoom === r;
                      return (
                        <div key={r} className={`ap-bc-room ${isOpen ? 'open' : ''}`}>
                          <div className="ap-bc-room-head" onClick={() => toggleRoom(r)}>
                            <div className="ap-bc-room-num">{r}</div>
                            <div className="ap-bc-room-title">
                              {isEditing ? (
                                <span className="ap-bc-room-edit" onClick={e => e.stopPropagation()}>
                                  <input
                                    ref={roomInputRef}
                                    className="ap-bc-room-input"
                                    value={editingRoomName}
                                    onChange={e => setEditingRoomName(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') saveRoomName(r); if (e.key === 'Escape') setEditingRoom(null); }}
                                    placeholder="Raumname..."
                                  />
                                  <button className="ap-bc-room-save" onClick={() => saveRoomName(r)}><Check size={12} /></button>
                                </span>
                              ) : (
                                <>
                                  Raum {r}
                                  {rName && <span className="ap-bc-room-name"> — {rName}</span>}
                                  <span style={{ fontWeight: 400, color: 'var(--ap-muted)', fontSize: 10 }}> ({filled}/{slots.length})</span>
                                  <button className="ap-bc-name-btn ap-no-print" onClick={e => startEditingRoomName(r, e)} title="Raum benennen">
                                    <Pencil size={10} />
                                  </button>
                                </>
                              )}
                            </div>
                            <ChevronDown size={14} className="ap-bc-room-arrow" />
                          </div>
                          <div className="ap-bc-room-body">
                            {slots.length === 0 ? (
                              <div className="ap-bc-free" onClick={() => openBarcampModal(r)}>+ Slot hinzufügen</div>
                            ) : (
                              <>
                                {slots.map(s => {
                                  const f = s.speaker || s.thema;
                                  return (
                                    <div key={s.id} className="ap-bc-slot" onClick={() => openBarcampModal(r, s)}>
                                      <div className="ap-bc-time">{s.von} – {s.bis}</div>
                                      {f ? (
                                        <>
                                          <div className="ap-bc-speaker">{s.speaker}</div>
                                          <div className="ap-bc-thema">{s.thema}</div>
                                          {s.beschreibung && (
                                            <div style={{ fontSize: 10, color: 'var(--ap-muted)', marginTop: 2, lineHeight: 1.4 }}>{s.beschreibung}</div>
                                          )}
                                        </>
                                      ) : (
                                        <div className="ap-bc-free">Frei — klicken</div>
                                      )}
                                    </div>
                                  );
                                })}
                                <div className="ap-bc-free" onClick={() => openBarcampModal(r)} style={{ textAlign: 'center', marginTop: 4 }}>+ Slot</div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <PersonModal
        open={pmOpen}
        person={pmPerson}
        defaultKategorie={pmKat}
        onClose={() => setPmOpen(false)}
        onSave={savePerson}
        onDelete={deletePerson}
      />
      <ScheduleModal
        open={smOpen}
        slot={smSlot}
        onClose={() => setSmOpen(false)}
        onSave={saveScheduleSlot}
        onDelete={deleteScheduleSlot}
      />
      <BarcampModal
        open={bmOpen}
        slot={bmSlot}
        room={bmRoom}
        onClose={() => setBmOpen(false)}
        onSave={saveBarcampSlot}
        onDelete={deleteBarcampSlot}
      />
      <EventModal
        open={emOpen}
        city={activeCity}
        onClose={() => setEmOpen(false)}
        onSave={saveEventTime}
      />
      <CityModal
        open={cmOpen}
        onClose={() => setCmOpen(false)}
        onSave={addCity}
      />
    </div>
  );
}
