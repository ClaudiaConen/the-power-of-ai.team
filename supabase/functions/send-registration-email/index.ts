import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RECIPIENT = "kontakt@the-power-of-ai.team";
const MAX_BODY_SIZE = 100_000;

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

interface RegistrationPayload {
  offer_number: string;
  full_name: string;
  company?: string;
  billing_address: string;
  email: string;
  phone: string;
  vat_id?: string;
  signature_location_date: string;
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

    let payload: RegistrationPayload;
    try {
      payload = await req.json();
    } catch {
      return respond({ error: "Invalid JSON" }, 400);
    }

    const {
      offer_number,
      full_name,
      company,
      billing_address,
      email,
      phone,
      vat_id,
      signature_location_date,
    } = payload;

    if (!offer_number || !full_name || !email) {
      return respond({ error: "Required fields missing" }, 400);
    }

    const safeOffer = sanitize(offer_number, 50);
    const safeName = sanitize(full_name, 200);
    const safeCompany = company ? sanitize(company, 200) : "–";
    const safeAddress = sanitize(billing_address, 500);
    const safeEmail = sanitize(email, 254);
    const safePhone = sanitize(phone, 30);
    const safeVat = vat_id ? sanitize(vat_id, 30) : "–";
    const safeLocDate = sanitize(signature_location_date, 100);

    const subject = `Verbindliche Anmeldung: ${safeName} (${safeOffer})`;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#0f172a;color:#fff;padding:24px 32px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;">Neue verbindliche Anmeldung</h1>
          <p style="margin:8px 0 0;opacity:0.8;font-size:14px;">The Power of AI &ndash; Edition K&ouml;ln &ndash; 03.05.2026</p>
        </div>
        <div style="background:#f8fafc;padding:24px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
          <table style="border-collapse:collapse;width:100%;">
            <tr><td style="padding:10px 8px;font-weight:bold;border-bottom:1px solid #e2e8f0;width:180px;color:#475569;">Angebotsnummer</td><td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;">${safeOffer}</td></tr>
            <tr><td style="padding:10px 8px;font-weight:bold;border-bottom:1px solid #e2e8f0;color:#475569;">Name</td><td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;">${safeName}</td></tr>
            <tr><td style="padding:10px 8px;font-weight:bold;border-bottom:1px solid #e2e8f0;color:#475569;">Firma</td><td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;">${safeCompany}</td></tr>
            <tr><td style="padding:10px 8px;font-weight:bold;border-bottom:1px solid #e2e8f0;color:#475569;">Rechnungsadresse</td><td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;">${safeAddress}</td></tr>
            <tr><td style="padding:10px 8px;font-weight:bold;border-bottom:1px solid #e2e8f0;color:#475569;">E-Mail</td><td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;"><a href="mailto:${safeEmail}" style="color:#2563eb;">${safeEmail}</a></td></tr>
            <tr><td style="padding:10px 8px;font-weight:bold;border-bottom:1px solid #e2e8f0;color:#475569;">Telefon</td><td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;">${safePhone}</td></tr>
            <tr><td style="padding:10px 8px;font-weight:bold;border-bottom:1px solid #e2e8f0;color:#475569;">USt-IdNr.</td><td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;">${safeVat}</td></tr>
            <tr><td style="padding:10px 8px;font-weight:bold;color:#475569;">Ort, Datum</td><td style="padding:10px 8px;">${safeLocDate}</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#ecfdf5;border-radius:6px;border:1px solid #a7f3d0;">
            <p style="margin:0;color:#065f46;font-size:14px;"><strong>Alle drei Checkboxen wurden akzeptiert:</strong></p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#065f46;font-size:13px;">
              <li>Verbindliche Angebotsannahme</li>
              <li>Stornobedingungen</li>
              <li>Foto- und Videoaufnahmen</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (RESEND_API_KEY) {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "The Power of AI <noreply@the-power-of-ai.team>",
          to: [RECIPIENT],
          reply_to: email.trim(),
          subject,
          html,
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (!emailRes.ok) {
        const errText = await emailRes.text();
        console.error("Resend API error:", emailRes.status, errText);
      }
    } else {
      console.warn("RESEND_API_KEY not set – skipping email");
    }

    return respond({ success: true }, 200);
  } catch (err) {
    console.error("Registration email error:", err);
    return respond({ error: "Internal server error" }, 500);
  }
});
