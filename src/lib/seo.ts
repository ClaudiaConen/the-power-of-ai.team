const BASE_URL = 'https://the-power-of-ai.team';
const BASE_TITLE = 'Claudia Conen | Die Umsatzstimme';

const TITLES: Record<string, string> = {
  '': `UNVERWECHSELBAR — ${BASE_TITLE}`,
  '#power-upgrade': `Power Upgrade — Live Punkten | ${BASE_TITLE}`,
  '#unersetzbar': `Unersetzbar — Der Live Tag | ${BASE_TITLE}`,
  '#voice-to-brain': `Voice to Brain — 90 Tage Mentoring | ${BASE_TITLE}`,
  '#kontakt': `Kontakt — ${BASE_TITLE}`,
  '#impressum': `Impressum — ${BASE_TITLE}`,
  '#datenschutz': `Datenschutz — ${BASE_TITLE}`,
  '#power-of-ai-anmeldung': `Verbindliche Anmeldung — The Power of AI — Koeln 2026`,
  '#power-of-ai-danke': `Es ist beschlossen — The Power of AI — Koeln 2026`,
  '#speaker-anmeldung': `Speaker-Anmeldung — The Power of AI`,
  '#speaker-formular': `Speaker-Formular — The Power of AI`,
  '#admin': `Admin — The Power of AI`,
  '#admin-dashboard': `Admin-Dashboard — The Power of AI`,
  '#ablaufplan': `Ablaufplan — The Power of AI`,
  '#community': `Skool Community — The Power of AI`,
};

const DESCRIPTIONS: Record<string, string> = {
  '': 'Claudia Conen begleitet Unternehmer, Speaker und Coaches zu unverwechselbarer Wirkung mit Stimme, Charisma und KI. Ueber 35 Jahre Erfahrung im emotionalen Verkauf.',
  '#power-upgrade': 'Power Upgrade — das Live Pitch Event mit Claudia Conen und Ronny Barthel. Lerne in einem Tag, wie du auf jeder Buehne ueberzeugst und im Gedaechtnis bleibst.',
  '#unersetzbar': 'Unersetzbar — der Live Tag fuer Positionierung und Wirkung. Mit Klaus, Claudia Conen und Ronny Barthel findest du deine unverwechselbare Marke.',
  '#voice-to-brain': '90 Tage Mentoring mit Claudia Conen — taeglich Audio-Impulse, woechentliche Live-Calls und KI-Integration. 7 Schritte raus aus der KI-Masse.',
  '#kontakt': 'Kontaktiere Claudia Conen — Die Umsatzstimme. Fragen zu Mentoring, Speaker Coaching oder Events? Schreibe uns direkt.',
  '#power-of-ai-anmeldung': 'Verbindliche Anmeldung fuer The Power of AI Koeln 2026 — das Event fuer Wirkungskraft Mensch im KI-Zeitalter.',
  '#speaker-anmeldung': 'Werde Speaker bei The Power of AI — bewirb dich jetzt fuer einen Auftritt auf unserer Buehne in Koeln.',
  '#community': 'Die Skool Community von The Power of AI — vernetze dich mit Gleichgesinnten, die im KI-Zeitalter auf Persoenlichkeit setzen.',
  '#ablaufplan': 'Ablaufplan fuer The Power of AI Koeln 2026 — alle Speaker, Zeiten und Programmpunkte auf einen Blick.',
};

const DEFAULT_OG_IMAGE = `${BASE_URL}/og-power-of-ai-team.jpeg`;
const EVENT_OG_IMAGE = `${BASE_URL}/Vorschau_Bild_1280x680_(1).jpg`;
const SPEAKER_OG_IMAGE = `${BASE_URL}/SpeakerAnmeldeseite.jpg`;
const LIVETAG_OG_IMAGE = `${BASE_URL}/Livetag.jpg`;
const MENTORING_OG_IMAGE = `${BASE_URL}/Umsetzungsmentoring.jpg`;
const ABLAUFPLAN_OG_IMAGE = `${BASE_URL}/Ablaufplan.jpg`;

const OG_IMAGES: Record<string, string> = {
  '#power-of-ai-anmeldung': EVENT_OG_IMAGE,
  '#power-of-ai-danke': EVENT_OG_IMAGE,
  '#speaker-formular': SPEAKER_OG_IMAGE,
  '#unersetzbar': LIVETAG_OG_IMAGE,
  '#voice-to-brain': MENTORING_OG_IMAGE,
  '#ablaufplan': ABLAUFPLAN_OG_IMAGE,
};

