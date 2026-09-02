import {
  Activity,
  BarChart3,
  Gauge,
  TrendingUp,
} from "lucide-react";

const indicators = [
  {
    label: "RSI",
    value: "58.2",
    status: "Neutral",
    icon: Gauge,
    color: "blue",
  },
  {
    label: "MACD",
    value: "+1.24",
    status: "Positive",
    icon: Activity,
    color: "green",
  },
  {
    label: "TREND",
    value: "Bullish",
    status: "Positive",
    icon: TrendingUp,
    color: "green",
  },
  {
    label: "VOLUME",
    value: "1.24×",
    status: "Above average",
    icon: BarChart3,
    color: "purple",
  },
];

export function TechnicalIndicators() {
  return (
    <section className="technical-indicators">
      {indicators.map((indicator) => {
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
