import { ArrowDown, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import type { Stock } from "../../types/stock";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export function StockRow({ stock }: { stock: Stock }) {
  const isPositive = stock.changePercent >= 0;

  return (
    <Link className="market-stock-row stock-row-link" to={`/stock/${stock.symbol}`}>
      <div className="stock-symbol">
        <div className="stock-avatar">{stock.symbol.charAt(0)}</div>
        <div>
          <strong>{stock.symbol}</strong>
          <span>{stock.name}</span>
        </div>
      </div>
      <span className="stock-price">{currencyFormatter.format(stock.price)}</span>
      <span className={`stock-performance ${isPositive ? "positive" : "negative"}`}>
        {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
        {stock.changePercent.toFixed(2)}%
      </span>
    </Link>
  );
}