function updateMeta(hash: string) {
  const ogImg = document.querySelector<HTMLMetaElement>('meta[property="og:image"]');
  const twImg = document.querySelector<HTMLMetaElement>('meta[name="twitter:image"]');
  const imgUrl = OG_IMAGES[hash] || DEFAULT_OG_IMAGE;
  if (ogImg) ogImg.content = imgUrl;
  if (twImg) twImg.content = imgUrl;

  const desc = DESCRIPTIONS[hash] || DESCRIPTIONS[''];
  const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
  const twDesc = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');
  if (metaDesc) metaDesc.content = desc;
  if (ogDesc) ogDesc.content = desc;
  if (twDesc) twDesc.content = desc;

  const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const pageUrl = hash ? `${BASE_URL}/${hash}` : `${BASE_URL}/`;
  if (ogUrl) ogUrl.content = pageUrl;
  if (canonical) canonical.href = pageUrl;
}

export function updatePageTitle(hash: string) {
  const key = hash.startsWith('#kontakt') ? '#kontakt'
    : hash.startsWith('#speaker-formular') ? '#speaker-formular'
    : hash;
  document.title = TITLES[key] || TITLES[''];
  updateMeta(key);
}

export function injectStructuredData() {
  const existing = document.getElementById('ld-json-seo');
  if (existing) return;

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Die Umsatzstimme — Claudia Conen',
    url: BASE_URL,
    logo: `${BASE_URL}/THE_POWER_OF.png`,
    description: 'Claudia Conen begleitet Unternehmer, Speaker und Coaches zu unverwechselbarer Wirkung — mit Stimme, Charisma und KI als Verstaerker.',
    founder: {
      '@type': 'Person',
      name: 'Claudia Conen',
      jobTitle: 'Mentorin fuer Stimme, Wirkung und Charisma',
      description: 'Ueber 35 Jahre Erfahrung im emotionalen Verkauf. Die Umsatzstimme. Mentorin fuer unverwechselbare Persoenlichkeit im KI-Zeitalter.',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'kontakt@the-power-of-ai.team',
      contactType: 'customer service',
      availableLanguage: 'German',
    },
  };

  const product = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Voice to Brain — 90 Tage Mentoring',
    description: '90 Tage persoenliches Mentoring mit Claudia Conen. Taeglich Audio-Impulse, woechentliche Live-Calls, persoenliches Feedback und KI-Integration. 7 Schritte raus aus der KI-Masse — hin zu unverwechselbarer Wirkung.',
    brand: { '@type': 'Brand', name: 'Claudia Conen — Die Umsatzstimme' },
    offers: [
      {
        '@type': 'Offer',
        name: 'Gruppen-Mentoring (max. 25 Teilnehmer)',
        price: '1497',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/LimitedAvailability',
        validFrom: '2026-04-01',
        url: 'https://umsatzstimme-claudiaconen.tentary.com/p/QkM0W5/checkout',
      },
      {
        '@type': 'Offer',
        name: '1:1-Mentoring',
        price: '4997',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/LimitedAvailability',
      },
    ],
  };

  const event = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'The Power of AI — Wirkungskraft Mensch im KI-Zeitalter',
    description: 'Das Live-Event in Koeln fuer alle, die im Zeitalter kuenstlicher Intelligenz auf echte Persoenlichkeit setzen. Speaker, Networking und Impulse fuer Unternehmer und Coaches.',
    startDate: '2026-09-20',
    endDate: '2026-09-21',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'Koeln',
      address: { '@type': 'PostalAddress', addressLocality: 'Koeln', addressCountry: 'DE' },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Die Umsatzstimme — Claudia Conen',
      url: BASE_URL,
    },
    image: `${BASE_URL}/Vorschau_Bild_1280x680_(1).jpg`,
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/#power-of-ai-anmeldung`,
      availability: 'https://schema.org/LimitedAvailability',
      priceCurrency: 'EUR',
    },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Power Upgrade', item: `${BASE_URL}/#power-upgrade` },
      { '@type': 'ListItem', position: 3, name: 'Unersetzbar', item: `${BASE_URL}/#unersetzbar` },
      { '@type': 'ListItem', position: 4, name: 'Voice to Brain', item: `${BASE_URL}/#voice-to-brain` },
      { '@type': 'ListItem', position: 5, name: 'Kontakt', item: `${BASE_URL}/#kontakt` },
    ],
  };

  const script = document.createElement('script');
  script.id = 'ld-json-seo';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify([organization, product, event, breadcrumb]);
  document.head.appendChild(script);
}
