import {
  AlertTriangle,
  ArrowUp,
  Brain,
  ChevronRight,
  CircleCheck,
  Info,
  Newspaper,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { getInsights } from "../../services/api";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";

type Signal = {
  symbol: string;
  name: string;
  price: string;
  change: string;
  signal: "Bullish" | "Positive" | "Neutral" | "Caution";
  confidence: number;
};

type InsightsPageData = {
  items: Array<{
    symbol: string;
    name: string;
    price: number;
    change_percent: number;
    prediction: { outlook: Signal["signal"]; confidence: number };
  }>;
  market_score: number;
  market_sentiment: string;
  market_summary: string;
  positive_signals: number;
  positive_signals_change: string;
  risk_alerts: number;
  risk_alerts_change: string;
  news_analyzed: number;
  last_analysis: string;
  factors: Array<{ title: string; description: string; score: number; type: string }>;
  risks: Array<{ level: string; title: string; description: string }>;
  news_signals: Array<{ source: string; symbol: string; title: string; sentiment: string; time: string }>;
};

export function AIInsights() {
  const [insights, setInsights] = useState<InsightsPageData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getInsights<InsightsPageData>()
      .then(setInsights)
      .catch((requestError: Error) => setError(requestError.message));
  }, []);

  if (error) return <ErrorState className="ai-insights-page" title="AI insights unavailable" description={error} />;
  if (!insights) return <LoadingState className="ai-insights-page" label="Loading AI insights" />;

  const displaySignals: Signal[] = insights.items.map((item) => ({
    symbol: item.symbol,
    name: item.name,
    price: `₹${item.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    change: `${item.change_percent >= 0 ? "+" : ""}${item.change_percent.toFixed(2)}%`,
    signal: item.prediction.outlook,
    confidence: item.prediction.confidence,
  }));

  return (
    <div className="ai-insights-page" data-tour="ai-insights">
      <section className="page-heading">
        <div>
          <p className="eyebrow">INTELLIGENCE CENTER</p>

          <h1>AI Insights</h1>

          <p className="page-description">
            Understand what the AI sees across markets, stocks and
            current news.
          </p>
        </div>

        <div className="ai-status">
          <span className="ai-status-dot" />
          AI engine ready
        </div>
      </section>

      <section className="ai-overview-grid">
        <div className="ui-card ai-overview-card main-ai-card">
          <div className="main-ai-top">
            <div className="large-ai-icon">
              <Brain size={22} />
            </div>

            <div>
              <span className="card-label">MARKET INTELLIGENCE</span>
              <h2>AI Market Outlook</h2>
            </div>
          </div>

          <div className="market-outlook">
            <div className="outlook-score">
              <strong>{insights.market_score}</strong>
              <span>/ 100</span>
            </div>

            <div>
              <span className="outlook-label">Overall sentiment</span>

              <div className="outlook-status">
                <ArrowUp size={13} />
                {insights.market_sentiment}
              </div>

              <p>
                {insights.market_summary}
              </p>
            </div>
          </div>

          <div className="ai-progress">
            <div className="ai-progress-fill" style={{ width: `${insights.market_score}%` }} />
          </div>

          <div className="ai-update">
            <span>Last analysis</span>
            <strong>{insights.last_analysis}</strong>
          </div>
        </div>

        <div className="ai-mini-stack">
          <div className="ui-card ai-mini-card">
            <div className="mini-ai-icon green">
              <TrendingUp size={15} />
            </div>

            <div>
              <span>Positive signals</span>
              <strong>{insights.positive_signals}</strong>
            </div>

            <span className="mini-card-change positive">
              {insights.positive_signals_change}
            </span>
          </div>

          <div className="ui-card ai-mini-card">
            <div className="mini-ai-icon red">
              <ShieldAlert size={15} />
            </div>

            <div>
              <span>Risk alerts</span>
              <strong>{insights.risk_alerts}</strong>
            </div>

            <span className="mini-card-change negative">
              {insights.risk_alerts_change}
            </span>
          </div>

          <div className="ui-card ai-mini-card">
            <div className="mini-ai-icon purple">
              <Newspaper size={15} />
            </div>

            <div>
              <span>News analyzed</span>
              <strong>{insights.news_analyzed}</strong>
            </div>

            <span className="mini-card-change">
              Today
            </span>
          </div>
        </div>
      </section>

      <section className="ai-section">
        <div className="section-header">
          <div>
            <span className="card-label">AI STOCK SIGNALS</span>
            <h2>Stocks the AI is watching</h2>
          </div>

          <Link className="text-action" to="/markets">
            View all
            <ChevronRight size={13} />
          </Link>
        </div>

        <div className="signal-grid">
          {displaySignals.map((stock) => (
            <Link
              className="ui-card signal-card signal-card-link"
              key={stock.symbol}
              to={`/stock/${stock.symbol}`}
            >
              <div className="signal-card-header">
                <div className="signal-stock">
                  <div className="signal-avatar">
                    {stock.symbol.charAt(0)}
                  </div>

                  <div>
                    <strong>{stock.symbol}</strong>
                    <span>{stock.name}</span>
                  </div>
                </div>

                <Sparkles size={14} className="signal-sparkle" />
              </div>

              <div className="signal-price">
                <strong>{stock.price}</strong>

                <span
                  className={
                    stock.change.startsWith("+")
                      ? "positive"
                      : "negative"
                  }
                >
                  {stock.change}
                </span>
              </div>

              <div className="signal-divider" />

              <div className="signal-result">
                <div>
                  <span>AI signal</span>

                  <strong
                    className={`signal-${stock.signal.toLowerCase()}`}
                  >
                    {stock.signal}
                  </strong>
                </div>

                <div className="confidence">
                  <span>Confidence</span>
                  <strong>{stock.confidence}%</strong>
                </div>
              </div>

              <div className="confidence-bar">
                <div
                  className={`confidence-fill signal-${stock.signal.toLowerCase()}-fill`}
                  style={{
                    width: `${stock.confidence}%`,
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="ai-analysis-layout">
        <div className="ui-card ai-reasoning-card">
          <div className="section-header compact">
            <div>
              <span className="card-label">AI REASONING</span>
              <h2>Why the AI is bullish on SUZLON</h2>
            </div>

            <Sparkles size={15} className="signal-sparkle" />
          </div>

          <div className="reasoning-list">
            {insights.factors.map((factor, index) => (
              <div className="reasoning-item" key={factor.title}>
                <div className="reasoning-number">
                  0{index + 1}
                </div>

                <div className="reasoning-content">
                  <div className="reasoning-title">
                    <strong>{factor.title}</strong>

                    <span className={factor.type}>
                      {factor.score}/100
                    </span>
                  </div>

                  <p>{factor.description}</p>

                  <div className="factor-bar">
                    <div
                      className={`factor-fill ${factor.type}`}
                      style={{
                        width: `${factor.score}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ui-card ai-risk-card">
          <div className="risk-header">
            <div className="risk-icon">
              <AlertTriangle size={16} />
            </div>

            <div>
              <span className="card-label">RISK MONITOR</span>
              <h2>Things to watch</h2>
            </div>
          </div>

          <div className="risk-list">
            {insights.risks.map((risk) => (
            <div className="risk-item" key={risk.title}>
              <span className={`risk-level ${risk.level.toLowerCase()}`}>{risk.level}</span>

              <div>
                <strong>{risk.title}</strong>
                <p>{risk.description}</p>
              </div>
            </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ai-news-section">
        <div className="section-header">
          <div>
            <span className="card-label">NEWS INTELLIGENCE</span>
            <h2>News affecting AI signals</h2>
          </div>

          <Link className="text-action" to="/news">
            Open news center
            <ChevronRight size={13} />
          </Link>
        </div>

        <div className="ai-news-grid">
          {insights.news_signals.map((item) => (
            <article className="ui-card ai-news-card" key={item.title}>
              <div className="ai-news-top">
                <div className="news-source-icon">
                  <Newspaper size={14} />
                </div>

                <div>
                  <strong>{item.source}</strong>
                  <span>{item.time}</span>
                </div>

                <span
                  className={`news-sentiment ${
                    item.sentiment === "Positive"
                      ? "positive"
                      : "neutral"
                  }`}
                >
                  {item.sentiment}
                </span>
              </div>

              <h3>{item.title}</h3>

              <Link className="read-analysis" to={`/stock/${item.symbol}`}>
                AI analysis
                <ChevronRight size={12} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <div className="ai-disclaimer-large">
        <CircleCheck size={13} />

        <span>
          AI insights are generated from market, technical and news
          signals. They are intended for research and informational
          purposes only and are not financial advice.
        </span>

        <Info size={13} />
      </div>
    </div>
  );
}
