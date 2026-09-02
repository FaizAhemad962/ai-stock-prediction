import { Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const stocks = [
  {
    symbol: "SUZLON",
    name: "Suzlon Energy",
    exchange: "NSE",
    price: "₹52.40",
  },
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    exchange: "NSE",
    price: "₹1,420.25",
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors",
    exchange: "NSE",
    price: "₹742.80",
  },
];

export function StockSearch() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filteredStocks = stocks.filter((stock) => {
    const searchTerm = query.toLowerCase();

    return (
      stock.name.toLowerCase().includes(searchTerm) ||
      stock.symbol.toLowerCase().includes(searchTerm)
    );
  });

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
          onChange={(event) => setQuery(event.target.value)}
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
          {filteredStocks.length > 0 ? (
            filteredStocks.map((stock) => (
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
                    {stock.symbol} · {stock.exchange}
                  </span>
                </div>

                <span className="result-price">
                  {stock.price}
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