import { Card } from "./Card";

type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  className?: string;
};

export function StatCard({ label, value, detail, className = "" }: StatCardProps) {
  return (
    <Card className={`stat-card ${className}`.trim()}>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </Card>
  );
}
