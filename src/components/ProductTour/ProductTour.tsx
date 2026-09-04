import { ChevronLeft, ChevronRight, CircleHelp, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type TourStep = {
  title: string;
  description: string;
  path?: string;
  target?: string;
};

type TourRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const steps: TourStep[] = [
  { title: "Dashboard", description: "Your starting point for market status, featured stock, history, signals, AI outlook, and latest news.", path: "/dashboard", target: "[data-tour=nav-dashboard]" },
  { title: "Search any supported stock", description: "Search by symbol or company name. Select a result to open Stock Details.", path: "/dashboard", target: "[data-tour=search]" },
  { title: "Markets", description: "Markets shows indices, gainers, losers, and sector performance from the selected exchange.", path: "/markets", target: "[data-tour=nav-markets]" },
  { title: "Watchlist", description: "Watchlist keeps the stocks you follow together. Open a row for Stock Details or remove it.", path: "/watchlist", target: "[data-tour=nav-watchlist]" },
  { title: "Portfolio", description: "Portfolio organizes holdings, current value, profit and loss, and allocation.", path: "/portfolio", target: "[data-tour=nav-portfolio]" },
  { title: "AI Insights", description: "AI Insights combines historical prices, technical indicators, market context, and news signals.", path: "/ai-insights", target: "[data-tour=nav-ai-insights]" },
  { title: "News", description: "News combines search, categories, sentiment, impact, and related-stock links.", path: "/news", target: "[data-tour=nav-news]" },
  { title: "Profile and Settings", description: "Use the Profile menu to reach account, notification, appearance, privacy, and data preferences.", path: "/settings", target: "[data-tour=nav-profile]" },
  { title: "How AI prediction works", description: "AI Insights combines historical prices, technical indicators, market context, and news signals. The result includes outlook, confidence, risks, and supporting factors.", path: "/ai-insights", target: "[data-tour=ai-insights]" },
  { title: "Use predictions responsibly", description: "Predictions are informational estimates, not guarantees or financial advice. Check freshness, uncertainty, and risk signals before making decisions." },
];

export function ProductTour() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(() =>
    location.pathname === "/dashboard" && localStorage.getItem("nexus-tour-complete") !== "true",
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TourRect | null>(null);
  const [cardPosition, setCardPosition] = useState<TourRect | null>(null);

  useEffect(() => {
    const openTour = () => {
      setStepIndex(0);
      setIsOpen(true);
    };

    window.addEventListener("nexus:open-tour", openTour);
    return () => window.removeEventListener("nexus:open-tour", openTour);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const step = steps[stepIndex];
    if (step.path && location.pathname !== step.path) {
      navigate(step.path);
      return;
    }

    const measureTarget = () => {
      const element = step.target ? document.querySelector<HTMLElement>(step.target) : null;
      if (!element) {
        setTargetRect(null);
        setCardPosition(null);
        return;
      }

      element.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => {
        const rect = element.getBoundingClientRect();
        const nextRect = { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
        const cardWidth = Math.min(window.innerWidth * 0.92, 430);
        const cardHeight = 285;
        const left = Math.max(16, Math.min(rect.left, window.innerWidth - cardWidth - 16));
        const top = rect.bottom + 16 + cardHeight < window.innerHeight
          ? rect.bottom + 16
          : Math.max(16, rect.top - cardHeight - 16);
        setTargetRect(nextRect);
        setCardPosition({ top, left, width: cardWidth, height: cardHeight });
      }, 250);
    };

    requestAnimationFrame(measureTarget);
    window.addEventListener("resize", measureTarget);
    return () => window.removeEventListener("resize", measureTarget);
  }, [isOpen, location.pathname, navigate, stepIndex]);

  const closeTour = () => {
    setIsOpen(false);
    localStorage.setItem("nexus-tour-complete", "true");
  };

  const nextStep = () => {
    if (stepIndex === steps.length - 1) {
      closeTour();
      return;
    }
    setStepIndex((current) => current + 1);
  };

  if (!isOpen) return null;

  const step = steps[stepIndex];
  const cardStyle = cardPosition
    ? { top: cardPosition.top, left: cardPosition.left, transform: "none" }
    : undefined;
  const spotlightStyle = targetRect
    ? { top: targetRect.top - 8, left: targetRect.left - 8, width: targetRect.width + 16, height: targetRect.height + 16 }
    : undefined;
  const dimPanels = targetRect
    ? [
        { top: 0, left: 0, width: "100%", height: targetRect.top },
        { top: targetRect.top, left: 0, width: targetRect.left, height: targetRect.height },
        { top: targetRect.top, left: targetRect.left + targetRect.width, width: `calc(100% - ${targetRect.left + targetRect.width}px)`, height: targetRect.height },
        { top: targetRect.top + targetRect.height, left: 0, width: "100%", height: `calc(100% - ${targetRect.top + targetRect.height}px)` },
      ]
    : [];

  return (
    <div className="product-tour" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div className={`product-tour-backdrop ${targetRect ? "has-target" : ""}`} onClick={closeTour} />
      {dimPanels.map((panel, index) => <div className="product-tour-dim-panel" key={index} style={panel} onClick={closeTour} />)}
      {spotlightStyle ? <div className="product-tour-spotlight" style={spotlightStyle} aria-hidden="true" /> : null}
      <section className="product-tour-card" style={cardStyle}>
        <div className="product-tour-icon"><CircleHelp size={18} /></div>
        <button className="product-tour-close" onClick={closeTour} aria-label="Close product tour"><X size={16} /></button>
        <span className="card-label">NEXUS QUICK TOUR · {stepIndex + 1}/{steps.length}</span>
        <h2 id="tour-title">{step.title}</h2>
        <p>{step.description}</p>
        <div className="product-tour-actions">
          <button onClick={() => setStepIndex((current) => Math.max(current - 1, 0))} disabled={stepIndex === 0} aria-label="Previous tour step"><ChevronLeft size={15} /> Back</button>
          <button className="primary-button" onClick={nextStep}>{stepIndex === steps.length - 1 ? "Finish" : "Next"} {stepIndex === steps.length - 1 ? <X size={14} /> : <ChevronRight size={15} />}</button>
        </div>
      </section>
    </div>
  );
}
