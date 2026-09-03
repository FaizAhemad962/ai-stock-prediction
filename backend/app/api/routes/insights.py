from datetime import datetime, timezone
from fastapi import APIRouter
from ...repositories.mock_data import MOCK_STOCKS
from ...schemas.insights import InsightNewsSignal, InsightResponse, InsightsListResponse, InsightFactor, InsightRisk, Prediction

router = APIRouter(prefix="/api", tags=["insights"])

def insight_for(symbol: str) -> InsightResponse:
    stock = next(item for item in MOCK_STOCKS if item.symbol == symbol.upper())
    prediction = Prediction(symbol=symbol.upper(), outlook="Bullish", confidence=78, uncertainty=22, summary="Momentum remains constructive in mock mode.", factors=["Positive momentum", "Improving volume", "Sector strength"], model_version="mock-0.1", as_of=datetime.now(timezone.utc))
    return InsightResponse(symbol=stock.symbol, name=stock.name, price=stock.price, change_percent=stock.change_percent, prediction=prediction, explanation="This is a mock explanation based on placeholder technical and market signals.", risks=["Market volatility", "Data is not live"], news_impact="Positive", sources=["mock-market-provider"])

@router.get("/stocks/{symbol}/prediction", response_model=Prediction)
def prediction(symbol: str) -> Prediction:
    return insight_for(symbol).prediction

@router.get("/stocks/{symbol}/insights", response_model=InsightResponse)
def stock_insights(symbol: str) -> InsightResponse:
    return insight_for(symbol)

@router.get("/insights", response_model=InsightsListResponse)
def insights() -> InsightsListResponse:
    return InsightsListResponse(
        items=[insight_for("SUZLON"), insight_for("RELIANCE"), insight_for("TCS"), insight_for("INFY"), insight_for("TATASTEEL")],
        market_score=72,
        market_sentiment="Positive",
        market_summary="Market momentum is currently positive, supported by improving technical indicators and constructive sector sentiment.",
        positive_signals=14,
        positive_signals_change="+18%",
        risk_alerts=3,
        risk_alerts_change="-8%",
        news_analyzed=128,
        last_analysis="2 minutes ago",
        factors=[
            InsightFactor(title="Technical momentum", description="Price remains above the 50-day and 200-day moving averages.", score=82, type="positive"),
            InsightFactor(title="Market sentiment", description="Recent market activity indicates improving investor sentiment.", score=74, type="positive"),
            InsightFactor(title="News sentiment", description="Recent company and sector news is mostly positive.", score=79, type="positive"),
            InsightFactor(title="Volatility risk", description="Recent price movement indicates moderate short-term volatility.", score=48, type="neutral"),
        ],
        risks=[
            InsightRisk(level="MEDIUM", title="Short-term volatility", description="Price movements may remain elevated around major market events."),
            InsightRisk(level="LOW", title="Sector concentration", description="Renewable energy exposure is currently increasing."),
            InsightRisk(level="MEDIUM", title="News sensitivity", description="Company-specific announcements could affect the short-term outlook."),
        ],
        news_signals=[
            InsightNewsSignal(source="Economic Times", symbol="SUZLON", title="Renewable energy stocks gain attention as sector outlook improves", sentiment="Positive", time="32 min ago"),
            InsightNewsSignal(source="Moneycontrol", symbol="SUZLON", title="Institutional interest increases across renewable energy companies", sentiment="Positive", time="1 hr ago"),
            InsightNewsSignal(source="Business Standard", symbol="SUZLON", title="Market participants watch upcoming policy developments", sentiment="Neutral", time="2 hrs ago"),
        ],
    )
