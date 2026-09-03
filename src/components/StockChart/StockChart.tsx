import { useEffect, useState } from "react";
import { getStockHistory } from "../../services/api";
import { ErrorState } from "../ui/ErrorState";
import { LoadingState } from "../ui/LoadingState";
import type { PricePoint } from "../../types/stock";

const ranges = ["1D", "1W", "1M", "6M", "1Y", "5Y"];

export function StockChart() {
  const [selectedRange, setSelectedRange] = useState("1M");
  const [points, setPoints] = useState<PricePoint[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getStockHistory("SUZLON", selectedRange)
      .then((history) => {
        if (mounted) {
          setPoints(history);
          setError("");
        }
      })
      .catch((requestError: Error) => {
        if (mounted) setError(requestError.message);
      });

    return () => {
      mounted = false;
    };
  }, [selectedRange]);

  const chartPath = points.length > 1
    ? points.map((point, index) => {
        const minPrice = Math.min(...points.map((item) => item.price));
        const maxPrice = Math.max(...points.map((item) => item.price));
        const x = (index / (points.length - 1)) * 800;
        const y = 250 - ((point.price - minPrice) / Math.max(maxPrice - minPrice, 0.01)) * 200;
        return `${index === 0 ? "M" : "L"}${x} ${y}`;
      }).join(" ")
    : "";
  const areaPath = chartPath ? `${chartPath} L800 300 L0 300 Z` : "";

  return (
    <section className="ui-card chart-card">
      <div className="chart-header">
        <div>
          <span className="card-label">PRICE HISTORY</span>
          <h2>Suzlon Energy</h2>
        </div>

        <div className="chart-ranges">
          {ranges.map((range) => (
            <button
              key={range}
              className={
                selectedRange === range
                  ? "range-button active"
                  : "range-button"
              }
              onClick={() => setSelectedRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {error ? <ErrorState title="Price history unavailable" description={error} /> : null}
      {!error && points.length === 0 ? <LoadingState label="Loading price history" /> : null}

      <div className="chart-area" aria-label="SUZLON price history chart">
        <div className="chart-grid-line line-one" />
        <div className="chart-grid-line line-two" />
        <div className="chart-grid-line line-three" />

        <svg
          className="price-chart"
          viewBox="0 0 800 300"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="chartFill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#35d399"
                stopOpacity="0.25"
              />

              <stop
                offset="100%"
                stopColor="#35d399"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {areaPath ? <path d={areaPath} fill="url(#chartFill)" /> : null}
          {chartPath ? <path d={chartPath} fill="none" stroke="#35d399" strokeWidth="3" /> : null}
        </svg>
      </div>

      <div className="chart-footer">
        <span>May 2026</span>
        <span>Jun 2026</span>
        <span>Jul 2026</span>
        <span>Aug 2026</span>
      </div>
    </section>
  );
}
