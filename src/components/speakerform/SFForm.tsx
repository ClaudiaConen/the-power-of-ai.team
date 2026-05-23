import { useState, useRef, useMemo, useEffect } from 'react';
import { Upload, FileText, Film, X } from 'lucide-react';
import SFAccordion from './SFAccordion';
import SFPackageSelect, { calcGesamtpreis } from './SFPackageSelect';
import type { UpgradeState, CouponStatus } from './SFPackageSelect';
import SFSuccessPopup from './SFSuccessPopup';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';

interface FormData {
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  unternehmen: string;
  quelle: string;
  kontaktperson: string;
  quelle_sonstiges: string;
  titel: string;
  beschreibung: string;
  kernbotschaft: string;
  anmoderation: string;
  stadt: string;
  link1: string;
  link2: string;
  link3: string;
  r_firma: string;
  r_strasse: string;
  r_plz: string;
  r_stadt: string;
  r_ustid: string;
  consent_foto: boolean;
  consent_werbung: boolean;
  consent_urheber: boolean;
  consent_content: boolean;
  consent_dsgvo: boolean;
}

const INITIAL: FormData = {
  vorname: '', nachname: '', email: '', telefon: '', unternehmen: '',
  quelle: '', kontaktperson: '', quelle_sonstiges: '',
  titel: '', beschreibung: '', kernbotschaft: '', anmoderation: '', stadt: '',
  link1: '', link2: '', link3: '',
  r_firma: '', r_strasse: '', r_plz: '', r_stadt: '', r_ustid: '',
  consent_foto: false, consent_werbung: false, consent_urheber: false,
  consent_content: false, consent_dsgvo: false,
};

const INITIAL_UPGRADES: UpgradeState = {
  keynote15: false,
  keynote25: false,
  barcamp_room: false,
  stage7: false,
  shooting: false,
  workshop: false,
  coaching: false,
};

const QUELLE_OPTIONS = [
  { value: '', label: 'Bitte w\u00E4hlen...' },
  { value: 'skool', label: 'Skool Community' },
  { value: 'social', label: 'Social Media (Instagram, LinkedIn, Facebook, TikTok)' },
  { value: 'empfehlung', label: 'Empfehlung von jemandem' },
  { value: 'google', label: 'Google / Websuche' },
  { value: 'podcast', label: 'Podcast oder YouTube' },
  { value: 'event', label: 'Vorheriges Event besucht' },
  { value: 'sonstiges', label: 'Sonstiges' },
];


