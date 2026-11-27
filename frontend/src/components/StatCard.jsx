export default function StatCard({ label, value, note, tone }) {
  return (
    <div className={`stat${tone ? ` ${tone}` : ""}`}>
      <div className="value">{value}</div>
      <div className="label">{label}</div>
      {note && <div className="note">{note}</div>}
    </div>
  );
}