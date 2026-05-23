import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const csvContent = `Nr.;Route;Seitenname;Beschreibung
1;/;HomePage;Landingpage mit Hero-Bereich und CTA zum Kontaktformular
2;#power-upgrade;ProductDetail1;530-EUR-Coaching-Programm (Live-Pitch-Training, Zoom-Coaching, Buehnenauftritt Koeln)
3;#unersetzbar;ProductDetail2;990-EUR-Tagesworkshop (Positionierung, Wirkung, KI-Integration, Portrait-Fotografie)
4;#voice-to-brain;ProductDetail3;90-Tage-Umsetzungsprogramm (Storytelling, Performance, Online-Kurs, 9 Live-Treffen)
5;#power-of-ai-anmeldung;PowerOfAIRegistration;Event-Anmeldeformular The Power of AI - Edition Koeln (3. Mai 2026, Motorworld)
6;#power-of-ai-danke;PowerOfAIThankYou;Bestaetigungsseite nach Anmeldung mit Kalender-Integration und WhatsApp-Link
7;#speaker-anmeldung;SpeakerAnmeldung;Speaker-Registrierungsseite mit Hero, Ticket-Info, Community, Team-Info
8;#speaker-formular;SpeakerFormPage;Mehrstufiges Formular zur Erfassung des Speaker-Profils
9;#ablaufplan;Ablaufplan;Admin-Dashboard fuer Event-Ablaufplanung (Zeitplaene, Raeume, CSV-Export, Druck)
10;#kontakt;ContactPage;Kontaktseite mit Anfrage-Formular und Produkt-Vorauswahl ueber URL-Parameter
11;#admin;AdminLogin;Admin-Login mit E-Mail und Passwort ueber Supabase
12;#admin-reset;AdminPasswordReset;Passwort-Zuruecksetzen fuer Admin-Benutzer
13;#admin-dashboard;AdminDashboard;Speaker-Verwaltung, Kontakt-Einsendungen, Coupon-Management, Team-Verwaltung
14;#impressum;Impressum;Rechtliches Impressum (Claudia Conen, Steuer-ID, Haftungsausschluss)
15;#datenschutz;Datenschutz;Datenschutzerklaerung (DSGVO, Cookies, Hosting, Supabase, Zoom)
`;

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    return new Response(csvContent, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="Seitenuebersicht.csv"',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
