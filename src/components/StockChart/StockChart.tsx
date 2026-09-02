import { useState } from "react";

const ranges = ["1D", "1W", "1M", "6M", "1Y", "5Y"];

export function StockChart() {
  const [selectedRange, setSelectedRange] = useState("1M");

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

      <div className="chart-area">
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

          <path
            d="M0 230 C60 210 90 220 140 180 S220 205 270 150 S340 170 390 120 S450 145 500 105 S570 130 620 80 S700 105 800 45 L800 300 L0 300 Z"
            fill="url(#chartFill)"
          />

          <path
            d="M0 230 C60 210 90 220 140 180 S220 205 270 150 S340 170 390 120 S450 145 500 105 S570 130 620 80 S700 105 800 45"
            fill="none"
            stroke="#35d399"
            strokeWidth="3"
          />
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
