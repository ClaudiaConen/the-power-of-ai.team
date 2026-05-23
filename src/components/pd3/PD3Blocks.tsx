import { Headphones, MessageCircle, Video, Library, Users, Sparkles, BookOpen, Brain, Clock } from 'lucide-react';

const blocks = [
  {
    num: 1,
    title: 'Dein täglicher Anker, der Veränderung zur Gewohnheit macht.',
    subtitle: '90 persönliche Audio-Nachrichten von Claudia — direkt auf dein Handy per WhatsApp.',
    text: 'Jeden Tag eine echte Stimme, die dich kennt. Ein Stimmtraining, eine Bewusstseinsfrage, eine Umsetzungsaufgabe, die genau zu der Woche passt, in der du gerade bist. Du hörst sie, wann es für dich passt — beim ersten Kaffee, auf dem Weg zum Termin, vor dem Spiegel, wenn das Haus ruhig wird. Keine App. Keine Automatik. Keine Roboterstimme. Ich, persönlich, in deinem Ohr. 90 Tage hintereinander.',
    italic: 'Weil Wissen in Büchern verstaubt. Stimme dagegen geht direkt ins Unterbewusstsein.',
    value: '1.497',
    icon: Headphones,
    color: 'var(--pk)',
  },
  {
    num: 2,
    title: 'Dein persönliches Feedback — von mir, nicht vom Team.',
    subtitle: '3x pro Woche sprichst du mir eine Nachricht ein. Ich antworte dir persönlich.',
    text: 'Stell dir vor: Du gehst nach deinem schwierigen Kundengespräch in die Mittagspause, sprichst mir eine Sprachnachricht ein — und wenn du aus dem nächsten Meeting kommst, wartet meine Antwort auf deinem Handy. Persönlich. Spezifisch. Für genau deine Situation. Kein Team. Keine Textbausteine. Keine Community, die „du schaffst das" postet. Ich.',
    italic: 'Das ist das, was einen Kurs von einem Mentoring unterscheidet. Und das, was einen Online-Kurs von einem echten Durchbruch unterscheidet.',
    value: '1.297',
    icon: MessageCircle,
    color: 'var(--g2)',
  },
  {
    num: 3,
    title: 'Deine wöchentliche Live-Runde im Zoom.',
    subtitle: '13 Live-Calls à 90 Minuten — jeden Donnerstag, wählbar morgens oder abends.',
    text: 'Einmal pro Woche treffen wir uns alle. Du wählst zwischen 10:00–11:30 Uhr und 17:00–18:30 Uhr — je nachdem, ob du Morgenmensch bist oder deinen Tag mit dem Call ausklingen lässt. Hier üben wir gemeinsam. Hier stellst du die Fragen, die du dich woanders nicht traust. Hier siehst du die anderen wachsen — und spürst plötzlich, dass du nicht allein bist. Beide Termine werden aufgezeichnet. Du verpasst nichts.',
    italic: 'Kickoff am Montag, 5. Oktober 2026, 10:00–12:00 Uhr. Dein gemeinsamer Start in die Reise.',
    value: '1.197',
    icon: Video,
    color: 'var(--pk)',
  },
  {
    num: 4,
    title: 'Deine Audio-Bibliothek — für die Tiefe zwischen den Impulsen.',
    subtitle: 'Vertiefende Aufzeichnungen zu Tonalität, wirkungsvollem Auftritt, Storytelling und der Neurowissenschaft des Zuhörens.',
    text: 'Weil du nicht liest — du hörst. Diese Aufzeichnungen sind für die Zeit, in der du ohnehin kein Buch aufschlagen würdest: im Auto zum nächsten Termin, beim Spazierengehen mit dem Hund, auf dem Weg ins Meeting, in dem du gleich glänzen willst. Du drückst Play — und ich bin da. Mit den Themen, die den Unterschied machen zwischen „nett" und „unvergesslich".',
    italic: 'Tonalität. Wirkung. Storytelling. Die Wissenschaft des Zuhörens. Alles in deinem Ohr, immer griffbereit.',
    value: '497',
    icon: Library,
    color: 'var(--g2)',
  },
  {
    num: 5,
    title: 'Deine exklusive VOICE-TO-BRAIN-Community auf Telegram.',
    subtitle: 'Ein geschützter Raum — nur für die 25, die mit dir gehen.',
    text: 'Hier teilst du Durchbrüche, Rückschläge und die kleinen Momente, in denen etwas klick gemacht hat. Hier findest du Aufzeichnungen aller Calls. Hier siehst du, wie andere dieselben Hürden nehmen wie du — und merkst: „Ich bin nicht allein damit." Es ist kein Forum. Es ist ein Kreis. Kein Fremdenverkehr. Nur die 25.',
    italic: 'Weil der Weg leichter wird, wenn du ihn nicht allein gehst.',
    value: '297',
    icon: Users,
    color: 'var(--pk)',
  },
  {
    num: 6,
    title: 'Deine persönlichen KI-Prompts & deine eigenen GPTs.',
    subtitle: 'Die Abkürzung der KI nutzen — ohne deine Persönlichkeit zu verlieren.',
    text: 'Du bekommst von mir maßgeschneiderte KI-Prompts, die auf deine Sprache, deine Haltung, deine Stimme abgestimmt sind. Und ich zeige dir Schritt für Schritt, wie du deine eigenen GPTs baust — mit dem Fundament deiner Persönlichkeit fest darin hinterlegt. Damit dein Content nicht mehr nach „irgendjemand mit ChatGPT" klingt. Sondern nach dir. Unverwechselbar. Auch mit KI. Besonders mit KI.',
    italic: 'Das ist der Baustein, den in dieser Form kein anderes Stimm- oder Persönlichkeitsprogramm im deutschsprachigen Raum bietet.',
    value: '897',
    icon: Sparkles,
    color: 'var(--g2)',
  },
  {
    num: 7,
    title: 'Dein Elevator-Pitch-Workbook & dein Speaker-Workbook.',
    subtitle: 'Zwei persönliche Arbeitsbücher, die nach den 90 Tagen bei dir bleiben.',
    text: 'Das sind keine generischen PDFs von der Stange. Das sind zwei Workbooks, die mit dir während der 90 Tage gefüllt werden — und dann für immer bei dir bleiben. Immer, wenn du einen neuen Pitch brauchst, einen Vortrag vorbereitest, dich in einer neuen Rolle positionierst: Du schlägst sie auf. Und formulierst mit Leichtigkeit neu. Keine leere Seite mehr. Kein Grübeln. Klare Strukturen, die deine Handschrift bereits tragen.',
    italic: 'Dein Sicherheitsnetz — für jeden Tag nach dem Programm.',
    value: '397',
    icon: BookOpen,
    color: 'var(--pk)',
  },
  {
    num: 8,
    title: 'Die Neurowissenschaft des Kaufverhaltens.',
    subtitle: 'Verstehen, wann und warum Menschen wirklich „Ja" sagen.',
    text: 'Über 35 Jahre im emotionalen Verkauf — verdichtet in einem Modul, das dir zeigt, was im Gehirn deines Gegenübers in dem Moment passiert, in dem eine Kaufentscheidung fällt. Welche Worte öffnen. Welche schließen. Warum Storytelling wirkt, wenn Argumente versagen. Und wie du deine eigene Geschichte so erzählst, dass sie nicht nur gehört, sondern erinnert wird.',
    italic: 'Weil sich an Menschen erinnert wird — nicht an Features.',
    value: '397',
    icon: Brain,
    color: 'var(--g2)',
  },
  {
    num: 9,
    title: 'Deine Hintertür zu mehr Claudia-Zeit.',
    subtitle: 'Exklusiver Community-Tarif für persönliche Einzelstunden — nur für die 25.',
    text: 'Es gibt Momente im Programm, in denen du spürst: „Hier brauche ich gerade mehr." Vielleicht ein Gespräch vor einem wichtigen Pitch. Vielleicht eine Stunde nach einem Rückschlag, der dich überrascht hat. Für genau diese Momente öffne ich dir eine Tür, die für alle anderen verschlossen bleibt: Persönliche Einzelstunden zu einem Tarif, den nur die 25 bekommen.',
    italic: 'Weil manche Durchbrüche im Kreis passieren — und manche nur zu zweit.',
    value: '997',
    icon: Clock,
    color: 'var(--pk)',
  },
];

