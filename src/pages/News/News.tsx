import {
  ArrowDown,
  ArrowUp,
  Filter,
  Newspaper,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { NewsPanel } from "../../components/News/NewsPanel";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { getNewsPage, type NewsPage } from "../../services/api";

const categories = [
  "All",
  "Markets",
  "Renewable Energy",
  "Technology",
  "Banking",
  "Metals",
  "Global Markets",
];

export function News() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSentiment, setSelectedSentiment] = useState("All");
  const [newsPage, setNewsPage] = useState<NewsPage>({ items: [], page: 1, pageSize: 20, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNews = () => {
    setIsLoading(true);
    setError("");
    getNewsPage({ query: search, category: selectedCategory, sentiment: selectedSentiment, page: newsPage.page })
      .then(setNewsPage)
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    let mounted = true;
    getNewsPage({ query: search, category: selectedCategory, sentiment: selectedSentiment, page: newsPage.page })
      .then((page) => {
        if (mounted) setNewsPage(page);
      })
      .catch((requestError: Error) => {
        if (mounted) setError(requestError.message);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [newsPage.page, search, selectedCategory, selectedSentiment]);

  const filteredNews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return newsPage.items.filter((item) => !query || item.title.toLowerCase().includes(query) || item.source.toLowerCase().includes(query) || item.stocks.some((stock) => stock.toLowerCase().includes(query)));
  }, [newsPage.items, search]);

  const positiveCount = newsPage.items.filter(
    (item) => item.sentiment === "Positive",
  ).length;

  const articleCount = newsPage.total;

  const neutralCount = newsPage.items.filter(
    (item) => item.sentiment === "Neutral",
  ).length;

  const negativeCount = newsPage.items.filter(
    (item) => item.sentiment === "Negative",
  ).length;
  const sentimentScore = newsPage.items.length
    ? Math.round(((positiveCount + neutralCount * 0.5) / newsPage.items.length) * 100)
    : 0;
  const sentimentLabel = sentimentScore >= 60 ? "Positive" : sentimentScore >= 40 ? "Neutral" : "Negative";

  if (isLoading) {
    return <LoadingState className="news-page" label="Loading market news" />;
  }

  if (error) {
    return <ErrorState className="news-page" title="News unavailable" description={error} onRetry={loadNews} />;
  }

  return (
    <div className="news-page" data-tour="news">
      <section className="page-heading">
        <div>
          <p className="eyebrow">MARKET INTELLIGENCE</p>

          <h1>News</h1>

          <p className="page-description">
            Latest market news, stock developments and AI-powered
            sentiment signals.
          </p>
        </div>

        <div className="news-live-status">
          <span />
          Live feed
        </div>
      </section>

      <section className="news-summary-grid">
        <div className="ui-card news-summary-card">
          <div className="news-summary-icon">
            <Newspaper size={16} />
          </div>

          <div>
            <span>Articles today</span>
            <strong>{articleCount}</strong>
          </div>
        </div>

        <div className="ui-card news-summary-card">
          <div className="news-summary-icon positive-news-icon">
            <ArrowUp size={16} />
          </div>

          <div>
            <span>Positive</span>
            <strong>{positiveCount}</strong>
          </div>
        </div>

        <div className="ui-card news-summary-card">
          <div className="news-summary-icon neutral-news-icon">
            <TrendingUp size={16} />
          </div>

          <div>
            <span>Neutral</span>
            <strong>{neutralCount}</strong>
          </div>
        </div>

        <div className="ui-card news-summary-card">
          <div className="news-summary-icon negative-news-icon">
            <ArrowDown size={16} />
          </div>

          <div>
            <span>Negative</span>
            <strong>{negativeCount}</strong>
          </div>
        </div>
      </section>

      <section className="news-controls">
        <div className="news-search">
          <Search size={14} />

          <input
            type="text"
            placeholder="Search news, stocks or sources..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="news-filter-icon">
          <Filter size={13} />
        </div>

        <div className="news-sentiment-filter">
          {["All", "Positive", "Neutral", "Negative"].map(
            (sentiment) => (
              <button
                key={sentiment}
                className={
                  selectedSentiment === sentiment ? "active" : ""
                }
                onClick={() => setSelectedSentiment(sentiment)}
              >
                {sentiment}
              </button>
            ),
          )}
        </div>
      </section>

      <section className="category-scroll">
        {categories.map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category ? "active" : ""
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </section>

      <section className="news-content-layout">
        <div className="news-feed">
          <div className="section-header">
            <div>
              <span className="card-label">LATEST STORIES</span>
              <h2>Market news</h2>
            </div>

            <span className="news-result-count">
              {newsPage.total} stories · page {newsPage.page}
            </span>
          </div>

          {filteredNews.length > 0 ? (
            <NewsPanel items={filteredNews} />
          ) : (
            <EmptyState
              className="ui-card news-empty"
              title="No news found"
              description="Try changing your search or filter selection."
            />
          )}

          {newsPage.total > newsPage.pageSize ? (
            <div className="news-pagination">
              <button disabled={newsPage.page <= 1} onClick={() => setNewsPage((current) => ({ ...current, page: current.page - 1 }))}>Previous</button>
              <span>Page {newsPage.page} of {Math.ceil(newsPage.total / newsPage.pageSize)}</span>
              <button disabled={newsPage.page >= Math.ceil(newsPage.total / newsPage.pageSize)} onClick={() => setNewsPage((current) => ({ ...current, page: current.page + 1 }))}>Next</button>
            </div>
          ) : null}
        </div>

        <aside className="news-sidebar">
          <div className="ui-card trending-news-card">
            <div className="section-header compact">
              <div>
                <span className="card-label">TRENDING</span>
                <h2>Topics in focus</h2>
              </div>

              <TrendingUp size={14} className="trending-icon" />
            </div>

            <div className="trending-list">
              <div className="trending-item">
                <span className="trending-number">01</span>

                <div>
                  <strong>Renewable Energy</strong>
                  <span>42 articles</span>
                </div>

                <ArrowUp size={11} />
              </div>

              <div className="trending-item">
                <span className="trending-number">02</span>

                <div>
                  <strong>Indian Markets</strong>
                  <span>38 articles</span>
                </div>

                <ArrowUp size={11} />
              </div>

              <div className="trending-item">
                <span className="trending-number">03</span>

                <div>
                  <strong>Technology</strong>
                  <span>27 articles</span>
                </div>

                <ArrowDown size={11} />
              </div>

              <div className="trending-item">
                <span className="trending-number">04</span>

                <div>
                  <strong>Banking</strong>
                  <span>21 articles</span>
                </div>

                <ArrowUp size={11} />
              </div>
            </div>
          </div>

          <div className="ui-card ai-news-summary">
            <div className="ai-news-summary-header">
              <div className="ai-news-icon">
                <Sparkles size={15} />
              </div>

              <div>
                <span className="card-label">AI SENTIMENT</span>
                <h2>Market news mood</h2>
              </div>
            </div>

            <div className="sentiment-score">
              <strong>{sentimentScore}</strong>
              <span>/100</span>
            </div>

            <div className="sentiment-meter">
              <div />
            </div>

            <div className="sentiment-description">
              <span>Overall sentiment</span>
              <strong>{sentimentLabel}</strong>
            </div>

            <p>
              Current sentiment is calculated from the articles returned by the news provider.
            </p>
          </div>
        </aside>
      </section>

      <div className="news-data-note">
        News and article links are supplied by the server-side market news provider.
      </div>
    </div>
  );
}
