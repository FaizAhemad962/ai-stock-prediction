type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
  className?: string;
};

export function SectionHeader({ eyebrow, title, action, className = "" }: SectionHeaderProps) {
  return (
    <div className={`section-header ${className}`.trim()}>
      <div>
        {eyebrow ? <span className="card-label">{eyebrow}</span> : null}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}
