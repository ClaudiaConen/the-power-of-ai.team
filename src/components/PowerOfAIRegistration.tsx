import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, CalendarDays, MapPin, Users, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SignaturePad from './SignaturePad';
import heroImg from '../assets/the-power-of-ai.jpeg';
const teamImg = '/Vorschau_Bild_1280x680_(1).jpg';

type FormState = 'idle' | 'sending' | 'error';

export default function PowerOfAIRegistration() {
  const formRef = useRef<HTMLFormElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  const [offerNumber, setOfferNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [street, setStreet] = useState('');
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vatId, setVatId] = useState('');
  const [confirmBinding, setConfirmBinding] = useState(false);
  const [confirmCancellation, setConfirmCancellation] = useState(false);
  const [confirmMedia, setConfirmMedia] = useState(false);
  const [locationDate, setLocationDate] = useState('');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const validate = (): string | null => {
    if (!offerNumber.trim()) return 'Bitte trage deine Angebotsnummer ein.';
    if (!fullName.trim()) return 'Bitte trage deinen vollständigen Namen ein.';
    if (!street.trim() || !zip.trim() || !city.trim()) return 'Bitte trage deine vollständige Rechnungsadresse ein.';
    if (!email.trim() || !email.includes('@')) return 'Bitte trage eine gültige E-Mail-Adresse ein.';
    if (!phone.trim()) return 'Bitte trage deine Telefonnummer ein.';
    if (!confirmBinding) return 'Bitte bestätige die verbindliche Angebotsannahme.';
    if (!confirmCancellation) return 'Bitte akzeptiere die Stornobedingungen.';
    if (!confirmMedia) return 'Bitte gib dein Einverständnis für Foto- und Videoaufnahmen.';
    if (!locationDate.trim()) return 'Bitte trage Ort und Datum ein.';
    if (!signatureData) return 'Bitte unterschreibe im Unterschriftenfeld.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setErrorMsg(err);
      setFormState('error');
      setTimeout(() => setFormState('idle'), 4000);
      return;
    }

    setFormState('sending');
    setErrorMsg('');

    try {
      const billingAddress = `${street.trim()}, ${zip.trim()} ${city.trim()}`;
      const fullOfferNumber = offerNumber.trim().startsWith('ANG-')
        ? offerNumber.trim()
        : `ANG-2026-${offerNumber.trim()}`;

      const { error } = await supabase
        .from('event_registrations')
        .insert({
          offer_number: fullOfferNumber,
          full_name: fullName.trim(),
          company: company.trim(),
          billing_address: billingAddress,
          email: email.trim(),
          phone: phone.trim(),
          vat_id: vatId.trim(),
          confirm_binding: confirmBinding,
          confirm_cancellation: confirmCancellation,
          confirm_media: confirmMedia,
          signature_data: signatureData,
          signature_location_date: locationDate.trim(),
        });

      if (error) throw error;

      fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-registration-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offer_number: fullOfferNumber,
          full_name: fullName.trim(),
          company: company.trim(),
          billing_address: billingAddress,
          email: email.trim(),
          phone: phone.trim(),
          vat_id: vatId.trim(),
          signature_location_date: locationDate.trim(),
        }),
      }).catch(() => {});

      window.location.hash = '#power-of-ai-danke';
    } catch {
      setErrorMsg('Etwas ist schiefgelaufen. Bitte versuche es erneut.');
      setFormState('error');
      setTimeout(() => setFormState('idle'), 4000);
    }
  };

  return (
    <div className="poa">
      <header className="poa-nav">
        <a href="#" className="poa-back" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}>
          <ArrowLeft size={16} />
          <span>Zurück zur Startseite</span>
        </a>
        <div className="poa-brand">
          <span className="poa-brand-name">The Power of <em>AI</em></span>
          <span className="poa-brand-sub">Edition Köln</span>
        </div>
      </header>

      <section className="poa-hero">
        <div className="poa-hero-accent" />
        <div className="poa-hero-inner">
          <div className="poa-badge">
            <span className="poa-badge-dot" />
            The Power of AI &middot; Edition Köln
          </div>
          <h1 className="poa-h1">
            The Power of <em>AI</em>
          </h1>
          <p className="poa-subtitle">
            Wirkungskraft Mensch im KI-Zeitalter &mdash; Premiere 03.05.2026
          </p>
          <div className="poa-hero-img">
            <img src={heroImg} alt="The Power of AI -- Wirkungskraft Mensch im KI-Zeitalter" />
          </div>
          <div className="poa-info-cards">
            <div className="poa-info-card">
              <CalendarDays size={22} strokeWidth={1.5} />
              <div>
                <strong>Sonntag, 03.05.2026</strong>
                <span>Ganztägiges Programm</span>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Motorworld+K%C3%B6ln,+Peter-M%C3%BCller-Stra%C3%9Fe+12,+51063+K%C3%B6ln"
              target="_blank"
              rel="noopener noreferrer"
              className="poa-info-card poa-info-card-link"
            >
              <MapPin size={22} strokeWidth={1.5} />
              <div>
                <strong>Motorworld Köln</strong>
                <span>Event Location</span>
              </div>
            </a>
            <div className="poa-info-card">
              <Users size={22} strokeWidth={1.5} />
              <div>
                <strong>Limitierte Plätze</strong>
                <span>für Speaker-Slots, Ausstellerflächen und Breakout-Rooms sind begrenzt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="poa-story">
        <div className="poa-story-inner">
          <blockquote className="poa-pullquote">
            Im KI-Zeitalter ist Perfektion klickbar.{' '}
            <strong>Persönlichkeit ist unverwechselbar.</strong>
          </blockquote>

          <div className="poa-story-text">
            <p>
              Du nutzt den Moment. Sichere dir deinen Auftritt auf einer Bühne, die deine Substanz
              sichtbar macht &mdash; live, persönlich, auf Augenhöhe.
            </p>
          </div>

          <div className="poa-divider" />

          <h2 className="poa-h2">Du spürst es <em>längst</em>.</h2>
          <div className="poa-story-text">
            <blockquote className="poa-inline-quote">
              <em>
                Es gibt einen stillen Schmerz unter Menschen, die etwas zu sagen haben: das Wissen,
                dass die eigene Substanz größer ist als die eigene Sichtbarkeit.
              </em>
            </blockquote>
            <p>
              In einer Zeit, in der Algorithmen Reichweite verteilen und KI Inhalte am Fließband
              produziert, wird <strong>echte Persönlichkeit</strong> zur knappsten Ressource des
              Marktes &mdash; und gleichzeitig zur wertvollsten.
            </p>
            <p>
              Während du wartest, werden austauschbare KI-Texte zu deiner größten Konkurrenz.
            </p>
          </div>

          <div className="poa-divider" />

          <h2 className="poa-h2">Was dich <em>erwartet</em>.</h2>
          <div className="poa-story-text">
            <p>
              Alle Leistungen deines Auftritts in Köln &mdash; von deinem Bühnen-Slot über die
              professionelle Foto- und Videodokumentation bis zu deinem Stehtisch und
              Roll-up-Platz &mdash; findest du <strong>persönlich für dich zusammengestellt
              in deinem Angebot</strong>.
            </p>
            <p>
              Mit der Eingabe deiner Angebotsnummer im Anmeldeformular bestätigst du genau diese
              individuell vereinbarten Konditionen.
            </p>
          </div>
        </div>
      </section>

      <section className="poa-cta-section">
        <div className="poa-cta-inner">
          <button type="button" className="poa-cta-btn" onClick={scrollToForm}>
            Verbindliche Anmeldung &mdash; hier eintragen
          </button>
        </div>
      </section>

      <section className="poa-form-section" ref={formSectionRef}>
        <div className="poa-form-inner">
          <div className="poa-form-header">
            <h2 className="poa-h2">Verbindliche <em>Anmeldung</em></h2>
            <p className="poa-form-lead">
              Trage deine persönliche Angebotsnummer und deine Daten ein und unterschreibe
              unten &mdash; damit wird deine Buchung rechtsverbindlich.
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="poa-form" noValidate>
            <div className="poa-field">
              <label className="poa-label" htmlFor="poa-offer">Angebotsnummer</label>
              <div className="poa-offer-wrap">
                <span className="poa-offer-prefix">ANG-2026-</span>
                <input
                  id="poa-offer"
                  type="text"
                  className="poa-input poa-input-offer"
                  placeholder="XXXX"
                  value={offerNumber}
                  onChange={(e) => setOfferNumber(e.target.value)}
                  maxLength={20}
                />
              </div>
              <span className="poa-hint">Du findest sie oben rechts auf deinem persönlichen Angebots-PDF.</span>
            </div>

            <div className="poa-row">
              <div className="poa-field">
                <label className="poa-label" htmlFor="poa-name">Vor- und Nachname *</label>
                <input
                  id="poa-name"
                  type="text"
                  className="poa-input"
                  placeholder="Max Mustermann"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={200}
                />
              </div>
              <div className="poa-field">
                <label className="poa-label" htmlFor="poa-company">Firma <span className="poa-opt">(optional)</span></label>
                <input
                  id="poa-company"
                  type="text"
                  className="poa-input"
                  placeholder="Firmenname"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  maxLength={200}
                />
              </div>
            </div>

            <div className="poa-field">
              <label className="poa-label" htmlFor="poa-street">Rechnungsadresse *</label>
              <input
                id="poa-street"
                type="text"
                className="poa-input"
                placeholder="Straße und Hausnummer"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                maxLength={300}
              />
              <div className="poa-row poa-row-address">
                <input
                  type="text"
                  className="poa-input poa-input-zip"
                  placeholder="PLZ"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  maxLength={10}
                />
                <input
                  type="text"
                  className="poa-input poa-input-city"
                  placeholder="Ort"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  maxLength={100}
                />
              </div>
            </div>

            <div className="poa-row">
              <div className="poa-field">
                <label className="poa-label" htmlFor="poa-email">E-Mail *</label>
                <input
                  id="poa-email"
                  type="email"
                  className="poa-input"
                  placeholder="deine@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={254}
                />
              </div>
              <div className="poa-field">
                <label className="poa-label" htmlFor="poa-phone">Telefon *</label>
                <input
                  id="poa-phone"
                  type="tel"
                  className="poa-input"
                  placeholder="+49 ..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={30}
                />
              </div>
            </div>

            <div className="poa-field">
              <label className="poa-label" htmlFor="poa-vat">USt-IdNr. <span className="poa-opt">(optional)</span></label>
              <input
                id="poa-vat"
                type="text"
                className="poa-input"
                placeholder="DE123456789"
                value={vatId}
                onChange={(e) => setVatId(e.target.value)}
                maxLength={30}
              />
            </div>

            <div className="poa-divider" />

            <div className="poa-checks">
              <label className="poa-check">
                <input
                  type="checkbox"
                  checked={confirmBinding}
                  onChange={(e) => setConfirmBinding(e.target.checked)}
                />
                <span className="poa-checkmark" />
                <span className="poa-check-text">
                  Ich nehme das mir vorliegende Angebot hiermit
                  verbindlich an. Mir ist bewusst, dass mit Absenden dieser Erklärung ein rechtswirksamer
                  Vertrag zustande kommt. Die im Angebot beschriebenen Leistungen, Konditionen und
                  Zahlungsbedingungen habe ich gelesen und akzeptiere sie vollumfänglich.
                </span>
              </label>

              <label className="poa-check">
                <input
                  type="checkbox"
                  checked={confirmCancellation}
                  onChange={(e) => setConfirmCancellation(e.target.checked)}
                />
                <span className="poa-checkmark" />
                <span className="poa-check-text">
                  Ich akzeptiere die Stornobedingungen: Bis 14 Tage vor Veranstaltungsbeginn ist eine
                  kostenfreie Stornierung möglich. Bei späterer Stornierung wird der volle Betrag
                  fällig. Eine Ersatzperson kann jederzeit gestellt werden. Ich habe die Datenschutzhinweise
                  gelesen und akzeptiert.
                </span>
              </label>

              <label className="poa-check">
                <input
                  type="checkbox"
                  checked={confirmMedia}
                  onChange={(e) => setConfirmMedia(e.target.checked)}
                />
                <span className="poa-checkmark" />
                <span className="poa-check-text">
                  Ich bin damit einverstanden, dass während der Veranstaltung Foto- und Videoaufnahmen
                  gemacht werden, auf denen ich abgebildet sein kann. Diese dürfen für die
                  Öffentlichkeitsarbeit und Dokumentation der Veranstaltung verwendet werden.
                </span>
              </label>
            </div>

            <div className="poa-divider" />

            <div className="poa-sig-section">
              <div className="poa-row">
                <div className="poa-field">
                  <label className="poa-label" htmlFor="poa-locdate">Ort, Datum *</label>
                  <input
                    id="poa-locdate"
                    type="text"
                    className="poa-input"
                    placeholder="z.B. Köln, 15.04.2026"
                    value={locationDate}
                    onChange={(e) => setLocationDate(e.target.value)}
                    maxLength={100}
                  />
                </div>
              </div>
              <div className="poa-field">
                <label className="poa-label">Unterschrift *</label>
                <SignaturePad
                  onSignatureChange={setSignatureData}
                  isEmpty={!signatureData}
                />
              </div>
            </div>

            {formState === 'error' && errorMsg && (
              <div className="poa-error">
                <AlertCircle size={14} />
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="poa-submit"
              disabled={formState === 'sending'}
            >
              {formState === 'sending' ? (
                <span className="poa-spinner" />
              ) : (
                'Verbindlich anmelden'
              )}
            </button>
          </form>
        </div>
      </section>

      <section className="poa-team">
        <p className="poa-team-hosted">
          Dieses Event wird veranstaltet von <strong>Ronny Barthel</strong>. In Köln begrüßen dich
          <br />
          <strong>Claudia Conen</strong> &amp; <strong>Klaus Offermann</strong> als deine Hosts vor Ort.
        </p>
        <div className="poa-team-img-wrap">
          <img src={teamImg} alt="Das Team -- The Power of AI Köln 2026" className="poa-team-img" />
          <div className="poa-team-overlay" />
        </div>
        <div className="poa-team-text">
          <blockquote>
            &bdquo;Wer auf eine Bühne tritt, übernimmt Verantwortung &mdash; für seine Worte,
            für seine Wirkung, für den Wert, den er anderen schenkt.&ldquo;
          </blockquote>
          <p className="poa-team-closing">Bis zum 03.05.2026 in Köln.</p>
        </div>
      </section>

      <footer className="foot">
        <div className="foot-left">
          <span>&copy; 2026 Claudia Conen &middot; Die Umsatzstimme</span>
        </div>
        <div className="foot-links">
          <a href="#impressum">Impressum</a>
          <span>&middot;</span>
          <a href="#datenschutz">Datenschutz</a>
        </div>
        <span className="foot-credit">
          Seite erstellt von <a href="https://ki-webseite-lindemann.com/" target="_blank" rel="noopener noreferrer">Webdesign Gabi Lindemann</a>
        </span>
      </footer>
    </div>
  );
}
