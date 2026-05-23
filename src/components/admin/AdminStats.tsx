interface Props {
  counts: { eingereicht: number; bestaetigt: number; abgelehnt: number; total: number };
}

export default function AdminStats({ counts }: Props) {
  return (
    <div className="ad-stats">
      <div className="ad-stat-card">
        <span className="ad-stat-num">{counts.total}</span>
        <span className="ad-stat-label">Gesamt</span>
      </div>
      <div className="ad-stat-card ad-stat-card--gold">
        <span className="ad-stat-num">{counts.eingereicht}</span>
        <span className="ad-stat-label">Eingereicht</span>
      </div>
      <div className="ad-stat-card ad-stat-card--green">
        <span className="ad-stat-num">{counts.bestaetigt}</span>
        <span className="ad-stat-label">Bestätigt</span>
      </div>
      <div className="ad-stat-card ad-stat-card--red">
        <span className="ad-stat-num">{counts.abgelehnt}</span>
        <span className="ad-stat-label">Abgelehnt</span>
      </div>
    </div>
  );
}
