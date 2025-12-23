export default function StatCard({ title, value, variant }) {
  return (
    <div className={`acc-card stat-${variant}`}>
      <p className="text-sm acc-muted">{title}</p>
      <h2 className="text-2xl font-semibold mt-2">{value}</h2>
    </div>
  );
}
