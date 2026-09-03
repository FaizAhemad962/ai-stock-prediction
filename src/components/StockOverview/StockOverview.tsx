import { ArrowDown, ArrowUp, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getStock } from "../../services/api";
import { useWatchlist } from "../WatchlistContext/useWatchlist";
import { LoadingState } from "../ui/LoadingState";
import { ErrorState } from "../ui/ErrorState";
import type { Stock } from "../../types/stock";

export function StockOverview() {
  const [stock, setStock] = useState<Stock | null>(null);
  const [error, setError] = useState("");
  const { isWatched, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    getStock("SUZLON")
      .then(setStock)
      .catch((requestError: Error) => setError(requestError.message));
  }, []);

  if (error) return <ErrorState className="stock-overview" title="Stock overview unavailable" description={error} />;
  if (!stock) return <LoadingState className="stock-overview" label="Loading featured stock" />;

  const isPositive = stock.change >= 0;

  return (
    <section className="stock-overview ui-card">
      <div className="stock-main">
        <div className="stock-logo">{stock.symbol.charAt(0)}</div>

        <div>
          <div className="stock-title-row">
            <h2>{stock.name}</h2>

            <span className="stock-symbol">{stock.symbol}</span>
          </div>

          <p className="stock-exchange">{stock.market} · {stock.sector}</p>
        </div>
      </div>

      <div className="stock-price">
        <strong>₹{stock.price.toFixed(2)}</strong>

        <div className={isPositive ? "positive" : "negative"}>
          {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}

          <span>₹{Math.abs(stock.change).toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
        </div>
      </div>

      <button
        className="watch-button"
        aria-label={`${isWatched(stock.symbol) ? "Remove" : "Add"} ${stock.symbol} from watchlist`}
        aria-pressed={isWatched(stock.symbol)}
        onClick={() => toggleWatchlist(stock.symbol)}
      >
        <Star size={17} />
      </button>
    </section>
  );
}
