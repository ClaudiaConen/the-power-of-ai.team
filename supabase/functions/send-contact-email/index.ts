import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RECIPIENT = "kontakt@the-power-of-ai.team";
const MAX_BODY_SIZE = 50_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  product?: string;
  message: string;
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

    const { name, email, phone, product, message } = payload;

    if (!name || !email || !message) {
      return respond({ error: "Name, email and message are required" }, 400);
    }

    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
      return respond({ error: "Invalid field types" }, 400);
    }

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return respond({ error: "Invalid email address" }, 400);
    }

    if (email.includes("\n") || email.includes("\r")) {
      return respond({ error: "Invalid email address" }, 400);
    }

    if (phone && (typeof phone !== "string" || phone.length > 30)) {
      return respond({ error: "Invalid phone number" }, 400);
    }

    if (product && (typeof product !== "string" || product.length > 200)) {
      return respond({ error: "Invalid product" }, 400);
    }

    const safeName = sanitize(name, 200);
    const safeEmail = sanitize(email, 254);
    const safePhone = phone ? sanitize(phone, 30) : "–";
    const safeProduct = product ? sanitize(product, 200) : "Allgemeine Anfrage";
    const safeMessage = sanitize(message, 5000).replace(/\n/g, "<br>");
    const safeSubject = `Neue Anfrage von ${safeName}`.slice(0, 200);

    const html = `
      <h2>Neue Kontaktanfrage von der Website</h2>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${safeName}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">E-Mail</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Telefon</td><td style="padding:8px;border-bottom:1px solid #eee;">${safePhone}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Produkt</td><td style="padding:8px;border-bottom:1px solid #eee;">${safeProduct}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Nachricht</td><td style="padding:8px;">${safeMessage}</td></tr>
      </table>
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
          reply_to: safeEmail.replace(/&[^;]+;/g, (m) => {
            const map: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" };
            return map[m] || m;
          }),
          subject: safeSubject,
          html,
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (!emailRes.ok) {
        console.error("Resend API error:", emailRes.status);
      }
    }

    return respond({ success: true }, 200);
  } catch (err) {
    console.error("Contact form error:", err);
    return respond({ error: "Internal server error" }, 500);
  }
});
