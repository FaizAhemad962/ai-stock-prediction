import { AIOutlook } from "../../components/AIOutlook/AIOutlook";
import { NewsPanel } from "../../components/News/NewsPanel";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { mockNewsFeed } from "../../data/mockData";

import { StockChart } from "../../components/StockChart/StockChart";
import { StockOverview } from "../../components/StockOverview/StockOverview";
import { StockSearch } from "../../components/StockSearch/StockSearch";
import { TechnicalIndicators } from "../../components/TechnicalIndicators/TechnicalIndicators";

const dashboardNews = mockNewsFeed.slice(0, 3).map((item) => ({
  ...item,
  time: item.publishedAt,
}));

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

      <section className="dashboard-news-section">
        <SectionHeader eyebrow="NEWS INTELLIGENCE" title="Latest market news" />
        <NewsPanel items={dashboardNews} />
      </section>
    </>
  );
}
