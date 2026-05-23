import { MapPin, Camera, Fingerprint, Rocket, Users } from 'lucide-react';

const items = [
  {
    icon: MapPin,
    title: 'Willst du Macher-Menschen live in Köln treffen?',
    sub: 'Vielleicht bald auch in deiner Stadt.',
  },
  {
    icon: Camera,
    title: 'Willst du Bühne und Publikum für deinen Auftritt nutzen?',
    sub: 'Mit Fotos, Videos und Elevator Pitch – inklusive professionellem Training.',
  },
  {
    icon: Fingerprint,
    title: 'Willst du im KI-Zeitalter unverwechselbar sein?',
    sub: 'Mit klarer Positionierung, starker Präsenz und sichtbarer Persönlichkeit.',
  },
  {
    icon: Rocket,
    title: 'Willst du vom Wissen ins Handeln kommen?',
    sub: 'Mit Umsetzung, die dich in die Wirkung bringt.',
  },
  {
    icon: Users,
    title: 'Willst du dich mit Macher-Menschen vernetzen?',
    sub: 'Gratis Community für Austausch, Rückenwind und neue Chancen.',
  },
];

export default function Strip() {
  return (
    <div className="strip-v2">
      {items.map((item, i) => (
        <div key={i} className={`strip-v2-item rv${i > 0 ? ` d${i}` : ''}`}>
          <div className="strip-v2-icon">
            <item.icon size={18} />
          </div>
          <div>
            <div className="strip-v2-title">{item.title}</div>
            <div className="strip-v2-sub">{item.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
