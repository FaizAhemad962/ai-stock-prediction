type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Unable to load this data",
  description = "Please try again.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`ui-state error-state ${className}`.trim()} role="alert">
      <h3>{title}</h3>
      <p>{description}</p>
      {onRetry ? <button onClick={onRetry}>Try again</button> : null}
    </div>
  );
}
