import { BrainCircuit, ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { getInsights } from "../../services/api";
import { ErrorState } from "../ui/ErrorState";
import { LoadingState } from "../ui/LoadingState";

type Insight = {
  prediction: {
    outlook: string;
    confidence: number;
    summary: string;
  };
  explanation: string;
};

export function AIOutlook() {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getInsights<Insight>("SUZLON")
      .then((data) => {
        if (mounted) setInsight(data);
      })
      .catch((requestError: Error) => {
        if (mounted) setError(requestError.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (error) return <ErrorState className="ai-card" title="AI outlook unavailable" description={error} />;
  if (!insight) return <LoadingState className="ai-card" label="Loading AI outlook" />;

  return (
    <section className="ui-card ai-card">
      <div className="ai-header">
        <div className="ai-icon">
          <BrainCircuit size={19} />
        </div>

        <div>
          <span className="card-label">AI OUTLOOK</span>
          <h2>Market assessment</h2>
        </div>
      </div>

      <div className="ai-signal">
        <div className="signal-indicator">
          <span />
        </div>

        <div>
          <h3>{insight.prediction.outlook}</h3>
          <p>{insight.prediction.summary}</p>
        </div>
      </div>

      <div className="ai-confidence">
        <div>
          <span>Model confidence</span>
          <strong>{insight.prediction.confidence}%</strong>
        </div>

        <div className="confidence-bar">
          <div className="confidence-fill" style={{ width: `${insight.prediction.confidence}%` }} />
        </div>
      </div>

      <div className="ai-reason">
        <Sparkles size={15} />

        <p>
          {insight.explanation}
        </p>
      </div>

      <button className="ai-details">
        View AI reasoning
        <ChevronRight size={15} />
      </button>
    </section>
  );
}
