import ronnyImg from '../../assets/Ronny.png';
import claudiaImg from '../../assets/Claudia.png';
import gabiImg from '../../assets/Gabi.png';

const TEAM = [
  { name: 'Ronny Barthel', role: 'Veranstalter & Gesamtkonzept', img: ronnyImg },
  { name: 'Claudia Conen', role: 'Host & Pitch-Training', img: claudiaImg },
  { name: 'Gabi Lindemann', role: 'Webdesign & Technik', img: gabiImg },
];

export default function SpaTeam() {
  return (
    <section className="spa-team">
      <div className="spa-team-inner">
        <p className="spa-team-eyebrow">DAS TEAM</p>
        <h2 className="spa-team-h2">Wer kümmert sich um was</h2>

        <div className="spa-team-grid">
          {TEAM.map((member, i) => (
            <div key={i} className="spa-team-card">
              <div className="spa-team-avatar">
                <img src={member.img} alt={member.name} />
              </div>
              <h3 className="spa-team-name">{member.name}</h3>
              <p className="spa-team-role">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
