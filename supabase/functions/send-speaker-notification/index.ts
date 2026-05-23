import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RECIPIENT = "kontakt@the-power-of-ai.team";
const MAX_BODY_SIZE = 50_000;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safe(value: unknown, max = 200): string {
  if (value === null || value === undefined) return "–";
  const s = String(value).trim();
  if (!s) return "–";
  return escapeHtml(s.slice(0, max));
}

function respond(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface SpeakerPayload {
  vorname?: string;
  nachname?: string;
  email?: string;
  telefon?: string;
  unternehmen?: string;
  stadt?: string;
  format?: string;
  gesamtpreis_netto?: number;
  rabatt_netto?: number;
  gutscheincode?: string;
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

    let payload: SpeakerPayload;
    try {
      payload = await req.json();
    } catch {
      return respond({ error: "Invalid JSON" }, 400);
    }

    const vorname = safe(payload.vorname, 100);
    const nachname = safe(payload.nachname, 100);
    const email = safe(payload.email, 254);
    const telefon = safe(payload.telefon, 60);
    const unternehmen = safe(payload.unternehmen, 200);
    const stadt = safe(payload.stadt, 100);
    const format = safe(payload.format, 60);

    const preis = Number.isFinite(payload.gesamtpreis_netto)
      ? Number(payload.gesamtpreis_netto)
      : 0;
    const rabatt = Number.isFinite(payload.rabatt_netto)
      ? Number(payload.rabatt_netto)
      : 0;
    const preisStr = preis.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const rabattStr = rabatt > 0
      ? `${rabatt.toLocaleString("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} € (Code: ${safe(payload.gutscheincode, 50)})`
      : "–";

    const subject = `Neue Speaker-Buchung: ${safe(payload.vorname, 60)} ${safe(
      payload.nachname,
      60,
    )} – ${preisStr} €`.slice(0, 180);

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:#0f172a;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:18px;">Neue Speaker-Buchung</h1>
          <p style="margin:6px 0 0;opacity:0.8;font-size:13px;">The Power of AI – Speaker-Anmeldung</p>
        </div>
        <div style="background:#f8fafc;padding:20px 24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
          <table style="border-collapse:collapse;width:100%;font-size:14px;">
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;width:130px;color:#475569;">Name</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${vorname} ${nachname}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;color:#475569;">E-Mail</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;"><a href="mailto:${email}" style="color:#2563eb;">${email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;color:#475569;">Telefon</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${telefon}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;color:#475569;">Unternehmen</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${unternehmen}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;color:#475569;">Event-Stadt</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${stadt}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;color:#475569;">Format</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${format}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;color:#475569;">Gutschein</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${rabattStr}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#475569;">Gesamtpreis netto</td><td style="padding:8px;font-weight:bold;color:#065f46;">${preisStr} €</td></tr>
          </table>
        </div>
      </div>
    `;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (RESEND_API_KEY) {
      const replyTo = typeof payload.email === "string" ? payload.email.trim() : "";
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "The Power of AI <noreply@the-power-of-ai.team>",
          to: [RECIPIENT],
          ...(replyTo ? { reply_to: replyTo } : {}),
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
    console.error("Speaker notification error:", err);
    return respond({ error: "Internal server error" }, 500);
  }
});