export default function PD3Blocks() {
  return (
    <section className="pd3-blocks">
      <div className="pd-w">
        <div className="pd-tl-header">
          <div className="lbl">Was du bekommst</div>
          <h2 className="sh2">
            9 Bausteine. 90 Tage.
            <br />
            Eine <em>Transformation.</em>
          </h2>
          <p className="slead">
            Das hier ist kein Kurs. Kein Membership. Kein PDF-Stapel. Das ist ein Mentoring-Programm, das dich Tag für Tag begleitet.
          </p>
        </div>

        <div className="pd3-blocks-list">
          {blocks.map((block) => (
            <div key={block.num} className="pd3-block">
              <div className="pd3-block-left">
                <div className="pd3-block-num" style={{ color: block.color }}>
                  #{block.num}
                </div>
                <div className="pd3-block-icon-wrap" style={{ borderColor: block.color }}>
                  <block.icon size={22} style={{ color: block.color }} />
                </div>
                <div className="pd3-block-value">
                  <span className="pd3-block-value-label">Wert</span>
                  <span className="pd3-block-value-num">{block.value} €</span>
                </div>
              </div>
              <div className="pd3-block-right">
                <h3 className="pd3-block-title">{block.title}</h3>
                <p className="pd3-block-subtitle">{block.subtitle}</p>
                <p className="pd3-block-text">{block.text}</p>
                <p className="pd3-block-italic">{block.italic}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pd3-total">
          <div className="pd3-total-label">Dein Gesamtwert auf einen Blick</div>
          <div className="pd3-total-num">7.473 €</div>
        </div>
      </div>
    </section>
  );
}
