import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const indices = [
  {
    name: "NIFTY 50",
    value: "24,718.60",
    change: "+182.45",
    percentage: "+0.74%",
    positive: true,
  },
  {
    name: "SENSEX",
    value: "80,567.42",
    change: "+594.91",
    percentage: "+0.74%",
    positive: true,
  },
  {
    name: "NIFTY BANK",
    value: "54,231.80",
    change: "-124.30",
    percentage: "-0.23%",
    positive: false,
  },
  {
    name: "NIFTY IT",
    value: "41,892.25",
    change: "+386.70",
    percentage: "+0.93%",
    positive: true,
  },
];

const gainers = [
  {
    symbol: "SUZLON",
    name: "Suzlon Energy",
    price: "₹52.40",
    change: "+4.21%",
  },
  {
    symbol: "TATASTEEL",
    name: "Tata Steel",
    price: "₹168.25",
    change: "+3.68%",
  },
  {
    symbol: "ADANIPORTS",
    name: "Adani Ports",
    price: "₹1,412.60",
    change: "+3.24%",
  },
  {
    symbol: "POWERGRID",
    name: "Power Grid",
    price: "₹326.15",
    change: "+2.91%",
  },
];

const losers = [
  {
    symbol: "INFY",
    name: "Infosys",
    price: "₹1,482.20",
    change: "-2.14%",
  },
  {
    symbol: "HCLTECH",
    name: "HCL Technologies",
    price: "₹1,534.80",
    change: "-1.82%",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank",
    price: "₹1,276.45",
    change: "-1.41%",
  },
  {
    symbol: "AXISBANK",
    name: "Axis Bank",
    price: "₹1,091.30",
    change: "-1.18%",
  },
];

const sectors = [
  {
    name: "Information Technology",
    performance: "+1.82%",
    positive: true,
  },
  {
    name: "Renewable Energy",
    performance: "+1.54%",
    positive: true,
  },
  {
    name: "Automobile",
    performance: "+0.92%",
    positive: true,
  },
  {
    name: "Banking",
    performance: "-0.23%",
    positive: false,
  },
  {
    name: "Pharmaceuticals",
    performance: "-0.61%",
    positive: false,
  },
  {
    name: "Metals",
    performance: "+0.48%",
    positive: true,
  },
];

export function Markets() {
  return (
    <div className="markets-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">MARKET OVERVIEW</p>

          <h1>Markets</h1>

          <p className="page-description">
            Track market indices, sectors, gainers and losers in one place.
          </p>
        </div>

        <div className="market-status">
          <span className="status-dot" />
          <span>Markets closed</span>
        </div>
      </section>

      <section className="market-indices">
        {indices.map((index) => (
          <div className="ui-card index-card" key={index.name}>
            <div className="index-card-header">
              <span>{index.name}</span>

              <BarChart3 size={15} />
            </div>

            <h2>{index.value}</h2>

            <div
              className={`market-change ${
                index.positive ? "positive" : "negative"
              }`}
            >
              {index.positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}

              <span>{index.change}</span>
              <span>{index.percentage}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="market-lists">
        <MarketStockList
          title="Top Gainers"
          icon={<TrendingUp size={15} />}
          stocks={gainers}
          positive
        />

        <MarketStockList
          title="Top Losers"
          icon={<ArrowDown size={15} />}
          stocks={losers}
          positive={false}
        />
      </section>

      <section className="sector-section">
        <div className="section-header">
          <div>
            <span className="card-label">SECTOR ANALYSIS</span>
            <h2>Sector performance</h2>
          </div>
        </div>

        <div className="sector-grid">
          {sectors.map((sector) => (
            <div className="ui-card sector-card" key={sector.name}>
              <div className="sector-icon">
                <Activity size={15} />
              </div>

              <div className="sector-information">
                <span>{sector.name}</span>

                <strong className={sector.positive ? "positive" : "negative"}>
                  {sector.performance}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

type Stock = {
  symbol: string;
  name: string;
  price: string;
  change: string;
};

type MarketStockListProps = {
  title: string;
  icon: React.ReactNode;
  stocks: Stock[];
  positive: boolean;
};

function MarketStockList({
  title,
  icon,
  stocks,
  positive,
}: MarketStockListProps) {
  const navigate = useNavigate();

  return (
    <section className="ui-card market-list-card">
      <div className="section-header compact">
        <div className="list-title">
          {icon}
          <h2>{title}</h2>
        </div>

        <button className="view-all-button">View all</button>
      </div>

      <div className="market-stock-list">
        {stocks.map((stock) => (
          <div
            className="market-stock-row"
            key={stock.symbol}
            onClick={() => navigate(`/stock/${stock.symbol}`)}
          >
            <div className="stock-symbol">
              <div className="stock-avatar">{stock.symbol.charAt(0)}</div>

              <div>
                <strong>{stock.symbol}</strong>
                <span>{stock.name}</span>
              </div>
            </div>

            <span className="stock-price">{stock.price}</span>

            <span
              className={`stock-performance ${
                positive ? "positive" : "negative"
              }`}
            >
              {stock.change}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
