import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { SectionHeader } from "../../components/ui/SectionHeader";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { getMarketOverview, type MarketOverview } from "../../services/api";

export function Markets() {
  const [overview, setOverview] = useState<MarketOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOverview = () => {
    setIsLoading(true);
    setError("");

    getMarketOverview()
      .then(setOverview)
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    let mounted = true;

    getMarketOverview()
      .then((data) => {
        if (mounted) {
          setOverview(data);
        }
      })
      .catch((requestError: Error) => {
        if (mounted) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingState className="markets-page" label="Loading market overview" />;
  }

  if (error) {
    return (
      <ErrorState
        className="markets-page"
        title="Market overview unavailable"
        description={error}
        onRetry={loadOverview}
      />
    );
  }

  if (!overview) {
    return (
      <EmptyState
        className="markets-page"
        title="No market data"
        description="The backend returned no market overview data."
      />
    );
  }

  return (
    <div className="markets-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">MARKET OVERVIEW</p>

          <h1>Markets</h1>

          <p className="page-description">
            Track market indices, sectors, gainers and losers in one place.
          </p>
        </div>

        <div className="market-status">
          <span className="status-dot" />
          <span>Markets {overview.marketStatus}</span>
        </div>
      </section>

      <section className="market-indices">
        {overview.indices.map((index) => (
          <div className="ui-card index-card" key={index.name}>
            <div className="index-card-header">
              <span>{index.name}</span>

              <BarChart3 size={15} />
            </div>

            <h2>{index.value}</h2>

            <div
              className={`market-change ${
                index.positive ? "positive" : "negative"
              }`}
            >
              {index.positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}

              <span>{index.change}</span>
              <span>{index.percentage}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="market-lists">
        <MarketStockList
          title="Top Gainers"
          icon={<TrendingUp size={15} />}
          stocks={overview.gainers}
          positive
        />

        <MarketStockList
          title="Top Losers"
          icon={<ArrowDown size={15} />}
          stocks={overview.losers}
          positive={false}
        />
      </section>

      <section className="sector-section">
        <SectionHeader eyebrow="SECTOR ANALYSIS" title="Sector performance" />

        <div className="sector-grid">
          {overview.sectors.map((sector) => (
            <div className="ui-card sector-card" key={sector.name}>
              <div className="sector-icon">
                <Activity size={15} />
              </div>

              <div className="sector-information">
                <span>{sector.name}</span>

                <strong className={sector.positive ? "positive" : "negative"}>
                  {sector.performance}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

type Stock = {
  symbol: string;
  name: string;
  price: string;
  change: string;
};

type MarketStockListProps = {
  title: string;
  icon: React.ReactNode;
  stocks: Stock[];
  positive: boolean;
};

function MarketStockList({
  title,
  icon,
  stocks,
  positive,
}: MarketStockListProps) {
  return (
    <section className="ui-card market-list-card">
      <div className="section-header compact">
        <div className="list-title">
          {icon}
          <h2>{title}</h2>
        </div>

        <Link className="view-all-button" to="/markets">View all</Link>
      </div>

      <div className="market-stock-list">
        {stocks.map((stock) => (
          <Link
            className="market-stock-row stock-row-link"
            key={stock.symbol}
            to={`/stock/${stock.symbol}`}
          >
            <div className="stock-symbol">
              <div className="stock-avatar">{stock.symbol.charAt(0)}</div>

              <div>
                <strong>{stock.symbol}</strong>
                <span>{stock.name}</span>
              </div>
            </div>

            <span className="stock-price">{stock.price}</span>

            <span
              className={`stock-performance ${
                positive ? "positive" : "negative"
              }`}
            >
              {stock.change}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
