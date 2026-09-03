import { Search, X } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchStocks } from "../../services/api";
import type { Stock } from "../../types/stock";

export function StockSearch() {
  const [query, setQuery] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchTerm = query.trim();

    if (!searchTerm) {
      return;
    }

    let mounted = true;
    searchStocks(searchTerm)
      .then((results) => {
        if (mounted) setStocks(results);
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [query]);

  const handleStockSelect = (symbol: string) => {
    setQuery("");
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className="stock-search">
      <div className="stock-search-input">
        <Search size={18} />

        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsLoading(Boolean(event.target.value.trim()));
            setError(false);
          }}
          placeholder="Search for a stock, company or symbol..."
          aria-label="Search stocks"
        />

        {query && (
          <button
            className="search-clear"
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {query && (
        <div className="search-results">
          {isLoading ? (
            <div className="search-no-results"><span>Searching stocks...</span></div>
          ) : error ? (
            <div className="search-no-results"><span>Stock search is unavailable.</span></div>
          ) : stocks.length > 0 ? (
            stocks.map((stock) => (
              <button
                key={stock.symbol}
                className="search-result"
                onClick={() => handleStockSelect(stock.symbol)}
              >
                <div className="result-symbol">
                  {stock.symbol.charAt(0)}
                </div>

                <div>
                  <strong>{stock.name}</strong>

                  <span>
                    {stock.symbol} · {stock.market}
                  </span>
                </div>

                <span className="result-price">
                  ₹{stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </button>
            ))
          ) : (
            <div className="search-no-results">
              <Search size={15} />

              <span>
                No matching stocks found
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}