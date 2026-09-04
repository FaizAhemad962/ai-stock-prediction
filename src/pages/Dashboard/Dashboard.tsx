import { AIOutlook } from "../../components/AIOutlook/AIOutlook";
import { NewsPanel } from "../../components/News/NewsPanel";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { getDashboard, getNews } from "../../services/api";
import { useEffect, useState } from "react";

import { StockChart } from "../../components/StockChart/StockChart";
import { StockOverview } from "../../components/StockOverview/StockOverview";
import { StockSearch } from "../../components/StockSearch/StockSearch";
import { TechnicalIndicators } from "../../components/TechnicalIndicators/TechnicalIndicators";

export function Dashboard() {
  const [dashboardNews, setDashboardNews] = useState<Awaited<ReturnType<typeof getNews>>>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState("");
  const [marketStatus, setMarketStatus] = useState("closed");

  useEffect(() => {
    let mounted = true;
    getNews()
      .then((items) => {
        if (mounted) setDashboardNews(items.slice(0, 3));
      })
      .catch((error: Error) => {
        if (mounted) setNewsError(error.message);
      })
      .finally(() => {
        if (mounted) setNewsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    getDashboard()
      .then((overview) => setMarketStatus(overview.marketStatus))
      .catch(() => undefined);
  }, []);

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
          <span>Markets {marketStatus}</span>
        </div>
      </section>

      <StockSearch />

      <div data-tour="dashboard-overview">
        <StockOverview />
      </div>

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
        {newsLoading ? <LoadingState label="Loading latest news" /> : null}
        {newsError ? <ErrorState title="Latest news unavailable" description={newsError} /> : null}
        {!newsLoading && !newsError && dashboardNews.length > 0 ? <NewsPanel items={dashboardNews} /> : null}
        {!newsLoading && !newsError && dashboardNews.length === 0 ? (
          <EmptyState title="No latest news" description="The backend returned no current news stories." />
        ) : null}
      </section>
    </>
  );
}
