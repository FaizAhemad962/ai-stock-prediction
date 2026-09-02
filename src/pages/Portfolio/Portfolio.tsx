import {
  ArrowDown,
  ArrowUp,
  BriefcaseBusiness,
  CircleDollarSign,
  PieChart,
  TrendingUp,
} from "lucide-react";

type Holding = {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: string;
  currentPrice: string;
  pnl: string;
  pnlPercentage: string;
  positive: boolean;
};

const holdings: Holding[] = [
  {
    symbol: "SUZLON",
    name: "Suzlon Energy",
    quantity: 500,
    averagePrice: "₹46.20",
    currentPrice: "₹52.40",
    pnl: "+₹3,100",
    pnlPercentage: "+13.42%",
    positive: true,
  },
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    quantity: 25,
    averagePrice: "₹1,365.40",
    currentPrice: "₹1,421.30",
    pnl: "+₹1,397.50",
    pnlPercentage: "+4.10%",
    positive: true,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    quantity: 10,
    averagePrice: "₹3,020.00",
    currentPrice: "₹3,184.50",
    pnl: "+₹1,645",
    pnlPercentage: "+5.45%",
    positive: true,
  },
  {
    symbol: "INFY",
    name: "Infosys",
    quantity: 20,
    averagePrice: "₹1,520.00",
    currentPrice: "₹1,482.20",
    pnl: "-₹756",
    pnlPercentage: "-2.49%",
    positive: false,
  },
  {
    symbol: "TATASTEEL",
    name: "Tata Steel",
    quantity: 100,
    averagePrice: "₹151.80",
    currentPrice: "₹168.25",
    pnl: "+₹1,645",
    pnlPercentage: "+10.84%",
    positive: true,
  },
];

const allocation = [
  {
    name: "SUZLON",
    percentage: 34,
    color: "#7187ff",
  },
  {
    name: "RELIANCE",
    percentage: 25,
    color: "#35d399",
  },
  {
    name: "TCS",
    percentage: 18,
    color: "#b58cff",
  },
  {
    name: "INFY",
    percentage: 11,
    color: "#e5b75d",
  },
  {
    name: "TATASTEEL",
    percentage: 12,
    color: "#ff7188",
  },
];

export function Portfolio() {
  return (
    <div className="portfolio-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">YOUR INVESTMENTS</p>

          <h1>Portfolio</h1>

          <p className="page-description">
            Monitor your holdings, performance and portfolio allocation.
          </p>
        </div>

        <button className="portfolio-action-button">
          <BriefcaseBusiness size={14} />
          Manage portfolio
        </button>
      </section>

      <section className="portfolio-summary">
        <div className="ui-card portfolio-summary-card">
          <div className="portfolio-card-icon">
            <CircleDollarSign size={17} />
          </div>

          <div>
            <span>Total portfolio value</span>
            <strong>₹8,42,615</strong>
          </div>

          <small>Current value</small>
        </div>

        <div className="ui-card portfolio-summary-card">
          <div className="portfolio-card-icon positive-icon">
            <TrendingUp size={17} />
          </div>

          <div>
            <span>Today's P&amp;L</span>
            <strong className="positive">+₹8,421</strong>
          </div>

          <small className="positive">+1.01%</small>
        </div>

        <div className="ui-card portfolio-summary-card">
          <div className="portfolio-card-icon positive-icon">
            <ArrowUp size={17} />
          </div>

          <div>
            <span>Overall P&amp;L</span>
            <strong className="positive">+₹7,031</strong>
          </div>

          <small className="positive">+6.84%</small>
        </div>
      </section>

      <section className="portfolio-main-grid">
        <div className="ui-card portfolio-performance-card">
          <div className="section-header compact">
            <div>
              <span className="card-label">PERFORMANCE</span>
              <h2>Portfolio growth</h2>
            </div>

            <div className="portfolio-period">
              <button className="active">1M</button>
              <button>6M</button>
              <button>1Y</button>
              <button>ALL</button>
            </div>
          </div>

          <div className="portfolio-chart">
            <div className="portfolio-chart-grid grid-1" />
            <div className="portfolio-chart-grid grid-2" />
            <div className="portfolio-chart-grid grid-3" />
            <div className="portfolio-chart-grid grid-4" />

            <svg
              viewBox="0 0 900 260"
              preserveAspectRatio="none"
              className="portfolio-line-chart"
            >
              <defs>
                <linearGradient
                  id="portfolioGradient"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#7187ff"
                    stopOpacity="0.22"
                  />
                  <stop
                    offset="100%"
                    stopColor="#7187ff"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              <path
                d="M0 218 L75 210 L145 215 L220 190 L295 198 L370 166 L440 175 L515 143 L590 150 L665 120 L740 130 L815 86 L900 65 L900 260 L0 260 Z"
                fill="url(#portfolioGradient)"
              />

              <path
                d="M0 218 L75 210 L145 215 L220 190 L295 198 L370 166 L440 175 L515 143 L590 150 L665 120 L740 130 L815 86 L900 65"
                fill="none"
                stroke="#7187ff"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <div className="portfolio-chart-labels">
              <span>₹8.5L</span>
              <span>₹8.2L</span>
              <span>₹7.9L</span>
              <span>₹7.6L</span>
              <span>₹7.3L</span>
            </div>
          </div>
        </div>

        <div className="ui-card allocation-card">
          <div className="section-header compact">
            <div>
              <span className="card-label">ALLOCATION</span>
              <h2>Portfolio mix</h2>
            </div>

            <PieChart size={15} className="allocation-icon" />
          </div>

          <div className="allocation-visual">
            <div className="allocation-ring">
              <div className="allocation-ring-center">
                <strong>5</strong>
                <span>Stocks</span>
              </div>
            </div>
          </div>

          <div className="allocation-list">
            {allocation.map((item) => (
              <div className="allocation-row" key={item.name}>
                <div>
                  <span
                    className="allocation-dot"
                    style={{ background: item.color }}
                  />
                  <span>{item.name}</span>
                </div>

                <strong>{item.percentage}%</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="holdings-section">
        <div className="section-header">
          <div>
            <span className="card-label">YOUR POSITIONS</span>
            <h2>Holdings</h2>
          </div>

          <span className="holding-count">
            {holdings.length} stocks
          </span>
        </div>

        <div className="ui-card holdings-card">
          <div className="holdings-header">
            <span>STOCK</span>
            <span>QTY</span>
            <span>AVG. PRICE</span>
            <span>CURRENT</span>
            <span>P&amp;L</span>
          </div>

          <div className="holdings-list">
            {holdings.map((holding) => (
              <div className="holding-row" key={holding.symbol}>
                <div className="holding-stock">
                  <div className="holding-avatar">
                    {holding.symbol.charAt(0)}
                  </div>

                  <div>
                    <strong>{holding.symbol}</strong>
                    <span>{holding.name}</span>
                  </div>
                </div>

                <span className="holding-value">
                  {holding.quantity}
                </span>

                <span className="holding-value">
                  {holding.averagePrice}
                </span>

                <span className="holding-value">
                  {holding.currentPrice}
                </span>

                <div
                  className={`holding-pnl ${
                    holding.positive ? "positive" : "negative"
                  }`}
                >
                  {holding.positive ? (
                    <ArrowUp size={11} />
                  ) : (
                    <ArrowDown size={11} />
                  )}

                  <div>
                    <strong>{holding.pnl}</strong>
                    <span>{holding.pnlPercentage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="portfolio-note">
        Portfolio values shown here are mock data for UI development.
      </div>
    </div>
  );
}
