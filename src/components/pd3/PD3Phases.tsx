import { Eye, Mic, Shield, BookOpen, Zap, Sparkles, Globe } from 'lucide-react';

const phases = [
  {
    phase: 1,
    label: 'PHASE 1 · SELBSTERKENNTNIS',
    days: 'Tag 1–30',
    motto: 'Wer bin ich wirklich — ohne Maske, ohne Rolle, ohne Vergleich?',
    color: 'var(--g2)',
    steps: [
      {
        num: 1,
        title: 'Dein Fundament',
        text: 'Wer bist du wirklich — ohne Maske, ohne Rolle, ohne Vergleich? Bevor du nach außen wirkst, schauen wir nach innen. Denn Selbsterkenntnis ist der erste Weg zum Selbstbewusstsein.',
        icon: Eye,
      },
      {
        num: 2,
        title: 'Deine Stimme',
        text: 'Dein akustischer Fingerabdruck. Du lernst sie zum ersten Mal wirklich kennen — Klang, Atem, Pausen, Resonanz. Und du lernst, was sie beim Zuhörer auslöst.',
        icon: Mic,
      },
      {
        num: 3,
        title: 'Deine Kohärenz',
        text: 'Der wichtigste Moment der ersten 30 Tage. Innen und außen werden eins. Was du sagst, wie du es sagst, wer du bist — alles aus einem Guss. Das ist die unsichtbare Brücke deiner Persönlichkeit.',
        icon: Shield,
      },
    ],
  },
  {
    phase: 2,
    label: 'PHASE 2 · SELBSTBEWUSSTSEIN',
    days: 'Tag 31–60',
    motto: 'Ich stehe zu mir — in jeder Situation.',
    color: 'var(--pk)',
    steps: [
      {
        num: 4,
        title: 'Deine Geschichte',
        text: 'Du verstehst die Neurowissenschaft des Kaufverhaltens: wann Menschen entscheiden und warum. Und du lernst, deine eigene Geschichte so zu erzählen, dass sie im Gedächtnis deines Gegenübers verankert wird.',
        icon: BookOpen,
      },
      {
        num: 5,
        title: 'Deine Wirkung unter Druck',
        text: 'Der Pitch. Das schwierige Gespräch. Die unerwartete Frage. Hier lernst du, warm und charismatisch zu bleiben, wenn der Druck steigt. Kein Verstellen mehr. Kein Verkrampfen. Nur du, souverän.',
        icon: Zap,
      },
    ],
  },
  {
    phase: 3,
    label: 'PHASE 3 · CHARISMATISCHES AUFTRETEN',
    days: 'Tag 61–90',
    motto: 'Ich zeige mich — unverwechselbar, sichtbar, unvergesslich.',
    color: 'var(--g3)',
    steps: [
      {
        num: 6,
        title: 'Deine KI als Verstärker',
        text: 'Du bekommst deine persönlichen KI-Prompts — damit du die Abkürzung der künstlichen Intelligenz selbstsicher nutzt, ohne deine Persönlichkeit zu verlieren. Und ich zeige dir, wie du deine eigenen GPTs baust und das Fundament deiner Persönlichkeit darin hinterlegst. Damit die KI nicht irgendeinen Content produziert — sondern deinen. In deiner Sprache. Mit deiner Haltung. Mit deiner Stimme.',
        icon: Sparkles,
      },
      {
        num: 7,
        title: 'Dein Auftritt in der Welt',
        text: 'Jetzt wirst du sichtbar. Kamera, Bühne, Social Media, Kundengespräch — egal wo. Du weißt, wer du bist, du kennst deine Stimme, du hast deine Geschichte, du hast deine Werkzeuge. Du gehst raus mit selbstbewusster Wirkung.',
        icon: Globe,
      },
    ],
  },
];

export default function PD3Phases() {
  return (
    <section className="pd-timeline">
      <div className="pd-w">
        <div className="pd-tl-header">
          <div className="lbl">Die 7 Schritte</div>
          <h2 className="sh2">
            In 90 Tagen. Raus aus der <em>KI-Masse.</em>
          </h2>
          <p className="slead">
            Hinein in deine unverwechselbare Wirkung.
          </p>
        </div>

        <div className="pd3-phases">
          {phases.map((phase) => (
            <div key={phase.phase} className="pd3-phase">
              <div className="pd3-phase-header" style={{ borderLeftColor: phase.color }}>
                <div className="pd3-phase-label" style={{ color: phase.color }}>
                  {phase.label}
                  <span className="pd3-phase-days">{phase.days}</span>
                </div>
                <p className="pd3-phase-motto">
                  „{phase.motto}"
                </p>
              </div>
              <div className="pd3-steps">
                {phase.steps.map((step) => (
                  <div key={step.num} className="pd3-step">
                    <div className="pd3-step-num" style={{ background: phase.color }}>
                      {step.num}
                    </div>
                    <div className="pd3-step-body">
                      <div className="pd3-step-top">
                        <h3 className="pd3-step-title">{step.title}</h3>
                        <step.icon size={20} className="pd3-step-icon" style={{ color: phase.color }} />
                      </div>
                      <p className="pd3-step-text">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
