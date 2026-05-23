import { Calendar, Headphones, Sun, Sunset, Video, MessageCircle, Users } from 'lucide-react';

const scheduleItems = [
  {
    icon: Headphones,
    label: 'Montag bis Freitag',
    title: 'Dein Audio-Impuls per WhatsApp.',
    text: 'Dein persönlicher Begleiter durch den Tag. Stimmtraining, Bewusstseinsarbeit, Umsetzungsimpulse. 2–4 Minuten. Du hörst sie, wann es für dich passt.',
    color: 'var(--pk)',
  },
  {
    icon: Sun,
    label: 'Samstag',
    title: 'Deine Reflexions-Audio.',
    text: 'Eine Frage, die du mit durchs Wochenende nimmst. Keine Aufgabe. Nur ein Moment mit dir selbst.',
    color: 'var(--g2)',
  },
  {
    icon: Sunset,
    label: 'Sonntag',
    title: 'Deine Einstimmung.',
    text: 'Ein Gedanke, ein Impuls, eine warme Stimme für die kommende Woche.',
    color: 'var(--g2)',
  },
  {
    icon: Video,
    label: 'Jeden Donnerstag',
    title: 'Live-Call im Zoom (90 Minuten).',
    text: 'Du wählst zwischen 10:00–11:30 Uhr und 17:00–18:30 Uhr. Beide Termine werden aufgezeichnet.',
    color: 'var(--pk)',
  },
  {
    icon: MessageCircle,
    label: '3x pro Woche',
    title: 'Dein persönliches Feedback.',
    text: 'Du schickst mir eine Sprachnachricht nach einer Aufgabe oder einem Durchbruch. Ich antworte dir persönlich — kein Team, keine Automatik. Von mir.',
    color: 'var(--pk)',
  },
  {
    icon: Users,
    label: 'Durchgehend',
    title: 'Telegram-Community + Audio-Bibliothek.',
    text: 'Rund um die Uhr Zugang zu Aufzeichnungen und Austausch mit Menschen, die denselben Weg gehen.',
    color: 'var(--g2)',
  },
];

export default function PD3Schedule() {
  return (
    <section className="pd3-schedule">
      <div className="pd-w">
        <div className="pd-tl-header">
          <div className="lbl">Dein Rhythmus</div>
          <h2 className="sh2">
            90 Tage. Kein Tag ohne <em>dich und mich.</em>
          </h2>
        </div>

        <div className="pd3-kickoff">
          <Calendar size={24} style={{ color: 'var(--g5)' }} />
          <div>
            <div className="pd3-kickoff-title">Start: Montag, 5. Oktober 2026</div>
            <p className="pd3-kickoff-text">
              Wir starten bewusst gemeinsam. Weil Anfänge Raum brauchen. Am 5.10.2026 um 10:00 Uhr sehen wir uns zum ersten Mal live im Zoom — zum Kickoff-Call von 10:00 bis 12:00 Uhr. Du lernst mich, die anderen Teilnehmer und deine Reise der nächsten 90 Tage kennen. Gemeinsam.
            </p>
            <p className="pd3-kickoff-accent">
              Und dann beginnt sie. Tag für Tag. Direkt in deinem Ohr.
            </p>
          </div>
        </div>

        <div className="pd3-schedule-grid">
          {scheduleItems.map((item, i) => (
            <div key={i} className="pd3-sched-item">
              <div className="pd3-sched-icon" style={{ borderColor: item.color }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <div>
                <div className="pd3-sched-label" style={{ color: item.color }}>{item.label}</div>
                <h4 className="pd3-sched-title">{item.title}</h4>
                <p className="pd3-sched-text">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
