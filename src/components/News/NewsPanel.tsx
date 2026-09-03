import { NewsCard, type NewsCardItem } from "./NewsCard";

type NewsPanelProps = {
  items: NewsCardItem[];
};

export function NewsPanel({ items }: NewsPanelProps) {
  return (
    <div className="news-list">
      {items.map((item) => (
        <NewsCard item={item} key={item.id} />
      ))}
    </div>
  );
}