export default function SFForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [upgrades, setUpgrades] = useState<UpgradeState>(INITIAL_UPGRADES);
  const [openBlock, setOpenBlock] = useState(0);
  const [foto, setFoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fotoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const [successOpen, setSuccessOpen] = useState(false);
  const [successName, setSuccessName] = useState('');

  const [uploadProgress, setUploadProgress] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponStatus, setCouponStatus] = useState<CouponStatus>('idle');
  const [couponMessage, setCouponMessage] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    const qIdx = hash.indexOf('?');
    if (qIdx === -1) return;
    const params = new URLSearchParams(hash.slice(qIdx));
    if (params.get('stage7') === '1') {
      setUpgrades((prev) => ({ ...prev, stage7: true }));
      setOpenBlock(3);
    }
  }, []);

  const set = (key: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleBlock = (i: number) => setOpenBlock(openBlock === i ? -1 : i);

  const hasUpgrades = Object.values(upgrades).some(Boolean);
  const gesamtNetto = useMemo(() => calcGesamtpreis(upgrades), [upgrades]);
  const effectiveDiscount = Math.min(couponDiscount, gesamtNetto);
  const finalNetto = gesamtNetto - effectiveDiscount;

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) return;
    setCouponStatus('loading');
    setCouponMessage('');
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-coupon`;
      const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      if (!resp.ok) throw new Error('validation failed');
      const result = await resp.json();
      if (result?.valid) {
        setCouponDiscount(Number(result.discount_value));
        setCouponStatus('valid');
        setCouponMessage(result.message);
      } else {
        setCouponDiscount(0);
        setCouponStatus('invalid');
        setCouponMessage(result?.message || 'Ung\u00FCltiger Gutscheincode.');
      }
    } catch {
      setCouponDiscount(0);
      setCouponStatus('invalid');
      setCouponMessage('Fehler bei der Pr\u00FCfung. Bitte versuche es erneut.');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponStatus('idle');
    setCouponMessage('');
  };

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic', 'image/heif', 'image/webp'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ['jpg', 'jpeg', 'png', 'heic', 'heif', 'webp'];
    if (!allowed.includes(file.type) && !allowedExts.includes(ext || '')) {
      showToast('error', 'Nur JPG, PNG, HEIC oder WebP erlaubt.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'Foto darf maximal 10 MB gro\u00DF sein.');
      return;
    }
    setFoto(file);
  };

  const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['video/mp4', 'video/quicktime', 'audio/mpeg', 'audio/mp3', 'audio/mp4', 'video/3gpp', 'video/x-m4v'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ['mp4', 'mov', 'mp3', 'm4a', 'm4v', '3gp'];
    if (!allowed.includes(file.type) && !allowedExts.includes(ext || '')) {
      showToast('error', 'Nur MP4, MOV oder MP3 erlaubt.');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      showToast('error', 'Video darf maximal 100 MB gro\u00DF sein.');
      return;
    }
    setVideo(file);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const nameParts = file.name.split('.');
    const ext = nameParts.length > 1 ? nameParts.pop()!.toLowerCase() : (file.type.split('/')[1] || 'bin');
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('speaker-uploads').upload(path, file, {
      contentType: file.type,
      cacheControl: '3600',
    });
    if (error) throw error;
    const { data } = supabase.storage.from('speaker-uploads').getPublicUrl(path);
    return data.publicUrl;
  };

  const deriveFormat = (): string => {
    if (upgrades.stage7) return '7stage';
    if (upgrades.keynote25) return 'keynote25';
    if (upgrades.keynote15) return 'keynote15';
    if (upgrades.barcamp_room) return 'barcamp';
    return 'pitch3';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const required: (keyof FormData)[] = [
      'vorname', 'nachname', 'email', 'unternehmen', 'quelle',
      'titel', 'beschreibung', 'kernbotschaft', 'stadt',
      'r_firma', 'r_strasse', 'r_plz', 'r_stadt',
    ];
    for (const key of required) {
      if (!form[key]) {
        showToast('error', 'Bitte f\u00FClle alle Pflichtfelder aus.');
        return;
      }
    }

    if (!form.consent_foto || !form.consent_werbung || !form.consent_urheber || !form.consent_content || !form.consent_dsgvo) {
      showToast('error', 'Bitte best\u00E4tige alle Einverst\u00E4ndniserkl\u00E4rungen.');
      return;
    }

    if (form.titel.length > 80 || form.beschreibung.length > 500 || form.kernbotschaft.length > 140 || form.anmoderation.length > 350) {
      showToast('error', 'Bitte halte die Zeichenlimits ein.');
      return;
    }

    setSubmitting(true);

    try {
      const dupUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-speaker-duplicate`;
      const dupResp = await fetch(dupUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: form.email, stadt: form.stadt }),
      });
      const dupJson = dupResp.ok ? await dupResp.json() : { exists: false };
      if (dupJson?.exists) {
        showToast('error', 'F\u00FCr diese E-Mail und Stadt liegt bereits eine Anmeldung vor.');
        setSubmitting(false);
        return;
      }
    } catch {
      // proceed
    }

    try {
      let foto_url = '';
      let video_url = '';

      if (foto) {
        setUploadProgress('Foto wird hochgeladen...');
        foto_url = await uploadFile(foto, 'fotos');
      }
      if (video) {
        setUploadProgress('Video wird hochgeladen... (das kann bei gr\u00F6\u00DFeren Dateien etwas dauern)');
        video_url = await uploadFile(video, 'videos');
      }
      setUploadProgress('Daten werden gespeichert...');

      const appliedDiscount = couponStatus === 'valid' ? effectiveDiscount : 0;
      const preis = finalNetto;

      const { error } = await supabase.from('speakers').insert({
        vorname: form.vorname,
        nachname: form.nachname,
        email: form.email,
        telefon: form.telefon,
        unternehmen: form.unternehmen,
        quelle: form.quelle,
        kontaktperson: form.kontaktperson,
        quelle_sonstiges: form.quelle_sonstiges,
        foto_url,
        video_url,
        titel: form.titel,
        beschreibung: form.beschreibung,
        kernbotschaft: form.kernbotschaft,
        anmoderation: form.anmoderation,
        format: deriveFormat(),
        stadt: form.stadt,
        link1: form.link1,
        link2: form.link2,
        link3: form.link3,
        r_firma: form.r_firma,
        r_strasse: form.r_strasse,
        r_plz: form.r_plz,
        r_stadt: form.r_stadt,
        r_ustid: form.r_ustid,
        upgrade_keynote15: upgrades.keynote15,
        upgrade_keynote25: upgrades.keynote25,
        upgrade_barcamp_room: upgrades.barcamp_room,
        upgrade_7stage: upgrades.stage7,
        upgrade_shooting: upgrades.shooting,
        upgrade_workshop: upgrades.workshop,
        upgrade_coaching: upgrades.coaching,
        gesamtpreis_netto: preis,
        gutscheincode: couponStatus === 'valid' ? couponCode.trim().toUpperCase() : '',
        rabatt_netto: appliedDiscount,
        consent_foto: form.consent_foto,
        consent_werbung: form.consent_werbung,
        consent_urheber: form.consent_urheber,
        consent_content: form.consent_content,
        consent_dsgvo: form.consent_dsgvo,
      });

      if (error) {
        if (error.code === '23505') {
          showToast('error', 'F\u00FCr diese E-Mail und Stadt liegt bereits eine Anmeldung vor.');
        } else {
          throw error;
        }
        setSubmitting(false);
        return;
      }

      try {
        const notifyUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-speaker-notification`;
        await fetch(notifyUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vorname: form.vorname,
            nachname: form.nachname,
            email: form.email,
            telefon: form.telefon,
            unternehmen: form.unternehmen,
            stadt: form.stadt,
            format: deriveFormat(),
            gesamtpreis_netto: preis,
            rabatt_netto: appliedDiscount,
            gutscheincode: couponStatus === 'valid' ? couponCode.trim().toUpperCase() : '',
          }),
        });
      } catch {
        // swallowed – booking is persisted regardless of mail delivery
      }

      if (couponStatus === 'valid' && couponCode.trim()) {
        const redeemUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/redeem-coupon`;
        await fetch(redeemUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: couponCode.trim() }),
        }).catch(() => {});
      }

      setUploadProgress('');
      setSuccessName(form.vorname);
      setSuccessOpen(true);
      setForm(INITIAL);
      setUpgrades(INITIAL_UPGRADES);
      setFoto(null);
      setVideo(null);
      setOpenBlock(0);
      handleRemoveCoupon();
    } catch {
      setUploadProgress('');
      showToast('error', 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    }

    setSubmitting(false);
  };

  const btnText = submitting
    ? (uploadProgress || 'Wird gesendet...')
    : hasUpgrades || (couponStatus === 'valid' && effectiveDiscount > 0)
      ? `Jetzt buchen & anmelden \u2014 ${finalNetto.toLocaleString('de-DE')} \u20AC zzgl. MwSt.`
      : 'Speaker-Anmeldung absenden';

  return (
    <>
    <SFSuccessPopup open={successOpen} onClose={() => setSuccessOpen(false)} vorname={successName} />
    <form className="sf-card sf-form" onSubmit={handleSubmit} noValidate>
      <h2 className="sf-form-title">Deine Anmeldung</h2>

      <SFAccordion title={"Pers\u00F6nliche Anmeldung"} index={0} isOpen={openBlock === 0} onToggle={toggleBlock}>
        <div className="sf-row">
          <div className="sf-field">
            <label className="sf-label">Vorname *</label>
            <input className="sf-input" type="text" value={form.vorname} onChange={(e) => set('vorname', e.target.value)} required maxLength={100} />
          </div>
          <div className="sf-field">
            <label className="sf-label">Nachname *</label>
            <input className="sf-input" type="text" value={form.nachname} onChange={(e) => set('nachname', e.target.value)} required maxLength={100} />
          </div>
        </div>
        <div className="sf-row">
          <div className="sf-field">
            <label className="sf-label">E-Mail *</label>
            <input className="sf-input" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required maxLength={254} />
          </div>
          <div className="sf-field">
            <label className="sf-label">Telefon <span className="sf-optional">(F&uuml;r kurzfristige R&uuml;ckfragen)</span></label>
            <input className="sf-input" type="tel" value={form.telefon} onChange={(e) => set('telefon', e.target.value)} maxLength={30} />
          </div>
        </div>
        <div className="sf-field">
          <label className="sf-label">Unternehmen / Marke / Selbstst&auml;ndig als... *</label>
          <input className="sf-input" type="text" placeholder="z.&nbsp;B. Conen Consulting &middot; Pitch-Trainerin" value={form.unternehmen} onChange={(e) => set('unternehmen', e.target.value)} required maxLength={200} />
        </div>

        <div className="sf-divider-gradient" />

        <p className="sf-section-subtitle-main">Wie bist du auf uns aufmerksam geworden?</p>
        <p className="sf-section-subtitle-hint">Hilft uns, besser zu werden — und deinen Kontakt zu w&uuml;rdigen.</p>

        <div className="sf-field">
          <select className="sf-input sf-select" value={form.quelle} onChange={(e) => set('quelle', e.target.value)} required>
            {QUELLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className={`sf-slide-field${form.quelle === 'empfehlung' ? ' sf-slide-field--visible' : ''}`}>
          <div className="sf-field">
            <label className="sf-label">Wer hat dich empfohlen? Dein/e Kontaktperson</label>
            <input className="sf-input" type="text" placeholder="Vor- und Nachname deiner Kontaktperson" value={form.kontaktperson} onChange={(e) => set('kontaktperson', e.target.value)} maxLength={200} />
            <p className="sf-field-hint">Falls deine Kontaktperson bei uns registriert ist, wird sie automatisch zugeordnet.</p>
          </div>
        </div>

        <div className={`sf-slide-field${form.quelle === 'sonstiges' ? ' sf-slide-field--visible' : ''}`}>
          <div className="sf-field">
            <input className="sf-input" type="text" placeholder="Erz&auml;hl uns kurz, wie du uns gefunden hast" value={form.quelle_sonstiges} onChange={(e) => set('quelle_sonstiges', e.target.value)} maxLength={300} />
          </div>
        </div>
      </SFAccordion>

      <SFAccordion title="Profilbild & Video-Intro" index={1} isOpen={openBlock === 1} onToggle={toggleBlock}>
        <div className="sf-row">
          <div className="sf-upload-zone" onClick={() => fotoRef.current?.click()}>
            <input ref={fotoRef} type="file" accept="image/jpeg,image/png,image/heic,image/heif,image/webp,.jpg,.jpeg,.png,.heic,.heif,.webp" onChange={handleFoto} style={{ display: 'none' }} />
            {foto ? (
              <div className="sf-upload-preview">
                <FileText size={20} />
                <span>{foto.name}</span>
                <span className="sf-upload-size">{formatBytes(foto.size)}</span>
                <button type="button" className="sf-upload-remove" onClick={(e) => { e.stopPropagation(); setFoto(null); }}><X size={14} /></button>
              </div>
            ) : (
              <>
                <Upload size={24} />
                <span className="sf-upload-label">Profilfoto hochladen</span>
                <span className="sf-upload-hint">Mind. 1200&times;1200px &middot; JPG/PNG &middot; max. 10 MB</span>
              </>
            )}
          </div>
          <div className="sf-upload-zone" onClick={() => videoRef.current?.click()}>
            <input ref={videoRef} type="file" accept="video/mp4,video/quicktime,audio/mpeg,audio/mp3,.mp4,.mov,.mp3,.m4a,.m4v" onChange={handleVideo} style={{ display: 'none' }} />
            {video ? (
              <div className="sf-upload-preview">
                <Film size={20} />
                <span>{video.name}</span>
                <span className="sf-upload-size">{formatBytes(video.size)}</span>
                <button type="button" className="sf-upload-remove" onClick={(e) => { e.stopPropagation(); setVideo(null); }}><X size={14} /></button>
              </div>
            ) : (
              <>
                <Film size={24} />
                <span className="sf-upload-label">Video-Intro hochladen</span>
                <span className="sf-upload-hint">Max. 60 Sek. &middot; MP4/MOV/MP3 &middot; max. 100 MB &middot; empfohlen 9:16</span>
              </>
            )}
          </div>
        </div>
        <p className="sf-tip">Stell dich in 60 Sekunden vor — Wer bist du? Was ist dein Thema? Warum sollte man dich live erleben?</p>
      </SFAccordion>

      <SFAccordion title="Dein Auftritt" index={2} isOpen={openBlock === 2} onToggle={toggleBlock}>
        <div className="sf-field">
          <label className="sf-label">
            Vortragstitel *
            <span className={`sf-char-counter${form.titel.length > 80 ? ' sf-char-counter--over' : ''}`}>{form.titel.length} / 80</span>
          </label>
          <input className="sf-input" type="text" placeholder="Der Titel deines Vortrags" value={form.titel} onChange={(e) => set('titel', e.target.value)} required maxLength={100} />
        </div>
        <div className="sf-field">
          <label className="sf-label">
            Kurzbeschreibung *
            <span className={`sf-char-counter${form.beschreibung.length > 500 ? ' sf-char-counter--over' : ''}`}>{form.beschreibung.length} / 500</span>
          </label>
          <textarea className="sf-input sf-textarea" placeholder="Worum geht es? Was nimmt das Publikum mit?" value={form.beschreibung} onChange={(e) => set('beschreibung', e.target.value)} required rows={5} maxLength={600} />
        </div>
        <div className="sf-field">
          <label className="sf-label">
            Kernbotschaft *
            <span className={`sf-char-counter${form.kernbotschaft.length > 140 ? ' sf-char-counter--over' : ''}`}>{form.kernbotschaft.length} / 140</span>
          </label>
          <input className="sf-input" type="text" placeholder="Dein Satz f&uuml;r Social Media — kurz, klar, merkbar" value={form.kernbotschaft} onChange={(e) => set('kernbotschaft', e.target.value)} required maxLength={160} />
        </div>
        <div className="sf-field">
          <label className="sf-label">
            Deine Anmoderation
            <span className={`sf-char-counter${form.anmoderation.length > 350 ? ' sf-char-counter--over' : ''}`}>{form.anmoderation.length} / 350</span>
          </label>
          <textarea className="sf-input sf-textarea" placeholder="Schreibe hier deine pers&ouml;nliche Anmoderation — so wirst du auf der B&uuml;hne vorgestellt." value={form.anmoderation} onChange={(e) => set('anmoderation', e.target.value)} rows={4} maxLength={370} />
        </div>
        <div className="sf-field">
          <label className="sf-label">Event-Stadt *</label>
          <input className="sf-input" type="text" placeholder="z. B. K&ouml;ln, M&uuml;nchen, Hamburg..." value={form.stadt} onChange={(e) => set('stadt', e.target.value)} required maxLength={100} />
          <p className="sf-field-hint">Das Format w&auml;hlst du im n&auml;chsten Schritt.</p>
        </div>
      </SFAccordion>

      <SFAccordion title="Dein Paket & Upgrades" index={3} isOpen={openBlock === 3} onToggle={toggleBlock}>
        <SFPackageSelect
          upgrades={upgrades}
          onChange={setUpgrades}
          couponCode={couponCode}
          couponDiscount={couponStatus === 'valid' ? couponDiscount : 0}
          couponStatus={couponStatus}
          couponMessage={couponMessage}
          onCouponCodeChange={setCouponCode}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
        />
      </SFAccordion>

      <SFAccordion title="Deine 3 Links" index={4} isOpen={openBlock === 4} onToggle={toggleBlock}>
        <div className="sf-field">
          <label className="sf-label">Link 1</label>
          <input className="sf-input" type="url" placeholder="z.&nbsp;B. linkedin.com/in/deinprofil" value={form.link1} onChange={(e) => set('link1', e.target.value)} />
        </div>
        <div className="sf-field">
          <label className="sf-label">Link 2</label>
          <input className="sf-input" type="url" placeholder="z.&nbsp;B. deine-website.de" value={form.link2} onChange={(e) => set('link2', e.target.value)} />
        </div>
        <div className="sf-field">
          <label className="sf-label">Link 3</label>
          <input className="sf-input" type="url" placeholder="z.&nbsp;B. instagram.com/deinprofil" value={form.link3} onChange={(e) => set('link3', e.target.value)} />
        </div>
      </SFAccordion>

      <SFAccordion title="Rechnungsadresse" index={5} isOpen={openBlock === 5} onToggle={toggleBlock}>
        <div className="sf-field">
          <label className="sf-label">Firma / Name *</label>
          <input className="sf-input" type="text" value={form.r_firma} onChange={(e) => set('r_firma', e.target.value)} required maxLength={200} />
        </div>
        <div className="sf-field">
          <label className="sf-label">Stra&szlig;e + Nr. *</label>
          <input className="sf-input" type="text" value={form.r_strasse} onChange={(e) => set('r_strasse', e.target.value)} required maxLength={200} />
        </div>
        <div className="sf-row">
          <div className="sf-field" style={{ flex: '0 0 120px' }}>
            <label className="sf-label">PLZ *</label>
            <input className="sf-input" type="text" value={form.r_plz} onChange={(e) => set('r_plz', e.target.value)} required maxLength={10} />
          </div>
          <div className="sf-field">
            <label className="sf-label">Stadt *</label>
            <input className="sf-input" type="text" value={form.r_stadt} onChange={(e) => set('r_stadt', e.target.value)} required maxLength={100} />
          </div>
        </div>
        <div className="sf-field">
          <label className="sf-label">USt-IdNr. <span className="sf-optional">(optional)</span></label>
          <input className="sf-input" type="text" placeholder="DE123456789" value={form.r_ustid} onChange={(e) => set('r_ustid', e.target.value)} maxLength={30} />
          <p className="sf-field-hint">Bei Angabe einer g&uuml;ltigen Umsatzsteuer-Identifikationsnummer wird die Rechnung netto ausgestellt. Die Abrechnung erfolgt im Reverse-Charge-Verfahren.</p>
        </div>
      </SFAccordion>

      <SFAccordion title={"Einverst\u00E4ndniserkl\u00E4rungen"} index={6} isOpen={openBlock === 6} onToggle={toggleBlock}>
        <label className="sf-consent">
          <input type="checkbox" checked={form.consent_foto} onChange={(e) => set('consent_foto', e.target.checked)} />
          <span><strong>Foto- &amp; Videoaufnahmen.</strong> Ich bin damit einverstanden, dass ich w&auml;hrend des Events fotografiert und gefilmt werde — auf der B&uuml;hne, am Stand und beim Networking.</span>
        </label>
        <label className="sf-consent">
          <input type="checkbox" checked={form.consent_werbung} onChange={(e) => set('consent_werbung', e.target.checked)} />
          <span><strong>Nutzung zu Werbezwecken.</strong> Ich bin damit einverstanden, dass mein Foto, mein Name, mein Video-Intro, meine Kurzbeschreibung und Aufnahmen meines Auftritts vom Veranstalter zu Werbezwecken verwendet werden d&uuml;rfen — auf der Website, in Social Media, im Business Book, auf YouTube und in der Skool Community.</span>
        </label>
        <label className="sf-consent">
          <input type="checkbox" checked={form.consent_urheber} onChange={(e) => set('consent_urheber', e.target.checked)} />
          <span><strong>Urheberrecht.</strong> Ich best&auml;tige, dass ich die Rechte an allen hochgeladenen Materialien (Foto, Video, Texte) besitze und diese zur Ver&ouml;ffentlichung freigebe.</span>
        </label>
        <label className="sf-consent">
          <input type="checkbox" checked={form.consent_content} onChange={(e) => set('consent_content', e.target.checked)} />
          <span><strong>Content Policy.</strong> Ich best&auml;tige, dass mein Vortrag frei ist von diskriminierenden, rassistischen, sexistischen, gewaltverherrlichenden oder politisch extremen Inhalten. The Power of AI steht f&uuml;r Vielfalt, Respekt und konstruktiven Austausch. Der Veranstalter beh&auml;lt sich vor, Beitr&auml;ge abzulehnen oder Slots zu widerrufen, die gegen diese Grunds&auml;tze versto&szlig;en.</span>
        </label>
        <label className="sf-consent">
          <input type="checkbox" checked={form.consent_dsgvo} onChange={(e) => set('consent_dsgvo', e.target.checked)} />
          <span><strong>Datenschutz &amp; AGB.</strong> Ich habe die Datenschutzerkl&auml;rung und die AGB gelesen und bin einverstanden.</span>
        </label>
      </SFAccordion>

      <div className="sf-submit-area">
        <p className="sf-submit-hint">
          Nach dem Absenden erhältst du eine Bestätigungsmail mit deinen Angaben und deiner Buchungsübersicht.
        </p>
        <button type="submit" className="sf-submit-btn" disabled={submitting}>
          <span className="sf-submit-btn-glow" />
          {btnText}
        </button>
        <p className="sf-submit-small">Alle Pflichtfelder (*) m&uuml;ssen ausgef&uuml;llt und alle Einverst&auml;ndniserkl&auml;rungen best&auml;tigt sein.</p>
        <p className="sf-submit-small">Dein Basis-Paket (3 Min Pitch + Stehtisch + Rollup + Barcamp) ist in jedem Paket enthalten.</p>
      </div>
    </form>
    </>
  );
}
