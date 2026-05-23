import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_RECIPIENT = "kontakt@the-power-of-ai.team";
const MAX_BODY_SIZE = 50_000;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitize(str: string, maxLen: number): string {
  return escapeHtml(str.trim().slice(0, maxLen));
}

function respond(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface InvoicePayload {
  invoice_number: string;
  speaker_email: string;
  speaker_name: string;
  description: string;
  amount: number;
  tax_amount: number;
  total: number;
  r_firma: string;
  r_strasse: string;
  r_plz: string;
  r_stadt: string;
  r_ustid?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return respond({ error: "Method not allowed" }, 405);
  }

  try {
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
      return respond({ error: "Payload too large" }, 413);
    }

    let payload: InvoicePayload;
    try {
      payload = await req.json();
    } catch {
      return respond({ error: "Invalid JSON" }, 400);
    }

    const {
      invoice_number,
      speaker_email,
      speaker_name,
      description,
      amount,
      tax_amount,
      total,
      r_firma,
      r_strasse,
      r_plz,
      r_stadt,
      r_ustid,
    } = payload;

    if (!invoice_number || !speaker_email || !speaker_name) {
      return respond(
        { error: "invoice_number, speaker_email and speaker_name are required" },
        400
      );
    }

    const safeNum = sanitize(invoice_number, 50);
    const safeName = sanitize(speaker_name, 200);
    const safeEmail = sanitize(speaker_email, 254);
    const safeDesc = sanitize(description, 500);
    const safeFirma = sanitize(r_firma, 200);
    const safeStrasse = sanitize(r_strasse, 200);
    const safePlz = sanitize(r_plz, 10);
    const safeStadt = sanitize(r_stadt, 100);
    const safeUstid = r_ustid ? sanitize(r_ustid, 30) : "";

    const safeAmount =
      typeof amount === "number" ? amount.toFixed(2) : "0.00";
    const safeTax =
      typeof tax_amount === "number" ? tax_amount.toFixed(2) : "0.00";
    const safeTotal =
      typeof total === "number" ? total.toFixed(2) : "0.00";

    const html = `
      <div style="font-family:-apple-system,'Helvetica Neue',sans-serif;max-width:600px;margin:0 auto;color:#1A1530;">
        <div style="border-bottom:2px solid #D4537E;padding-bottom:16px;margin-bottom:24px;">
          <div style="font-size:12px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#D4537E;">THE POWER OF AI</div>
          <div style="font-size:11px;color:rgba(26,21,48,.5);">Claudia Conen &middot; Die Umsatzstimme</div>
        </div>

        <h1 style="font-size:22px;font-weight:500;margin-bottom:8px;">Rechnung ${safeNum}</h1>
        <p style="font-size:13px;color:rgba(26,21,48,.65);margin-bottom:24px;">
          Hallo ${safeName}, anbei findest du deine Rechnung f&uuml;r The Power of AI.
        </p>

        <table style="border-collapse:collapse;width:100%;margin-bottom:24px;">
          <tr style="border-bottom:1px solid rgba(26,21,48,.08);">
            <td style="padding:10px 0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(26,21,48,.4);">Rechnungsnummer</td>
            <td style="padding:10px 0;font-size:13px;text-align:right;">${safeNum}</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(26,21,48,.08);">
            <td style="padding:10px 0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(26,21,48,.4);">Beschreibung</td>
            <td style="padding:10px 0;font-size:13px;text-align:right;">${safeDesc}</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(26,21,48,.08);">
            <td style="padding:10px 0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(26,21,48,.4);">Netto</td>
            <td style="padding:10px 0;font-size:13px;text-align:right;">${safeAmount} &euro;</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(26,21,48,.08);">
            <td style="padding:10px 0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(26,21,48,.4);">MwSt. 19%</td>
            <td style="padding:10px 0;font-size:13px;text-align:right;">${safeTax} &euro;</td>
          </tr>
          <tr>
            <td style="padding:12px 0;font-size:13px;font-weight:600;">Gesamt</td>
            <td style="padding:12px 0;font-size:16px;font-weight:600;text-align:right;color:#D4537E;">${safeTotal} &euro;</td>
          </tr>
        </table>

        <div style="background:#F4F0FA;border-radius:12px;padding:16px;margin-bottom:24px;">
          <div style="font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(26,21,48,.4);margin-bottom:8px;">Rechnungsadresse</div>
          <div style="font-size:13px;">${safeFirma}<br>${safeStrasse}<br>${safePlz} ${safeStadt}${safeUstid ? '<br>USt-IdNr.: ' + safeUstid : ''}</div>
        </div>

        <p style="font-size:12px;color:rgba(26,21,48,.4);margin-top:32px;">
          Zahlbar innerhalb von 14 Tagen. Alle Betr&auml;ge in Euro.<br>
          Bei Fragen wende dich an kontakt@the-power-of-ai.team
        </p>
      </div>
    `;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (RESEND_API_KEY) {
      const plainEmail = speaker_email.trim().slice(0, 254);

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "The Power of AI <noreply@the-power-of-ai.team>",
          to: [plainEmail],
          cc: [ADMIN_RECIPIENT],
          subject: `Rechnung ${invoice_number} — The Power of AI`,
          html,
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (!emailRes.ok) {
        const errText = await emailRes.text();
        console.error("Resend API error:", emailRes.status, errText);
        return respond({ error: "Email sending failed" }, 502);
      }
    }

    return respond({ success: true }, 200);
  } catch (err) {
    console.error("Invoice email error:", err);
    return respond({ error: "Internal server error" }, 500);
  }
});
