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

import { mockStocks } from "../../data/mockData";

type Signal = {
  symbol: string;
  name: string;
  price: string;
  change: string;
  signal: "Bullish" | "Positive" | "Neutral" | "Caution";
  confidence: number;
};

const signalBySymbol: Record<string, Signal["signal"]> = {
  SUZLON: "Bullish",
  TATASTEEL: "Bullish",
  RELIANCE: "Positive",
  TCS: "Neutral",
  INFY: "Caution",
};

const confidenceBySymbol: Record<string, number> = {
  SUZLON: 78,
  TATASTEEL: 74,
  RELIANCE: 69,
  TCS: 56,
  INFY: 72,
};

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const signals: Signal[] = mockStocks.map((stock) => ({
  symbol: stock.symbol,
  name: stock.name,
  price: priceFormatter.format(stock.price),
  change: `${stock.changePercent >= 0 ? "+" : ""}${stock.changePercent.toFixed(2)}%`,
  signal: signalBySymbol[stock.symbol] ?? "Neutral",
  confidence: confidenceBySymbol[stock.symbol] ?? 50,
}));

const factors = [
  {
    title: "Technical momentum",
    description:
      "Price remains above the 50-day and 200-day moving averages.",
    score: 82,
    type: "positive",
  },
  {
    title: "Market sentiment",
    description:
      "Recent market activity indicates improving investor sentiment.",
    score: 74,
    type: "positive",
  },
  {
    title: "News sentiment",
    description:
      "Recent company and sector news is mostly positive.",
    score: 79,
    type: "positive",
  },
  {
    title: "Volatility risk",
    description:
      "Recent price movement indicates moderate short-term volatility.",
    score: 48,
    type: "neutral",
  },
];

const newsSignals = [
  {
    source: "Economic Times",
    symbol: "SUZLON",
    title:
      "Renewable energy stocks gain attention as sector outlook improves",
    sentiment: "Positive",
    time: "32 min ago",
  },
  {
    source: "Moneycontrol",
    symbol: "SUZLON",
    title:
      "Institutional interest increases across renewable energy companies",
    sentiment: "Positive",
    time: "1 hr ago",
  },
  {
    source: "Business Standard",
    symbol: "SUZLON",
    title:
      "Market participants watch upcoming policy developments",
    sentiment: "Neutral",
    time: "2 hrs ago",
  },
];

export function AIInsights() {
  return (
    <div className="ai-insights-page">
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
              <strong>72</strong>
              <span>/ 100</span>
            </div>

            <div>
              <span className="outlook-label">Overall sentiment</span>

              <div className="outlook-status">
                <ArrowUp size={13} />
                Positive
              </div>

              <p>
                Market momentum is currently positive, supported by
                improving technical indicators and constructive sector
                sentiment.
              </p>
            </div>
          </div>

          <div className="ai-progress">
            <div className="ai-progress-fill" />
          </div>

          <div className="ai-update">
            <span>Last analysis</span>
            <strong>2 minutes ago</strong>
          </div>
        </div>

        <div className="ai-mini-stack">
          <div className="ui-card ai-mini-card">
            <div className="mini-ai-icon green">
              <TrendingUp size={15} />
            </div>

            <div>
              <span>Positive signals</span>
              <strong>14</strong>
            </div>

            <span className="mini-card-change positive">
              +18%
            </span>
          </div>

          <div className="ui-card ai-mini-card">
            <div className="mini-ai-icon red">
              <ShieldAlert size={15} />
            </div>

            <div>
              <span>Risk alerts</span>
              <strong>3</strong>
            </div>

            <span className="mini-card-change negative">
              -8%
            </span>
          </div>

          <div className="ui-card ai-mini-card">
            <div className="mini-ai-icon purple">
              <Newspaper size={15} />
            </div>

            <div>
              <span>News analyzed</span>
              <strong>128</strong>
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
          {signals.map((stock) => (
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
            {factors.map((factor, index) => (
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
            <div className="risk-item">
              <span className="risk-level medium">MEDIUM</span>

              <div>
                <strong>Short-term volatility</strong>
                <p>
                  Price movements may remain elevated around major
                  market events.
                </p>
              </div>
            </div>

            <div className="risk-item">
              <span className="risk-level low">LOW</span>

              <div>
                <strong>Sector concentration</strong>
                <p>
                  Renewable energy exposure is currently increasing.
                </p>
              </div>
            </div>

            <div className="risk-item">
              <span className="risk-level medium">MEDIUM</span>

              <div>
                <strong>News sensitivity</strong>
                <p>
                  Company-specific announcements could affect the
                  short-term outlook.
                </p>
              </div>
            </div>
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
          {newsSignals.map((item) => (
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
