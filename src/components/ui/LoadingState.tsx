type LoadingStateProps = {
  label?: string;
  className?: string;
};

export function LoadingState({ label = "Loading market data", className = "" }: LoadingStateProps) {
  return (
    <div className={`ui-state loading-state ${className}`.trim()} role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
