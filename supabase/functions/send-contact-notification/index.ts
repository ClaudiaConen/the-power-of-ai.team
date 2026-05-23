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

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  product?: string;
  message?: string;
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

    let payload: ContactPayload;
    try {
      payload = await req.json();
    } catch {
      return respond({ error: "Invalid JSON" }, 400);
    }

    const name = safe(payload.name, 200);
    const email = safe(payload.email, 254);
    const phone = safe(payload.phone, 60);
    const productRaw = typeof payload.product === "string" ? payload.product.trim() : "";
    const product = productRaw ? escapeHtml(productRaw.slice(0, 200)) : "Allgemeine Anfrage";

    const messageRaw = typeof payload.message === "string" ? payload.message.trim() : "";
    const preview = messageRaw
      ? escapeHtml(messageRaw.slice(0, 140)) + (messageRaw.length > 140 ? "…" : "")
      : "–";

    const telHref = phone !== "–" ? phone.replace(/[^\d+]/g, "") : "";
    const phoneCell = telHref
      ? `<a href="tel:${telHref}" style="color:#2563eb;">${phone}</a>`
      : phone;

    const subject = `Neue Kontaktanfrage: ${safe(payload.name, 60)} (${productRaw ? escapeHtml(productRaw.slice(0, 60)) : "Allgemein"})`.slice(0, 180);

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:#0f172a;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:18px;">Neue Kontaktanfrage</h1>
          <p style="margin:6px 0 0;opacity:0.8;font-size:13px;">The Power of AI – Kontaktformular</p>
        </div>
        <div style="background:#f8fafc;padding:20px 24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
          <table style="border-collapse:collapse;width:100%;font-size:14px;">
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;width:130px;color:#475569;">Name</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${name}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;color:#475569;">E-Mail</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;"><a href="mailto:${email}" style="color:#2563eb;">${email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;color:#475569;">Telefon</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${phoneCell}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;color:#475569;">Produkt</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${product}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#475569;vertical-align:top;">Nachricht</td><td style="padding:8px;white-space:pre-wrap;line-height:1.5;">${preview}</td></tr>
          </table>
          <p style="margin:16px 0 0;font-size:12px;color:#64748b;">Volle Nachricht im Admin-Dashboard.</p>
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
    console.error("Contact notification error:", err);
    return respond({ error: "Internal server error" }, 500);
  }
});
