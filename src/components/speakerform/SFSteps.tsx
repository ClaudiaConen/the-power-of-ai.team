export default function SFSteps() {
  return (
    <div className="sf-steps">
      <div className="sf-step sf-step--active">
        <span className="sf-step-circle">1</span>
        <span className="sf-step-label">Eintragen</span>
      </div>
      <span className="sf-step-line" />
      <div className="sf-step">
        <span className="sf-step-circle">2</span>
        <span className="sf-step-label">Prüfung</span>
      </div>
      <span className="sf-step-line" />
      <div className="sf-step">
        <span className="sf-step-circle">3</span>
        <span className="sf-step-label">Bestätigt</span>
      </div>
    </div>
  );
}
