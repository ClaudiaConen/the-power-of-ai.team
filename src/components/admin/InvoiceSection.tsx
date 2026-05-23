import { useState, useEffect } from 'react';
import { FileText, Send, Download, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';

interface Speaker {
  id: string;
  vorname: string;
  nachname: string;
  email: string;
  unternehmen: string;
  format: string;
  upgrade_keynote15?: boolean;
  upgrade_keynote25?: boolean;
  upgrade_barcamp_room?: boolean;
  upgrade_7stage?: boolean;
  upgrade_workshop?: boolean;
  upgrade_coaching?: boolean;
  gesamtpreis_netto?: number;
  r_firma: string;
  r_strasse: string;
  r_plz: string;
  r_stadt: string;
  r_ustid: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  description: string;
  amount: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  status: string;
  sent_at: string | null;
  created_at: string;
}

interface Props {
  speaker: Speaker;
}

const FORMAT_PRICES: Record<string, { label: string; amount: number }> = {
  pitch3: { label: 'Pitch 3 Min — Starter Paket', amount: 497 },
  keynote15: { label: 'Keynote 15 Min', amount: 997 },
  keynote25: { label: 'Keynote 25 Min', amount: 1497 },
  barcamp: { label: 'Barcamp', amount: 497 },
  '7stage': { label: 'The 7 Stage', amount: 1777 },
};

export default function InvoiceSection({ speaker }: Props) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadInvoices();
  }, [speaker.id]);

  const loadInvoices = async () => {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('speaker_id', speaker.id)
      .order('created_at', { ascending: false });
    if (data) setInvoices(data);
  };

  const buildDescription = (): string => {
    const lines: string[] = ['Basis-Paket (500 \u20ac)'];
    if (speaker.upgrade_keynote15) lines.push('+15 Min Keynote (+500 \u20ac)');
    if (speaker.upgrade_keynote25) lines.push('+25 Min Keynote (+750 \u20ac)');
    if (speaker.upgrade_barcamp_room) lines.push('Barcamp-Room 30 Min (+170 \u20ac)');
    if (speaker.upgrade_7stage) lines.push('The 7 Stage (+1.777 \u20ac)');
    if (speaker.upgrade_workshop) lines.push('Performance Workshop (+177 \u20ac)');
    if (speaker.upgrade_coaching) lines.push('1:1 Coaching (+377 \u20ac)');
    return lines.join(' | ');
  };

  const getAmount = (): number => {
    if (speaker.gesamtpreis_netto && speaker.gesamtpreis_netto > 0) return speaker.gesamtpreis_netto;
    const price = FORMAT_PRICES[speaker.format] || { amount: 500 };
    return price.amount;
  };

  const createInvoice = async () => {
    setCreating(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token ?? import.meta.env.VITE_SUPABASE_ANON_KEY;
      const numUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-next-invoice-number`;
      const numResp = await fetch(numUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const numJson = numResp.ok ? await numResp.json() : null;
      const invoiceNumber = numJson?.invoice_number || `RE-${new Date().getFullYear()}-${Date.now()}`;

      const amount = getAmount();
      const description = buildDescription();
      const taxRate = 19;
      const taxAmount = Math.round(amount * taxRate) / 100;
      const total = amount + taxAmount;

      const { error } = await supabase.from('invoices').insert({
        speaker_id: speaker.id,
        invoice_number: invoiceNumber,
        description,
        amount,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total: total,
      });

      if (error) throw error;
      showToast('success', `Rechnung ${invoiceNumber} erstellt.`);
      loadInvoices();
    } catch {
      showToast('error', 'Rechnung konnte nicht erstellt werden.');
    }
    setCreating(false);
  };

  const generatePDF = (inv: Invoice) => {
    const html = buildInvoiceHTML(inv, speaker);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.invoice_number}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Rechnung heruntergeladen.');
  };

  const printInvoice = (inv: Invoice) => {
    const html = buildInvoiceHTML(inv, speaker);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.onload = () => win.print();
    }
  };

  const sendInvoice = async (inv: Invoice) => {
    setSending(inv.id);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invoice-email`;
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice_number: inv.invoice_number,
          speaker_email: speaker.email,
          speaker_name: `${speaker.vorname} ${speaker.nachname}`,
          description: inv.description,
          amount: inv.amount,
          tax_amount: inv.tax_amount,
          total: inv.total,
          r_firma: speaker.r_firma,
          r_strasse: speaker.r_strasse,
          r_plz: speaker.r_plz,
          r_stadt: speaker.r_stadt,
          r_ustid: speaker.r_ustid,
        }),
      });

      if (!res.ok) throw new Error('Send failed');

      await supabase.from('invoices').update({
        status: 'versendet',
        sent_at: new Date().toISOString(),
      }).eq('id', inv.id);

      showToast('success', `Rechnung an ${speaker.email} versendet.`);
      loadInvoices();
    } catch {
      showToast('error', 'Rechnung konnte nicht versendet werden.');
    }
    setSending(null);
  };

  return (
    <div className="ad-modal-section">
      <h3>Rechnungen</h3>

      <button className="ad-btn ad-btn--ghost" onClick={createInvoice} disabled={creating} style={{ marginBottom: 12 }}>
        <Plus size={14} /> {creating ? 'Erstelle...' : 'Neue Rechnung generieren'}
      </button>

      {invoices.length === 0 && <p className="ad-muted">Keine Rechnungen vorhanden.</p>}

      {invoices.map((inv) => (
        <div key={inv.id} className="ad-invoice-row">
          <div className="ad-invoice-info">
            <FileText size={16} />
            <div>
              <span className="ad-invoice-num">{inv.invoice_number}</span>
              <span className="ad-invoice-date">{new Date(inv.invoice_date).toLocaleDateString('de-DE')}</span>
            </div>
            <span className="ad-invoice-total">{inv.total.toFixed(2)} {'\u20ac'}</span>
            <span className={`ad-status ${inv.status === 'versendet' ? 'ad-status--green' : 'ad-status--yellow'}`}>
              {inv.status === 'versendet' ? 'Versendet' : 'Erstellt'}
            </span>
          </div>
          <div className="ad-invoice-actions">
            <button className="ad-btn ad-btn--ghost" onClick={() => printInvoice(inv)} title="Drucken / PDF">
              <Download size={14} /> PDF
            </button>
            <button className="ad-btn ad-btn--ghost" onClick={() => generatePDF(inv)} title="Herunterladen">
              <FileText size={14} /> Download
            </button>
            {inv.status !== 'versendet' && (
              <button className="ad-btn ad-btn--green" onClick={() => sendInvoice(inv)} disabled={sending === inv.id}>
                <Send size={14} /> {sending === inv.id ? 'Sende...' : 'Versenden'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function buildInvoiceHTML(inv: Invoice, speaker: { vorname: string; nachname: string; unternehmen: string; r_firma: string; r_strasse: string; r_plz: string; r_stadt: string; r_ustid: string }) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Rechnung ${inv.invoice_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, 'Helvetica Neue', sans-serif; color: #1A1530; padding: 48px; max-width: 800px; margin: 0 auto; font-size: 13px; line-height: 1.6; }
  .header { display: flex; justify-content: space-between; margin-bottom: 48px; }
  .brand { font-size: 18px; font-weight: 600; color: #e040a0; letter-spacing: 0.05em; }
  .brand-sub { font-size: 11px; color: rgba(26,21,48,.5); }
  .meta { text-align: right; }
  .meta h1 { font-size: 22px; font-weight: 500; margin-bottom: 8px; }
  .meta p { font-size: 12px; color: rgba(26,21,48,.65); }
  .addresses { display: flex; gap: 48px; margin-bottom: 40px; }
  .addr h3 { font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(26,21,48,.4); margin-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  th { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(26,21,48,.4); text-align: left; padding: 8px 0; border-bottom: 1px solid rgba(26,21,48,.1); }
  td { padding: 12px 0; border-bottom: 1px solid rgba(26,21,48,.06); }
  .align-right { text-align: right; }
  .totals { margin-left: auto; width: 280px; }
  .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
  .totals-row.total { font-weight: 600; font-size: 16px; border-top: 2px solid #e040a0; padding-top: 12px; margin-top: 8px; }
  .footer { margin-top: 64px; padding-top: 16px; border-top: 1px solid rgba(26,21,48,.1); font-size: 11px; color: rgba(26,21,48,.4); }
  @media print { body { padding: 24px; } }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">THE POWER OF AI</div>
      <div class="brand-sub">Claudia Conen &middot; Die Umsatzstimme</div>
    </div>
    <div class="meta">
      <h1>Rechnung</h1>
      <p>${inv.invoice_number}</p>
      <p>Datum: ${new Date(inv.invoice_date).toLocaleDateString('de-DE')}</p>
    </div>
  </div>

  <div class="addresses">
    <div class="addr">
      <h3>Rechnungsempf&auml;nger</h3>
      <p>${speaker.r_firma}<br>${speaker.r_strasse}<br>${speaker.r_plz} ${speaker.r_stadt}${speaker.r_ustid ? '<br>USt-IdNr.: ' + speaker.r_ustid : ''}</p>
    </div>
    <div class="addr">
      <h3>Rechnungssteller</h3>
      <p>The Power of AI<br>Claudia Conen<br>Die Umsatzstimme</p>
    </div>
  </div>

  <table>
    <thead>
      <tr><th>Beschreibung</th><th class="align-right">Betrag</th></tr>
    </thead>
    <tbody>
      <tr><td>${inv.description}<br><small>Speaker: ${speaker.vorname} ${speaker.nachname} (${speaker.unternehmen})</small></td><td class="align-right">${inv.amount.toFixed(2)} &euro;</td></tr>
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row"><span>Netto</span><span>${inv.amount.toFixed(2)} &euro;</span></div>
    <div class="totals-row"><span>MwSt. ${inv.tax_rate}%</span><span>${inv.tax_amount.toFixed(2)} &euro;</span></div>
    <div class="totals-row total"><span>Gesamt</span><span>${inv.total.toFixed(2)} &euro;</span></div>
  </div>

  <div class="footer">
    <p>Zahlbar innerhalb von 14 Tagen. Alle Betr&auml;ge in Euro.</p>
  </div>
</body>
</html>`;
}
