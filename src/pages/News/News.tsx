import {
  ArrowDown,
  ArrowUp,
  Clock3,
  ExternalLink,
  Filter,
  Newspaper,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

type NewsItem = {
  id: number;
  source: string;
  time: string;
  category: string;
  title: string;
  summary: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  impact: "High" | "Medium" | "Low";
  stocks: string[];
};

const newsItems: NewsItem[] = [
  {
    id: 1,
    source: "Economic Times",
    time: "18 min ago",
    category: "Renewable Energy",
    title:
      "Renewable energy stocks gain momentum as sector outlook improves",
    summary:
      "Investors continue to track renewable energy companies as new capacity additions and policy developments support the sector.",
    sentiment: "Positive",
    impact: "High",
    stocks: ["SUZLON", "TATASTEEL"],
  },
  {
    id: 2,
    source: "Moneycontrol",
    time: "42 min ago",
    category: "Markets",
    title:
      "Institutional interest increases across selected Indian energy stocks",
    summary:
      "Market activity remains elevated as investors monitor institutional flows and improving sector fundamentals.",
    sentiment: "Positive",
    impact: "Medium",
    stocks: ["SUZLON", "RELIANCE"],
  },
  {
    id: 3,
    source: "Business Standard",
    time: "1 hr ago",
    category: "Technology",
    title:
      "IT stocks remain mixed as investors assess global technology demand",
    summary:
      "Large-cap technology stocks show mixed movement while markets wait for additional clarity around global demand.",
    sentiment: "Neutral",
    impact: "Medium",
    stocks: ["TCS", "INFY"],
  },
  {
    id: 4,
    source: "CNBC TV18",
    time: "2 hrs ago",
    category: "Banking",
    title:
      "Large private banks remain in focus following fresh market flows",
    summary:
      "Banking stocks continue to attract attention as traders evaluate valuations and upcoming financial results.",
    sentiment: "Positive",
    impact: "Medium",
    stocks: ["HDFCBANK", "RELIANCE"],
  },
  {
    id: 5,
    source: "Reuters",
    time: "3 hrs ago",
    category: "Global Markets",
    title:
      "Global markets remain cautious ahead of key economic data",
    summary:
      "Investors are monitoring global economic indicators that could influence risk appetite across equity markets.",
    sentiment: "Neutral",
    impact: "High",
    stocks: ["TCS", "RELIANCE"],
  },
  {
    id: 6,
    source: "Mint",
    time: "4 hrs ago",
    category: "Metals",
    title:
      "Metal stocks rally as commodity sentiment improves",
    summary:
      "Improving commodity prices are supporting selected metal companies and attracting renewed investor interest.",
    sentiment: "Positive",
    impact: "Medium",
    stocks: ["TATASTEEL"],
  },
  {
    id: 7,
    source: "Financial Express",
    time: "5 hrs ago",
    category: "Technology",
    title:
      "Investors reassess IT valuations following recent sector movement",
    summary:
      "Technology stocks remain sensitive to global demand expectations and currency movements.",
    sentiment: "Negative",
    impact: "Low",
    stocks: ["INFY", "TCS"],
  },
  {
    id: 8,
    source: "NDTV Profit",
    time: "6 hrs ago",
    category: "Markets",
    title:
      "Indian equities maintain positive momentum during afternoon trading",
    summary:
      "Broad market participation remains healthy while investors continue to monitor sector-specific developments.",
    sentiment: "Positive",
    impact: "Medium",
    stocks: ["SUZLON", "RELIANCE", "TATASTEEL"],
  },
];

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

  const filteredNews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return newsItems.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query) ||
        item.stocks.some((stock) =>
          stock.toLowerCase().includes(query),
        );

      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      const matchesSentiment =
        selectedSentiment === "All" ||
        item.sentiment === selectedSentiment;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSentiment
      );
    });
  }, [search, selectedCategory, selectedSentiment]);

  const positiveCount = newsItems.filter(
    (item) => item.sentiment === "Positive",
  ).length;

  const neutralCount = newsItems.filter(
    (item) => item.sentiment === "Neutral",
  ).length;

  const negativeCount = newsItems.filter(
    (item) => item.sentiment === "Negative",
  ).length;

  return (
    <div className="news-page">
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
            <strong>128</strong>
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
              {filteredNews.length} stories
            </span>
          </div>

          {filteredNews.length > 0 ? (
            <div className="news-list">
              {filteredNews.map((item) => (
                <article
                  className="ui-card news-article"
                  key={item.id}
                >
                  <div className="news-article-top">
                    <div className="news-source">
                      <div className="news-source-icon">
                        <Newspaper size={14} />
                      </div>

                      <div>
                        <strong>{item.source}</strong>

                        <span>
                          <Clock3 size={9} />
                          {item.time}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`impact-badge impact-${item.impact.toLowerCase()}`}
                    >
                      {item.impact} impact
                    </span>
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.summary}</p>

                  <div className="news-article-bottom">
                    <div className="news-stock-tags">
                      {item.stocks.map((stock) => (
                        <span key={stock}>{stock}</span>
                      ))}
                    </div>

                    <span
                      className={`article-sentiment sentiment-${item.sentiment.toLowerCase()}`}
                    >
                      {item.sentiment}
                    </span>

                    <button className="article-open-button">
                      Read
                      <ExternalLink size={11} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="ui-card news-empty">
              <Search size={20} />

              <h3>No news found</h3>

              <p>
                Try changing your search or filter selection.
              </p>
            </div>
          )}
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
              <strong>74</strong>
              <span>/100</span>
            </div>

            <div className="sentiment-meter">
              <div />
            </div>

            <div className="sentiment-description">
              <span>Overall sentiment</span>
              <strong>Positive</strong>
            </div>

            <p>
              AI currently detects more positive than negative
              market stories across the monitored sources.
            </p>
          </div>
        </aside>
      </section>

      <div className="news-data-note">
        News displayed here is mock data for the UI development phase.
        Real news sources will be connected later.
      </div>
    </div>
  );
}
