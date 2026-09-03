import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`ui-state empty-state ${className}`.trim()}>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
