type BadgeProps = {
  children: string;
  tone?: "neutral" | "positive" | "negative" | "warning";
  className?: string;
};

export function Badge({ children, tone = "neutral", className = "" }: BadgeProps) {
  return <span className={`ui-badge ${tone} ${className}`.trim()}>{children}</span>;
}
