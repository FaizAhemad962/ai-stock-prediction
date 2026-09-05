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
import { useEffect, useState } from "react";

import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { useWatchlist } from "../../components/WatchlistContext/useWatchlist";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { StatCard } from "../../components/ui/StatCard";
import { getPrediction, getStock, getStockHistory, getStockNews, getStockTechnicals } from "../../services/api";
import type { PricePoint, Stock } from "../../types/stock";

type PublicPrediction = {
  outlook: string;
  confidence: number;
  uncertainty: number;
  summary: string;
  risks: string[];
};

type TechnicalView = { name: string; value: string; signal: string; type: "neutral" | "positive" | "negative" };
type NewsView = { source: string; time: string; title: string; sentiment: "Positive" | "Neutral" | "Negative" };

export function StockDetails() {
  const { symbol = "SUZLON" } = useParams();
  const { isWatched, toggleWatchlist } = useWatchlist();
  const [stock, setStock] = useState<Stock | null>(null);
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [technicals, setTechnicals] = useState<TechnicalView[]>([]);
  const [news, setNews] = useState<NewsView[]>([]);
  const [prediction, setPrediction] = useState<PublicPrediction | null>(null);
  const [selectedRange, setSelectedRange] = useState("1M");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    Promise.all([
      getStock(symbol),
      getStockHistory(symbol, selectedRange),
      getStockTechnicals(symbol),
      getStockNews(symbol),
      getPrediction<PublicPrediction>(symbol),
    ])
      .then(([stockData, historyData, technicalData, newsData, predictionData]) => {
        if (!mounted) return;
        setStock(stockData);
        setHistory(historyData);
        setTechnicals(technicalData.map((item) => ({
          name: item.label,
          value: item.value,
          signal: item.signal,
          type: item.signal === "Neutral" ? "neutral" : item.signal === "Bullish" || item.signal === "Positive" ? "positive" : "negative",
        })));
        setNews(newsData.map((item) => ({ source: item.source, time: item.publishedAt, title: item.title, sentiment: item.sentiment })));
        setPrediction(predictionData);
      })
      .catch((requestError: Error) => {
        if (mounted) setError(requestError.message);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [selectedRange, symbol]);

  if (isLoading) return <LoadingState className="stock-details-page" label="Loading stock details" />;
  if (error) return <ErrorState className="stock-details-page" title="Stock details unavailable" description={error} />;
  if (!stock) {
    return <EmptyState className="stock-details-page" title="Stock not found" description={`No live market data is available for ${symbol.toUpperCase()}.`} action={<Link className="view-all-button" to="/markets">Back to markets</Link>} />;
  }

  const isPositive = stock.change >= 0;
  const minimumPrice = history.length ? Math.min(...history.map((point) => point.price)) : 0;
  const maximumPrice = history.length ? Math.max(...history.map((point) => point.price)) : 0;
  const historyPath = history.length > 1 ? history.map((point, index) => {
    const x = (index / (history.length - 1)) * 1000;
    const y = 235 - ((point.price - minimumPrice) / Math.max(maximumPrice - minimumPrice, 0.01)) * 170;
    return `${index === 0 ? "M" : "L"}${x} ${y}`;
  }).join(" ") : "";
  const chartLabels = history.length > 0
    ? [history[0], history[Math.floor(history.length / 2)], history[history.length - 1]].map((point, index) => ({ label: new Date(point.timestamp).toLocaleDateString("en-IN", { month: "short", year: "numeric" }), key: `${point.timestamp}-${index}` }))
    : [];
  const areaPath = historyPath ? `${historyPath} L1000 300 L0 300 Z` : "";

  return (
    <div className="stock-details-page">
      <section className="stock-detail-header">
        <div className="stock-company">
          <div className="large-stock-avatar">{stock.symbol.charAt(0)}</div>
          <div>
            <div className="stock-title-row"><h1>{stock.name}</h1><span className="exchange-badge">{stock.market}</span></div>
            <p>{stock.symbol} · {stock.sector}</p>
          </div>
        </div>
        <button className="watchlist-button" onClick={() => toggleWatchlist(stock.symbol)} aria-pressed={isWatched(stock.symbol)}>
          <Bookmark size={15} />
          {isWatched(stock.symbol) ? "Remove from watchlist" : "Add to watchlist"}
        </button>
      </section>

      <section className="stock-price-section ui-card">
        <div>
          <span className="card-label">CURRENT PRICE</span>
          <div className="large-price">{stock.currency === "INR" ? "₹" : stock.currency}{stock.price.toFixed(2)}</div>
          <div className={`price-change ${isPositive ? "positive" : "negative"}`}>
            {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <strong>{isPositive ? "+" : "-"}{stock.currency === "INR" ? "₹" : stock.currency}{Math.abs(stock.change).toFixed(2)}</strong>
            <span>{isPositive ? "+" : "-"}{Math.abs(stock.changePercent).toFixed(2)}%</span>
            <span className="change-period">Today</span>
          </div>
        </div>
        <div className="prediction-summary">
          <div className="prediction-icon"><Sparkles size={16} /></div>
          <div><span className="card-label">RULE-BASED OUTLOOK</span><strong>{prediction?.outlook ?? "Unavailable"}</strong><span>{prediction?.confidence ?? 0}% confidence</span></div>
        </div>
      </section>

      <section className="chart-card ui-card">
        <div className="chart-header">
          <div><span className="card-label">PRICE HISTORY</span><h2>{stock.symbol}</h2></div>
          <div className="chart-controls">{["1D", "1W", "1M", "6M", "1Y", "5Y"].map((range) => <button className={selectedRange === range ? "active" : ""} key={range} onClick={() => setSelectedRange(range)}>{range}</button>)}</div>
        </div>
        <div className="stock-chart-placeholder">
          <div className="chart-grid-line line-one" /><div className="chart-grid-line line-two" /><div className="chart-grid-line line-three" /><div className="chart-grid-line line-four" />
          <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="price-line-chart">
            <defs><linearGradient id="stockGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#7187ff" stopOpacity="0.25" /><stop offset="100%" stopColor="#7187ff" stopOpacity="0" /></linearGradient></defs>
            {areaPath ? <path d={areaPath} fill="url(#stockGradient)" /> : null}
            {historyPath ? <path d={historyPath} fill="none" stroke="#7b8fff" strokeWidth="3" vectorEffect="non-scaling-stroke" /> : null}
          </svg>
          <div className="chart-labels"><span>{minimumPrice ? `₹${maximumPrice.toFixed(2)}` : "—"}</span><span>{minimumPrice ? `₹${minimumPrice.toFixed(2)}` : "—"}</span></div>
        </div>
        <div className="chart-footer">{chartLabels.map((item) => <span key={item.key}>{item.label}</span>)}</div>
      </section>

      <section className="stats-section"><SectionHeader eyebrow="MARKET DATA" title="Key statistics" /><div className="stats-grid">
        <StatCard label="Market" value={stock.market.toUpperCase()} />
        <StatCard label="Day change" value={`${isPositive ? "+" : "-"}${Math.abs(stock.changePercent).toFixed(2)}%`} />
        <StatCard label="Market cap" value={stock.marketCap ? `₹${(stock.marketCap / 1_000_000).toFixed(1)}M` : "N/A"} />
        <StatCard label="Volume" value={stock.volume ? stock.volume.toLocaleString("en-IN") : "N/A"} />
      </div></section>

      <section className="stock-analysis-grid">
        <div className="ui-card technical-card"><div className="section-header compact"><div><span className="card-label">TECHNICAL ANALYSIS</span><h2>Technical indicators</h2></div></div><div className="technical-list">
          {technicals.map((technical) => <div className="technical-row" key={technical.name}><div className="technical-name"><div className="technical-icon"><TrendingUp size={13} /></div><span>{technical.name}</span></div><strong>{technical.value}</strong><span className={`technical-signal ${technical.type}`}>{technical.signal}</span></div>)}
        </div></div>
        <div className="ui-card ai-analysis-card"><div className="ai-heading"><div className="ai-icon"><Sparkles size={16} /></div><div><span className="card-label">MODEL ANALYSIS</span><h2>Why the outlook is {prediction?.outlook.toLowerCase() ?? "unavailable"}</h2></div></div><p>{prediction?.summary ?? "Prediction details are unavailable."}</p><div className="ai-factors"><div><span>Confidence</span><strong className="positive">{prediction?.confidence ?? 0}%</strong></div><div><span>Uncertainty</span><strong className="neutral">{prediction?.uncertainty ?? 0}%</strong></div><div><span>Risks</span><strong className="neutral">{prediction?.risks.length ?? 0}</strong></div></div><div className="ai-disclaimer"><Info size={13} /><span>This analysis is informational and is not financial advice.</span></div></div>
      </section>

      <section className="stock-news-section"><SectionHeader eyebrow="NEWS INTELLIGENCE" title={`Latest ${stock.name} news`} action={<Link className="view-all-button" to="/news">View all<ChevronDown size={13} /></Link>} /><div className="stock-news-list">
        {news.length > 0 ? news.map((item) => <article className="ui-card stock-news-card" key={`${item.source}-${item.title}`}><div className="news-source-icon"><Newspaper size={15} /></div><div className="stock-news-content"><div className="news-meta"><span>{item.source}</span><span>{item.time}</span></div><h3>{item.title}</h3><span className={`sentiment ${item.sentiment === "Positive" ? "sentiment-positive" : item.sentiment === "Negative" ? "sentiment-negative" : "sentiment-neutral"}`}>{item.sentiment}</span></div></article>) : <EmptyState title="No related news" description="The news provider returned no articles for this stock." />}
      </div></section>

      <section className="disclaimer"><CalendarDays size={13} /><span>Market data and predictions are supplied by the server-side provider and rule-based signal service.</span></section>
    </div>
  );
}
