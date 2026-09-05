import {
  ArrowDown,
  ArrowUp,
  BriefcaseBusiness,
  CircleDollarSign,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { addPortfolioHolding, getPortfolio, getPortfolioPerformance, getStock, removePortfolioHolding } from "../../services/api";

const formatCurrency = (value: number) =>
  `₹${Math.abs(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatSignedCurrency = (value: number) =>
  `${value >= 0 ? "+" : "-"}${formatCurrency(value)}`;

type Holding = {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: string;
  currentPrice: string;
  pnl: string;
  pnlPercentage: string;
  positive: boolean;
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export function Portfolio() {
  const [portfolioHoldings, setPortfolioHoldings] = useState<Holding[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState({
    totalValue: 0,
    todayPnl: 0,
    overallPnl: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("1M");
  const [portfolioMessage, setPortfolioMessage] = useState("");
  const [manageOpen, setManageOpen] = useState(false);
  const [holdingSymbol, setHoldingSymbol] = useState("");
  const [holdingQuantity, setHoldingQuantity] = useState("");
  const [holdingAveragePrice, setHoldingAveragePrice] = useState("");
  const [mutationLoading, setMutationLoading] = useState(false);
  const [performance, setPerformance] = useState<Array<{ timestamp: string; totalValue: number }>>([]);

  useEffect(() => {
    let mounted = true;
    getPortfolio()
      .then(async (data) => {
        if (!mounted) return;

        const nextHoldings = await Promise.all(
          data.holdings.map(async (holding) => {
            const stock = await getStock(holding.symbol).catch(() => null);
            if (!stock) return null;

            const pnl = (holding.currentPrice - holding.averagePrice) * holding.quantity;
            const base = holding.averagePrice * holding.quantity;
            return {
              symbol: stock.symbol,
              name: stock.name,
              quantity: holding.quantity,
              averagePrice: currencyFormatter.format(holding.averagePrice),
              currentPrice: currencyFormatter.format(holding.currentPrice),
              pnl: `${pnl >= 0 ? "+" : ""}${currencyFormatter.format(pnl)}`,
              pnlPercentage: `${pnl >= 0 ? "+" : ""}${((pnl / base) * 100).toFixed(2)}%`,
              positive: pnl >= 0,
            } satisfies Holding;
          }),
        );

        setPortfolioHoldings(nextHoldings.filter((holding): holding is Holding => holding !== null));
        setPortfolioSummary({
          totalValue: data.totalValue,
          todayPnl: data.todayPnl,
          overallPnl: data.overallPnl,
        });
      })
      .catch((requestError: Error) => {
        if (mounted) setError(requestError.message);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    getPortfolioPerformance().then(setPerformance).catch(() => undefined);
    return () => { mounted = false; };
  }, []);

  if (isLoading) return <LoadingState className="portfolio-page" label="Loading portfolio" />;
  if (error) return <ErrorState className="portfolio-page" title="Portfolio unavailable" description={error} />;

  const allocationColors = ["#7187ff", "#35d399", "#b58cff", "#e5b75d", "#ff7188"];
  const allocationTotal = portfolioHoldings.reduce((total, holding) => total + holding.quantity, 0);
  const allocation = portfolioHoldings.map((holding, index) => ({
    name: holding.symbol,
    percentage: allocationTotal ? Math.round((holding.quantity / allocationTotal) * 100) : 0,
    color: allocationColors[index % allocationColors.length],
  }));
  const performancePath = performance.length > 1
    ? (() => {
      const values = performance.map((point) => point.totalValue);
      const min = Math.min(...values);
      const max = Math.max(...values);
      return performance.map((point, index) => {
        const x = (index / (performance.length - 1)) * 900;
        const y = 220 - ((point.totalValue - min) / Math.max(max - min, 1)) * 155;
        return `${index === 0 ? "M" : "L"}${x} ${y}`;
      }).join(" ");
    })()
    : "";
  const performanceArea = performancePath ? `${performancePath} L900 260 L0 260 Z` : "";

  const refreshPortfolio = () => {
    setIsLoading(true);
    setError("");
    return getPortfolio()
      .then(async (data) => {
        const nextHoldings = await Promise.all(data.holdings.map(async (holding) => {
          const stock = await getStock(holding.symbol).catch(() => null);
          if (!stock) return null;
          const pnl = (holding.currentPrice - holding.averagePrice) * holding.quantity;
          const base = holding.averagePrice * holding.quantity;
          return { symbol: stock.symbol, name: stock.name, quantity: holding.quantity, averagePrice: currencyFormatter.format(holding.averagePrice), currentPrice: currencyFormatter.format(holding.currentPrice), pnl: `${pnl >= 0 ? "+" : ""}${currencyFormatter.format(pnl)}`, pnlPercentage: `${pnl >= 0 ? "+" : ""}${((pnl / base) * 100).toFixed(2)}%`, positive: pnl >= 0 } satisfies Holding;
        }));
        setPortfolioHoldings(nextHoldings.filter((holding): holding is Holding => holding !== null));
        setPortfolioSummary({ totalValue: data.totalValue, todayPnl: data.todayPnl, overallPnl: data.overallPnl });
      })
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  };

  const submitHolding = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMutationLoading(true);
    void addPortfolioHolding({ symbol: holdingSymbol.trim().toUpperCase(), quantity: Number(holdingQuantity), average_price: Number(holdingAveragePrice) })
      .then(() => {
        setPortfolioMessage("Holding saved");
        setHoldingSymbol("");
        setHoldingQuantity("");
        setHoldingAveragePrice("");
        setManageOpen(false);
        return refreshPortfolio();
      })
      .catch((requestError: Error) => setPortfolioMessage(requestError.message))
      .finally(() => setMutationLoading(false));
  };

  const removeHolding = (symbol: string) => {
    setMutationLoading(true);
    void removePortfolioHolding(symbol)
      .then(() => { setPortfolioMessage(`${symbol} removed`); return refreshPortfolio(); })
      .catch((requestError: Error) => setPortfolioMessage(requestError.message))
      .finally(() => setMutationLoading(false));
  };

  return (
    <div className="portfolio-page" data-tour="portfolio">
      <section className="page-heading">
        <div>
          <p className="eyebrow">YOUR INVESTMENTS</p>

          <h1>Portfolio</h1>

          <p className="page-description">
            Monitor your holdings, performance and portfolio allocation.
          </p>
        </div>

        <button className="portfolio-action-button" onClick={() => setManageOpen(!manageOpen)}>
          <BriefcaseBusiness size={14} />
          Manage portfolio
        </button>
      </section>

      {portfolioMessage ? <p className="settings-status" role="status">{portfolioMessage}</p> : null}
      {manageOpen ? (
        <form className="ui-card portfolio-manage-form" onSubmit={submitHolding}>
          <input aria-label="Stock symbol" placeholder="Symbol e.g. INFY" value={holdingSymbol} onChange={(event) => setHoldingSymbol(event.target.value)} required />
          <input aria-label="Quantity" type="number" min="1" placeholder="Quantity" value={holdingQuantity} onChange={(event) => setHoldingQuantity(event.target.value)} required />
          <input aria-label="Average price" type="number" min="0.01" step="0.01" placeholder="Average price" value={holdingAveragePrice} onChange={(event) => setHoldingAveragePrice(event.target.value)} required />
          <button className="primary-button" type="submit" disabled={mutationLoading}>{mutationLoading ? "Saving..." : "Save holding"}</button>
        </form>
      ) : null}

      <section className="portfolio-summary">
        <div className="ui-card portfolio-summary-card">
          <div className="portfolio-card-icon">
            <CircleDollarSign size={17} />
          </div>

          <div>
            <span>Total portfolio value</span>
            <strong>{currencyFormatter.format(portfolioSummary.totalValue)}</strong>
          </div>

          <small>Current value</small>
        </div>

        <div className="ui-card portfolio-summary-card">
          <div className="portfolio-card-icon positive-icon">
            <TrendingUp size={17} />
          </div>

          <div>
            <span>Today's P&amp;L</span>
            <strong className={portfolioSummary.todayPnl >= 0 ? "positive" : "negative"}>
              {formatSignedCurrency(portfolioSummary.todayPnl)}
            </strong>
          </div>

          <small className={portfolioSummary.todayPnl >= 0 ? "positive" : "negative"}>
            {portfolioSummary.totalValue > 0
              ? `${((portfolioSummary.todayPnl / portfolioSummary.totalValue) * 100).toFixed(2)}%`
              : "0.00%"}
          </small>
        </div>

        <div className="ui-card portfolio-summary-card">
          <div className="portfolio-card-icon positive-icon">
            <ArrowUp size={17} />
          </div>

          <div>
            <span>Overall P&amp;L</span>
            <strong className={portfolioSummary.overallPnl >= 0 ? "positive" : "negative"}>
              {formatSignedCurrency(portfolioSummary.overallPnl)}
            </strong>
          </div>

          <small className={portfolioSummary.overallPnl >= 0 ? "positive" : "negative"}>
            {portfolioSummary.totalValue > 0
              ? `${((portfolioSummary.overallPnl / portfolioSummary.totalValue) * 100).toFixed(2)}%`
              : "0.00%"}
          </small>
        </div>
      </section>

      <section className="portfolio-main-grid">
        <div className="ui-card portfolio-performance-card">
          <div className="section-header compact">
            <div>
              <span className="card-label">PERFORMANCE</span>
              <h2>Portfolio growth</h2>
            </div>

            <div className="portfolio-period">
              {["1M", "6M", "1Y", "ALL"].map((period) => (
                <button key={period} className={selectedPeriod === period ? "active" : ""} onClick={() => setSelectedPeriod(period)}>{period}</button>
              ))}
            </div>
          </div>

          <div className="portfolio-chart">
            <div className="portfolio-chart-grid grid-1" />
            <div className="portfolio-chart-grid grid-2" />
            <div className="portfolio-chart-grid grid-3" />
            <div className="portfolio-chart-grid grid-4" />

            <svg
              viewBox="0 0 900 260"
              preserveAspectRatio="none"
              className="portfolio-line-chart"
            >
              <defs>
                <linearGradient
                  id="portfolioGradient"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#7187ff"
                    stopOpacity="0.22"
                  />
                  <stop
                    offset="100%"
                    stopColor="#7187ff"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              {performanceArea ? <path d={performanceArea} fill="url(#portfolioGradient)" /> : null}
              {performancePath ? <path d={performancePath} fill="none" stroke="#7187ff" strokeWidth="3" vectorEffect="non-scaling-stroke" /> : null}
            </svg>

            <div className="portfolio-chart-labels">
              <span>₹8.5L</span>
              <span>₹8.2L</span>
              <span>₹7.9L</span>
              <span>₹7.6L</span>
              <span>₹7.3L</span>
            </div>
          </div>
        </div>

        <div className="ui-card allocation-card">
          <div className="section-header compact">
            <div>
              <span className="card-label">ALLOCATION</span>
              <h2>Portfolio mix</h2>
            </div>

            <PieChart size={15} className="allocation-icon" />
          </div>

          <div className="allocation-visual">
            <div className="allocation-ring">
              <div className="allocation-ring-center">
                <strong>{portfolioHoldings.length}</strong>
                <span>Stocks</span>
              </div>
            </div>
          </div>

          <div className="allocation-list">
            {allocation.map((item) => (
              <div className="allocation-row" key={item.name}>
                <div>
                  <span
                    className="allocation-dot"
                    style={{ background: item.color }}
                  />
                  <span>{item.name}</span>
                </div>

                <strong>{item.percentage}%</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="holdings-section">
        <div className="section-header">
          <div>
            <span className="card-label">YOUR POSITIONS</span>
            <h2>Holdings</h2>
          </div>

          <span className="holding-count">
            {portfolioHoldings.length} stocks
          </span>
        </div>

        <div className="ui-card holdings-card">
          <div className="holdings-header">
            <span>STOCK</span>
            <span>QTY</span>
            <span>AVG. PRICE</span>
            <span>CURRENT</span>
            <span>P&amp;L</span>
          </div>

          <div className="holdings-list">
            {portfolioHoldings.length > 0 ? portfolioHoldings.map((holding) => (
              <div className="holding-row" key={holding.symbol}>
                <Link
                  className="holding-stock stock-link"
                  to={`/stock/${holding.symbol}`}
                >
                  <div className="holding-avatar">
                    {holding.symbol.charAt(0)}
                  </div>

                  <div>
                    <strong>{holding.symbol}</strong>
                    <span>{holding.name}</span>
                  </div>
                </Link>

                <span className="holding-value">
                  {holding.quantity}
                </span>

                <span className="holding-value">
                  {holding.averagePrice}
                </span>

                <span className="holding-value">
                  {holding.currentPrice}
                </span>

                <div
                  className={`holding-pnl ${
                    holding.positive ? "positive" : "negative"
                  }`}
                >
                  {holding.positive ? (
                    <ArrowUp size={11} />
                  ) : (
                    <ArrowDown size={11} />
                  )}

                  <div>
                    <strong>{holding.pnl}</strong>
                    <span>{holding.pnlPercentage}</span>
                  </div>
                </div>

                <button className="remove-stock-button" type="button" aria-label={`Remove ${holding.symbol}`} onClick={() => removeHolding(holding.symbol)} disabled={mutationLoading}>×</button>
              </div>
            )) : (
              <div className="portfolio-empty-state">No holdings are currently recorded for this account.</div>
            )}
          </div>
        </div>
      </section>

      <div className="portfolio-note">
        Portfolio values are supplied by the account portfolio endpoint.
      </div>
    </div>
  );
}
