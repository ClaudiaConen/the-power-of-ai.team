import { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle, User, Mail, Phone, MessageSquare, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';

type FormState = 'idle' | 'sending' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PRODUCT_OPTIONS = [
  { value: '', label: 'Allgemeine Anfrage' },
  { value: 'Power Upgrade – Live Punkten (530€)', label: 'Power Upgrade – Live Punkten (530€)' },
  { value: 'Unersetzbar: Der Live Tag (990€)', label: 'Unersetzbar: Der Live Tag (990€)' },
  { value: 'Das Umsetzungs-Mentoring (1.497€)', label: 'Das Umsetzungs-Mentoring (1.497€)' },
  { value: 'Voice to Brain – Gruppen-Mentoring (1.497€)', label: 'Voice to Brain – Gruppen-Mentoring (1.497€)' },
  { value: 'Voice to Brain – 1:1-Mentoring (4.997€)', label: 'Voice to Brain – 1:1-Mentoring (4.997€)' },
];

interface ContactFormProps {
  defaultProduct?: string;
}

export default function ContactForm({ defaultProduct = '' }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [product, setProduct] = useState(defaultProduct);
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setProduct(defaultProduct);
  }, [defaultProduct]);

  useEffect(() => {
    if (formState === 'success') {
      const timer = setTimeout(() => setFormState('idle'), 5000);
      return () => clearTimeout(timer);
    }
  }, [formState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');

    const INVISIBLE_RE = /[\u00A0\u00AD\u200B-\u200D\u2060\uFEFF\u202F\u2009\t\r]/g;
    const normalize = (s: string) =>
      s.replace(INVISIBLE_RE, '').replace(/\s+/g, ' ').trim();
    const cleanName = normalize(name).slice(0, 200);
    const cleanEmail = normalize(email).toLowerCase().slice(0, 254);
    const cleanPhone = normalize(phone).slice(0, 60);
    const cleanProduct = normalize(product).slice(0, 200);
    const cleanMessage = message
      .replace(INVISIBLE_RE, '')
      .replace(/\r\n/g, '\n')
      .trim()
      .slice(0, 5000);

    const fail = (msg: string) => {
      setErrorMsg(msg);
      setFormState('error');
      setTimeout(() => setFormState('idle'), 4500);
    };

    if (!cleanName) return fail('Bitte gib deinen Namen ein.');
    if (!cleanEmail) return fail('Bitte gib eine E-Mail-Adresse ein.');
    if (!EMAIL_RE.test(cleanEmail)) return fail('Bitte gib eine gültige E-Mail-Adresse ein.');
    if (!cleanMessage) return fail('Bitte schreibe eine Nachricht.');

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone ? cleanPhone : null,
          product: cleanProduct ? cleanProduct : null,
          message: cleanMessage,
        });

      if (error) throw error;

      const base = import.meta.env.VITE_SUPABASE_URL;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };
      const body = JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        product: cleanProduct,
        message: cleanMessage,
      });
      try {
        await Promise.all([
          fetch(`${base}/functions/v1/send-contact-email`, { method: 'POST', headers, body }),
          fetch(`${base}/functions/v1/send-contact-notification`, { method: 'POST', headers, body }),
        ]);
      } catch {
        // swallowed – submission is persisted regardless of mail delivery
      }

      setFormState('success');
      setName('');
      setEmail('');
      setPhone('');
      setProduct('');
      setMessage('');
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string; details?: string } | undefined;
      console.error('[ContactForm] insert failed', e);
      if (e?.code === '42501') {
        setErrorMsg('Deine Anfrage konnte gerade nicht gespeichert werden. Bitte versuche es in einem Moment erneut — oder schreib direkt an kontakt@the-power-of-ai.team.');
      } else if (e?.code === '23514' || e?.code === '22001') {
        setErrorMsg('Ein Feld ist zu lang. Bitte kuerze deine Eingabe.');
      } else if (e?.message?.toLowerCase().includes('failed to fetch') || e?.message?.toLowerCase().includes('network')) {
        setErrorMsg('Keine Verbindung zum Server. Bitte versuche es in einem Moment erneut.');
      } else {
        setErrorMsg('Etwas ist schiefgelaufen. Bitte versuche es erneut oder schreib direkt an kontakt@the-power-of-ai.team.');
      }
      setFormState('error');
      setTimeout(() => setFormState('idle'), 6000);
    }
  };

  if (formState === 'success') {
    return (
      <div className="cf-success">
        <CheckCircle size={40} strokeWidth={1.5} />
        <h3>Nachricht gesendet!</h3>
        <p>Vielen Dank für deine Anfrage. Claudia meldet sich in Kürze bei dir.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="cf">
      <div className="cf-row">
        <div className="cf-field">
          <label className="cf-label" htmlFor="cf-name">
            <User size={12} />
            Name
          </label>
          <input
            id="cf-name"
            type="text"
            className="cf-input"
            placeholder="Dein Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={200}
          />
        </div>
        <div className="cf-field">
          <label className="cf-label" htmlFor="cf-email">
            <Mail size={12} />
            E-Mail
          </label>
          <input
            id="cf-email"
            type="email"
            className="cf-input"
            placeholder="deine@email.de"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={254}
          />
        </div>
      </div>
      <div className="cf-field">
        <label className="cf-label" htmlFor="cf-phone">
          <Phone size={12} />
          Telefon für Rückruf <span className="cf-opt">(optional)</span>
        </label>
        <input
          id="cf-phone"
          type="tel"
          className="cf-input"
          placeholder="+49 ..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={30}
        />
      </div>
      <div className="cf-field">
        <label className="cf-label" htmlFor="cf-product">
          <Package size={12} />
          Produkt / Angebot
        </label>
        <select
          id="cf-product"
          className="cf-input cf-select"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        >
          {PRODUCT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="cf-field">
        <label className="cf-label" htmlFor="cf-msg">
          <MessageSquare size={12} />
          Nachricht
        </label>
        <textarea
          id="cf-msg"
          className="cf-input cf-textarea"
          placeholder="Beschreibe dein Anliegen, deine Frage oder ein Problem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
          maxLength={5000}
        />
      </div>
      {formState === 'error' && (
        <div className="cf-error">
          <AlertCircle size={14} />
          {errorMsg || 'Etwas ist schiefgelaufen. Bitte versuche es erneut.'}
        </div>
      )}
      <button
        type="submit"
        className="cf-submit"
        disabled={formState === 'sending'}
      >
        {formState === 'sending' ? (
          <span className="cf-spinner" />
        ) : (
          <>
            <Send size={14} />
            Nachricht senden
          </>
        )}
      </button>
      <p className="cf-hint">
        Oder schreib direkt an{' '}
        <a href="mailto:kontakt@the-power-of-ai.team">kontakt@the-power-of-ai.team</a>
      </p>
    </form>
  );
}
