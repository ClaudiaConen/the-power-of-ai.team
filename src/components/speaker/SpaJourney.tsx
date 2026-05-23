import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface JourneyPhase {
  label: string;
  title: string;
  items: string[];
  note?: string;
}

const PHASES: JourneyPhase[] = [
  {
    label: 'VORHER',
    title: 'Vorbereitung',
    items: [
      'Pitch-Training',
      'Keynote-Coaching',
      'Ideengebung',
      'Breakout',
      'Social Media',
    ],
    note: 'Wir als Trainer voll mit drin',
  },
  {
    label: 'DEIN AUFTRITT',
    title: 'Dein Auftritt',
    items: [
      'Keynote auf der Bühne',
      'Elevator Pitch Programm',
      'Workbook',
      'Speaker Ausbildung',
      'Fotosession',
      'Barcamp',
      'Business Book',
    ],
  },
  {
    label: 'NACHHER',
    title: 'Wachstum',
    items: [
      'Workshops (live)',
      'Live-Trainings',
      'Online-Trainings',
      'Workbooks',
      'Buchprojekt',
      'Fotoshooting',
    ],
    note: 'Nach dem Event ist vor dem Event',
  },
];

export default function SpaJourney() {
  const [open, setOpen] = useState<number | null>(0);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <section className="spa-journey">
      <div className="spa-journey-inner">
        <p className="spa-journey-eyebrow">MEHR ALS EIN EVENT</p>
        <h2 className="spa-journey-h2">Mehr als ein Event.</h2>
        <p className="spa-journey-sub">
          Nutze die Reise vorher, mittendrin und danach für deinen Erfolg.
        </p>

        <div className="spa-journey-timeline">
          <div className="spa-journey-line" />
          <div className="spa-journey-loop" />

          {PHASES.map((phase, i) => (
            <div key={i} className="spa-journey-phase">
              <div className="spa-journey-marker">
                <span className="spa-journey-dot" />
              </div>
              <span className="spa-journey-phase-label">{phase.label}</span>
              <h3 className="spa-journey-phase-title">{phase.title}</h3>
            </div>
          ))}
        </div>

        <div className="spa-journey-cards">
          {PHASES.map((phase, i) => (
            <div
              key={i}
              className={`spa-journey-card${open === i ? ' spa-journey-card--open' : ''}`}
            >
              <button
                className="spa-journey-card-header"
                onClick={() => toggle(i)}
                aria-expanded={open === i}
              >
                <span className="spa-journey-card-label">{phase.label}</span>
                <span className="spa-journey-card-title">{phase.title}</span>
                <ChevronDown size={18} className="spa-journey-card-chevron" />
              </button>
              <div className="spa-journey-card-body">
                <ul>
                  {phase.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
                {phase.note && (
                  <p className="spa-journey-card-note">{phase.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="spa-journey-cta">
          <a href="#speaker-formular" className="spa-btn-koeln">
            <span className="spa-btn-koeln-glow" />
            Jetzt zur Speakeranmeldung <ChevronRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
