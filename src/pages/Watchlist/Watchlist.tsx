import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";

type Stock = {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changeValue: string;
  signal: "Bullish" | "Positive" | "Neutral" | "Caution";
};

const initialStocks: Stock[] = [
  {
    symbol: "SUZLON",
    name: "Suzlon Energy",
    price: "₹52.40",
    change: "+2.10%",
    changeValue: "+₹1.08",
    signal: "Bullish",
  },
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    price: "₹1,421.30",
    change: "+0.82%",
    changeValue: "+₹11.55",
    signal: "Positive",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: "₹3,184.50",
    change: "-0.41%",
    changeValue: "-₹13.10",
    signal: "Neutral",
  },
  {
    symbol: "INFY",
    name: "Infosys",
    price: "₹1,482.20",
    change: "-2.14%",
    changeValue: "-₹32.40",
    signal: "Caution",
  },
  {
    symbol: "TATASTEEL",
    name: "Tata Steel",
    price: "₹168.25",
    change: "+3.68%",
    changeValue: "+₹5.97",
    signal: "Bullish",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    price: "₹1,742.60",
    change: "+0.36%",
    changeValue: "+₹6.25",
    signal: "Positive",
  },
];

export function Watchlist() {
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const [search, setSearch] = useState("");

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

  const removeStock = (symbol: string) => {
    setStocks((current) =>
      current.filter((stock) => stock.symbol !== symbol),
    );
  };

  return (
    <div className="watchlist-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">YOUR MARKET LIST</p>

          <h1>Watchlist</h1>

          <p className="page-description">
            Keep track of the stocks you're interested in.
          </p>
        </div>

        <button className="primary-button">
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
                    <div className="watch-stock">
                      <div className="watch-stock-avatar">
                        {stock.symbol.charAt(0)}
                      </div>

                      <div>
                        <strong>{stock.symbol}</strong>
                        <span>{stock.name}</span>
                      </div>
                    </div>

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
                      onClick={() => removeStock(stock.symbol)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="watchlist-empty">
            <Search size={22} />

            <h3>No stocks found</h3>

            <p>
              Try searching for another stock in your watchlist.
            </p>
          </div>
        )}
      </section>

      <div className="mock-data-note">
        Watchlist data is currently stored locally for UI development.
      </div>
    </div>
  );
}
