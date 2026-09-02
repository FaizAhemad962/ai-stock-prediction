import { AIOutlook } from "../../components/AIOutlook/AIOutlook";

import { StockChart } from "../../components/StockChart/StockChart";
import { StockOverview } from "../../components/StockOverview/StockOverview";
import { StockSearch } from "../../components/StockSearch/StockSearch";
import { TechnicalIndicators } from "../../components/TechnicalIndicators/TechnicalIndicators";
import { News } from "../News/News";

export function Dashboard() {
  return (
    <>
      <section className="welcome-section">
        <div>
          <p className="eyebrow">MARKET INTELLIGENCE</p>

          <h1>Good evening</h1>

          <p className="welcome-text">
            Understand the market through data, technical signals,
            and AI-powered insights.
          </p>
        </div>

        <div className="market-status">
          <span className="status-dot" />
          <span>Markets closed</span>
        </div>
      </section>

      <StockSearch />

      <StockOverview />

      <section className="dashboard-main-grid">
        <StockChart />
        <AIOutlook />
      </section>

      <section className="section-header">
        <div>
          <span className="card-label">MARKET SIGNALS</span>
          <h2>Technical overview</h2>
        </div>
      </section>

      <TechnicalIndicators />

      <News />
    </>
  );
}
