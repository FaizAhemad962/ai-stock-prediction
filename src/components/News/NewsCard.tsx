import { Clock3, ExternalLink, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";

export type NewsCardItem = {
  id: string;
  source: string;
  publishedAt: string;
  title: string;
  summary: string;
  url?: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  impact: "High" | "Medium" | "Low";
  stocks: string[];
};

type NewsCardProps = {
  item: NewsCardItem;
};

export function NewsCard({ item }: NewsCardProps) {
  return (
    <article className="ui-card news-article">
      <div className="news-article-top">
        <div className="news-source">
          <div className="news-source-icon">
            <Newspaper size={14} />
          </div>

          <div>
            <strong>{item.source}</strong>
            <span>
              <Clock3 size={9} />
              {item.publishedAt}
            </span>
          </div>
        </div>

        <span className={`impact-badge impact-${item.impact.toLowerCase()}`}>
          {item.impact} impact
        </span>
      </div>

      <h3>{item.title}</h3>
      <p>{item.summary}</p>

      <div className="news-article-bottom">
        <div className="news-stock-tags">
          {item.stocks.map((stock) => (
            <Link key={stock} to={`/stock/${stock}`}>
              {stock}
            </Link>
          ))}
        </div>

        <span className={`article-sentiment sentiment-${item.sentiment.toLowerCase()}`}>
          {item.sentiment}
        </span>

        {item.url ? (
          <a
            className="article-open-button"
            href={item.url}
            target="_blank"
            rel="noreferrer"
          >
            Read
            <ExternalLink size={11} />
          </a>
        ) : null}
      </div>
    </article>
  );
}
