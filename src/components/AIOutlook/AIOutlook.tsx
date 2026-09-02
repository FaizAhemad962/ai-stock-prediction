import { BrainCircuit, ChevronRight, Sparkles } from "lucide-react";

export function AIOutlook() {
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
          <h3>Moderately Positive</h3>
          <p>Illustrative signal for UI preview</p>
        </div>
      </div>

      <div className="ai-confidence">
        <div>
          <span>Demo confidence</span>
          <strong>72%</strong>
        </div>

        <div className="confidence-bar">
          <div className="confidence-fill" />
        </div>
      </div>

      <div className="ai-reason">
        <Sparkles size={15} />

        <p>
          Positive price momentum is currently supported by the broader trend
          and technical indicators.
        </p>
      </div>

      <button className="ai-details">
        View AI reasoning
        <ChevronRight size={15} />
      </button>
    </section>
  );
}
