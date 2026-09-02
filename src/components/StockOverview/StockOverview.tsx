import { ArrowDown, ArrowUp, Star } from "lucide-react";

export function StockOverview() {
  const isPositive = true;

  return (
    <section className="stock-overview ui-card">
      <div className="stock-main">
        <div className="stock-logo">S</div>

        <div>
          <div className="stock-title-row">
            <h2>Suzlon Energy</h2>

            <span className="stock-symbol">SUZLON</span>
          </div>

          <p className="stock-exchange">NSE · Renewable Energy</p>
        </div>
      </div>

      <div className="stock-price">
        <strong>₹52.40</strong>

        <div className={isPositive ? "positive" : "negative"}>
          {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}

          <span>₹1.18 (2.31%)</span>
        </div>
      </div>

      <button className="watch-button" aria-label="Add to watchlist">
        <Star size={17} />
      </button>
    </section>
  );
}
