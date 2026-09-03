import {
  Activity,
  BarChart3,
  Gauge,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getStockTechnicals } from "../../services/api";
import { LoadingState } from "../ui/LoadingState";
import { ErrorState } from "../ui/ErrorState";

type IndicatorView = {
  label: string;
  value: string;
  status: string;
  icon: typeof Gauge;
  color: string;
};

export function TechnicalIndicators() {
  const [data, setData] = useState<IndicatorView[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getStockTechnicals("SUZLON")
      .then((items) => setData(items.map((item) => ({
        label: item.label.toUpperCase(),
        value: item.value,
        status: item.status,
        icon: item.label.toUpperCase() === "RSI" ? Gauge : item.label.toUpperCase() === "MACD" ? Activity : item.label.toUpperCase() === "VOLUME" ? BarChart3 : TrendingUp,
        color: item.label.toUpperCase() === "RSI" ? "blue" : item.label.toUpperCase() === "VOLUME" ? "purple" : "green",
      }))))
      .catch((requestError: Error) => setError(requestError.message));
  }, []);

  if (error) return <ErrorState className="technical-indicators" title="Technical indicators unavailable" description={error} />;
  if (data.length === 0) return <LoadingState className="technical-indicators" label="Loading technical indicators" />;

  return (
    <section className="technical-indicators">
      {data.map((indicator) => {
        const Icon = indicator.icon;

        return (
          <div
            className={`ui-card indicator-card indicator-${indicator.color}`}
            key={indicator.label}
          >
            <div className="indicator-top">
              <span className="card-label">{indicator.label}</span>

              <Icon size={16} strokeWidth={1.7} />
            </div>

            <h3>{indicator.value}</h3>

            <p>{indicator.status}</p>
          </div>
        );
      })}
    </section>
  );
}
