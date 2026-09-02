import {
  ArrowUp,
  Bookmark,
  CalendarDays,
  ChevronDown,
  Info,
  Newspaper,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const stats = [
  { label: "Open", value: "₹51.20" },
  { label: "Previous Close", value: "₹51.32" },
  { label: "Day High", value: "₹53.10" },
  { label: "Day Low", value: "₹50.74" },
  { label: "52W High", value: "₹58.65" },
  { label: "52W Low", value: "₹32.10" },
  { label: "Market Cap", value: "₹71.4K Cr" },
  { label: "Volume", value: "8.42 Cr" },
];

const technicals = [
  {
    name: "RSI",
    value: "58.2",
    signal: "Neutral",
    type: "neutral",
  },
  {
    name: "MACD",
    value: "+1.24",
    signal: "Bullish",
    type: "positive",
  },
  {
    name: "50 DMA",
    value: "₹47.82",
    signal: "Above",
    type: "positive",
  },
  {
    name: "200 DMA",
    value: "₹41.56",
    signal: "Above",
    type: "positive",
  },
];

const news = [
  {
    source: "Economic Times",
    time: "32 min ago",
    title:
      "Renewable energy sector attracts renewed investor attention",
    sentiment: "Positive",
  },
  {
    source: "Moneycontrol",
    time: "1 hr ago",
    title:
      "Wind energy companies remain in focus as capacity additions accelerate",
    sentiment: "Positive",
  },
  {
    source: "Business Standard",
    time: "2 hrs ago",
    title:
      "Indian renewable energy market sees increasing institutional interest",
    sentiment: "Neutral",
  },
];

export function StockDetails() {
  return (
    <div className="stock-details-page">
      <section className="stock-detail-header">
        <div className="stock-company">
          <div className="large-stock-avatar">S</div>

          <div>
            <div className="stock-title-row">
              <h1>Suzlon Energy</h1>

              <span className="exchange-badge">NSE</span>
            </div>

            <p>SUZLON · Renewable Energy</p>
          </div>
        </div>

        <button className="watchlist-button">
          <Bookmark size={15} />
          Add to watchlist
        </button>
      </section>

      <section className="stock-price-section ui-card">
        <div>
          <span className="card-label">CURRENT PRICE</span>

          <div className="large-price">₹52.40</div>

          <div className="price-change positive">
            <ArrowUp size={14} />
            <strong>₹1.08</strong>
            <span>+2.10%</span>
            <span className="change-period">Today</span>
          </div>
        </div>

        <div className="prediction-summary">
          <div className="prediction-icon">
            <Sparkles size={16} />
          </div>

          <div>
            <span className="card-label">AI OUTLOOK</span>
            <strong>Bullish</strong>
            <span>78% confidence</span>
          </div>
        </div>
      </section>

      <section className="chart-card ui-card">
        <div className="chart-header">
          <div>
            <span className="card-label">PRICE HISTORY</span>
            <h2>SUZLON</h2>
          </div>

          <div className="chart-controls">
            {["1D", "1W", "1M", "6M", "1Y", "5Y"].map(
              (range, index) => (
                <button
                  className={index === 2 ? "active" : ""}
                  key={range}
                >
                  {range}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="stock-chart-placeholder">
          <div className="chart-grid-line line-one" />
          <div className="chart-grid-line line-two" />
          <div className="chart-grid-line line-three" />
          <div className="chart-grid-line line-four" />

          <svg
            viewBox="0 0 1000 300"
            preserveAspectRatio="none"
            className="price-line-chart"
          >
            <defs>
              <linearGradient
                id="stockGradient"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#7187ff"
                  stopOpacity="0.25"
                />
                <stop
                  offset="100%"
                  stopColor="#7187ff"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            <path
              d="M0 235 L70 220 L130 228 L190 195 L250 205 L310 175 L370 184 L430 145 L490 158 L550 126 L610 138 L670 105 L730 120 L790 92 L850 108 L920 65 L1000 82 L1000 300 L0 300 Z"
              fill="url(#stockGradient)"
            />

            <path
              d="M0 235 L70 220 L130 228 L190 195 L250 205 L310 175 L370 184 L430 145 L490 158 L550 126 L610 138 L670 105 L730 120 L790 92 L850 108 L920 65 L1000 82"
              fill="none"
              stroke="#7b8fff"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="chart-labels">
            <span>₹40</span>
            <span>₹45</span>
            <span>₹50</span>
            <span>₹55</span>
            <span>₹60</span>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="section-header">
          <div>
            <span className="card-label">MARKET DATA</span>
            <h2>Key statistics</h2>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="ui-card stat-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="stock-analysis-grid">
        <div className="ui-card technical-card">
          <div className="section-header compact">
            <div>
              <span className="card-label">TECHNICAL ANALYSIS</span>
              <h2>Technical indicators</h2>
            </div>
          </div>

          <div className="technical-list">
            {technicals.map((technical) => (
              <div className="technical-row" key={technical.name}>
                <div className="technical-name">
                  <div className="technical-icon">
                    <TrendingUp size={13} />
                  </div>

                  <span>{technical.name}</span>
                </div>

                <strong>{technical.value}</strong>

                <span className={`technical-signal ${technical.type}`}>
                  {technical.signal}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="ui-card ai-analysis-card">
          <div className="ai-heading">
            <div className="ai-icon">
              <Sparkles size={16} />
            </div>

            <div>
              <span className="card-label">AI ANALYSIS</span>
              <h2>Why the outlook is bullish</h2>
            </div>
          </div>

          <p>
            Current momentum remains positive, with the stock trading
            above its short and long-term moving averages. Recent
            sector strength is also supporting the overall outlook.
          </p>

          <div className="ai-factors">
            <div>
              <span>Technical momentum</span>
              <strong className="positive">Strong</strong>
            </div>

            <div>
              <span>Sector momentum</span>
              <strong className="positive">Positive</strong>
            </div>

            <div>
              <span>Risk level</span>
              <strong className="neutral">Moderate</strong>
            </div>
          </div>

          <div className="ai-disclaimer">
            <Info size={13} />
            <span>
              AI analysis is informational and should not be treated
              as financial advice.
            </span>
          </div>
        </div>
      </section>

      <section className="stock-news-section">
        <div className="section-header">
          <div>
            <span className="card-label">NEWS INTELLIGENCE</span>
            <h2>Latest Suzlon news</h2>
          </div>

          <button className="view-all-button">
            View all
            <ChevronDown size={13} />
          </button>
        </div>

        <div className="stock-news-list">
          {news.map((item) => (
            <article className="ui-card stock-news-card" key={item.title}>
              <div className="news-source-icon">
                <Newspaper size={15} />
              </div>

              <div className="stock-news-content">
                <div className="news-meta">
                  <span>{item.source}</span>
                  <span>{item.time}</span>
                </div>

                <h3>{item.title}</h3>

                <span
                  className={`sentiment ${
                    item.sentiment === "Positive"
                      ? "sentiment-positive"
                      : "sentiment-neutral"
                  }`}
                >
                  {item.sentiment}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="disclaimer">
        <CalendarDays size={13} />
        <span>
          Market data and predictions shown here are mock values for
          the current UI development phase.
        </span>
      </section>
    </div>
  );
}
