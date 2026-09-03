import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  CalendarDays,
  ChevronDown,
  Info,
  Newspaper,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { EmptyState } from "../../components/ui/EmptyState";
import { useWatchlist } from "../../components/WatchlistContext/useWatchlist";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { StatCard } from "../../components/ui/StatCard";
import { getMockStock, mockStockDetail } from "../../data/mockData";

export function StockDetails() {
  const { symbol = "SUZLON" } = useParams();
  const stock = getMockStock(symbol);
  const { isWatched, toggleWatchlist } = useWatchlist();

  if (!stock) {
    return (
      <EmptyState
        className="stock-details-page"
        title="Stock not found"
        description={`No mock market data is available for ${symbol.toUpperCase()}.`}
        action={<Link className="view-all-button" to="/markets">Back to markets</Link>}
      />
    );
  }

  const isPositive = stock.change >= 0;
  const price = `₹${stock.price.toFixed(2)}`;
  const change = `${isPositive ? "+" : "-"}₹${Math.abs(stock.change).toFixed(2)}`;
  const percentage = `${isPositive ? "+" : "-"}${Math.abs(stock.changePercent).toFixed(2)}%`;
  const { stats, technicals, news } = mockStockDetail;

  return (
    <div className="stock-details-page">
      <section className="stock-detail-header">
        <div className="stock-company">
          <div className="large-stock-avatar">{stock.symbol.charAt(0)}</div>

          <div>
            <div className="stock-title-row">
              <h1>{stock.name}</h1>

              <span className="exchange-badge">NSE</span>
            </div>

            <p>{stock.symbol} · {stock.sector}</p>
          </div>
        </div>

        <button
          className="watchlist-button"
          onClick={() => toggleWatchlist(stock.symbol)}
          aria-pressed={isWatched(stock.symbol)}
        >
          <Bookmark size={15} />
          {isWatched(stock.symbol) ? "Remove from watchlist" : "Add to watchlist"}
        </button>
      </section>

      <section className="stock-price-section ui-card">
        <div>
          <span className="card-label">CURRENT PRICE</span>

          <div className="large-price">{price}</div>

          <div className={`price-change ${isPositive ? "positive" : "negative"}`}>
            {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <strong>{change}</strong>
            <span>{percentage}</span>
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
            <h2>{stock.symbol}</h2>
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
        <SectionHeader eyebrow="MARKET DATA" title="Key statistics" />

        <div className="stats-grid">
          {stats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
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
        <SectionHeader
          eyebrow="NEWS INTELLIGENCE"
          title={`Latest ${stock.name} news`}
          action={
            <button className="view-all-button">
              View all
              <ChevronDown size={13} />
            </button>
          }
        />

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
