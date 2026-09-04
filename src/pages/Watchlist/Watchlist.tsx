import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useWatchlist } from "../../components/WatchlistContext/useWatchlist";
import { mockStocks } from "../../data/mockData";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingState } from "../../components/ui/LoadingState";

type Stock = {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changeValue: string;
  signal: "Bullish" | "Positive" | "Neutral" | "Caution";
};

const signalBySymbol: Record<string, Stock["signal"]> = {
  SUZLON: "Bullish",
  RELIANCE: "Positive",
  TCS: "Neutral",
  INFY: "Caution",
  TATASTEEL: "Bullish",
  HDFCBANK: "Positive",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const initialStocks: Stock[] = mockStocks.map((stock) => ({
  symbol: stock.symbol,
  name: stock.name,
  price: currencyFormatter.format(stock.price),
  change: `${stock.changePercent >= 0 ? "+" : ""}${stock.changePercent.toFixed(2)}%`,
  changeValue: `${stock.change >= 0 ? "+" : "-"}${currencyFormatter.format(Math.abs(stock.change))}`,
  signal: signalBySymbol[stock.symbol] ?? "Neutral",
}));

export function Watchlist() {
  const { symbols, isLoading, toggleWatchlist } = useWatchlist();
  const [search, setSearch] = useState("");
  const stocks = initialStocks.filter((stock) => symbols.includes(stock.symbol));

  const filteredStocks = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return stocks;
    }

    return stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query),
    );
  }, [search, stocks]);

  if (isLoading) {
    return <LoadingState className="watchlist-page" label="Loading watchlist" />;
  }

  const addStock = () => {
    const nextStock = initialStocks.find((stock) => !symbols.includes(stock.symbol));

    if (nextStock) {
      toggleWatchlist(nextStock.symbol);
    }
  };

  return (
    <div className="watchlist-page" data-tour="watchlist">
      <section className="page-heading">
        <div>
          <p className="eyebrow">YOUR MARKET LIST</p>

          <h1>Watchlist</h1>

          <p className="page-description">
            Keep track of the stocks you're interested in.
          </p>
        </div>

        <button className="primary-button" onClick={addStock}>
          <Plus size={14} />
          Add stock
        </button>
      </section>

      <section className="watchlist-summary">
        <div className="ui-card watch-summary-card">
          <div className="summary-icon">
            <Star size={16} />
          </div>

          <div>
            <span>Stocks tracked</span>
            <strong>{stocks.length}</strong>
          </div>
        </div>

        <div className="ui-card watch-summary-card">
          <div className="summary-icon positive-icon">
            <ArrowUp size={16} />
          </div>

          <div>
            <span>Positive today</span>
            <strong>
              {stocks.filter((stock) => stock.change.startsWith("+")).length}
            </strong>
          </div>
        </div>

        <div className="ui-card watch-summary-card">
          <div className="summary-icon negative-icon">
            <ArrowDown size={16} />
          </div>

          <div>
            <span>Negative today</span>
            <strong>
              {stocks.filter((stock) => stock.change.startsWith("-")).length}
            </strong>
          </div>
        </div>
      </section>

      <section className="watchlist-card ui-card">
        <div className="watchlist-toolbar">
          <div className="watchlist-title">
            <Star size={15} />
            <h2>My stocks</h2>
          </div>

          <div className="watchlist-search">
            <Search size={14} />

            <input
              type="text"
              placeholder="Search watchlist..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {filteredStocks.length > 0 ? (
          <div className="watchlist-table-wrapper">
            <div className="watchlist-table-header">
              <span>STOCK</span>
              <span>PRICE</span>
              <span>CHANGE</span>
              <span>AI SIGNAL</span>
              <span />
            </div>

            <div className="watchlist-table">
              {filteredStocks.map((stock) => {
                const positive = stock.change.startsWith("+");

                return (
                  <div
                    className="watchlist-row"
                    key={stock.symbol}
                  >
                    <Link
                      className="watch-stock stock-link"
                      to={`/stock/${stock.symbol}`}
                    >
                      <div className="watch-stock-avatar">
                        {stock.symbol.charAt(0)}
                      </div>

                      <div>
                        <strong>{stock.symbol}</strong>
                        <span>{stock.name}</span>
                      </div>
                    </Link>

                    <div className="watch-price">
                      <strong>{stock.price}</strong>
                      <span>{stock.changeValue}</span>
                    </div>

                    <div
                      className={`watch-change ${
                        positive ? "positive" : "negative"
                      }`}
                    >
                      {positive ? (
                        <ArrowUp size={11} />
                      ) : (
                        <ArrowDown size={11} />
                      )}

                      {stock.change}
                    </div>

                    <div>
                      <span
                        className={`ai-signal ai-${stock.signal.toLowerCase()}`}
                      >
                        {stock.signal}
                      </span>
                    </div>

                    <button
                      className="remove-stock-button"
                      title={`Remove ${stock.symbol}`}
                      onClick={() => toggleWatchlist(stock.symbol)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState
            className="watchlist-empty"
            title={stocks.length === 0 ? "Your watchlist is empty" : "No stocks found"}
            description={
              stocks.length === 0
                ? "Add a stock to start tracking its market activity."
                : "Try searching for another stock in your watchlist."
            }
          />
        )}
      </section>

      <div className="mock-data-note">
        Watchlist data is currently stored locally for UI development.
      </div>
    </div>
  );
}
