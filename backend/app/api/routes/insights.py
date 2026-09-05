from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from ...providers.yahoo_finance import YahooFinanceError, YahooFinanceProvider
from ...schemas.insights import InsightFactor, InsightNewsSignal, InsightResponse, InsightsListResponse, InsightRisk, Prediction, PredictionEvaluationResponse, PublicPredictionResponse

router = APIRouter(prefix="/api", tags=["insights"])
provider = YahooFinanceProvider()

def insight_for(symbol: str) -> InsightResponse:
    try:
        stock = provider.get_stock(symbol)
        history = provider.get_history(symbol, "6M")
        technicals = provider.get_technicals(symbol)
        news = provider.get_news(symbol=symbol, page_size=5).items
    except YahooFinanceError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error

    latest_prices = [point.price for point in history.points]
    momentum = ((latest_prices[-1] - latest_prices[-6]) / latest_prices[-6] * 100) if len(latest_prices) >= 6 and latest_prices[-6] else 0
    technical_signal = technicals.indicators[0].signal if technicals.indicators else "Neutral"
    score = max(0, min(100, round(50 + momentum * 4 + (10 if technical_signal == "Positive" else -10 if technical_signal == "Caution" else 0))))
    outlook = "Bullish" if score >= 65 else "Positive" if score >= 55 else "Caution" if score >= 40 else "Bearish"
    confidence = max(50, min(90, round(50 + abs(score - 50) * 0.8)))
    factors = [f"Six-month momentum: {momentum:+.2f}%", f"Technical signal: {technical_signal}", f"Latest daily move: {stock.change_percent:+.2f}%"]
    risks = ["Market volatility", "Rule-based signal is not financial advice"]
    if not news:
        risks.append("No recent articles were returned by the news provider")

    prediction = Prediction(symbol=stock.symbol, outlook=outlook, confidence=confidence, uncertainty=100 - confidence, summary=f"Live market data produces a {outlook.lower()} rule-based outlook.", factors=factors, model_version="rules-v1", as_of=datetime.now(timezone.utc))
    return InsightResponse(symbol=stock.symbol, name=stock.name, price=stock.price, change_percent=stock.change_percent, prediction=prediction, explanation="This explanation is generated from live quote, price history, technical indicator, and news metadata. AI-generated reasoning is not enabled.", risks=risks, news_impact="Available" if news else "Unavailable", sources=["Yahoo Finance"])

@router.get("/stocks/{symbol}/prediction", response_model=PublicPredictionResponse)
def prediction(symbol: str) -> PublicPredictionResponse:
    insight = insight_for_public(symbol)
    return insight

@router.get("/stocks/{symbol}/prediction/evaluation", response_model=PredictionEvaluationResponse)
def prediction_evaluation(symbol: str) -> PredictionEvaluationResponse:
    try:
        history = provider.get_history(symbol, "1y").points
    except YahooFinanceError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error

    evaluated = 0
    correct = 0
    positive_predictions = 0
    negative_predictions = 0
    for index in range(5, len(history) - 1):
        baseline = history[index - 5].price
        current = history[index].price
        next_price = history[index + 1].price
        predicted_positive = current >= baseline
        actual_positive = next_price >= current
        evaluated += 1
        correct += predicted_positive == actual_positive
        if predicted_positive:
            positive_predictions += 1
        else:
            negative_predictions += 1

    return PredictionEvaluationResponse(symbol=symbol.upper(), model_version="rules-v1", evaluated_points=evaluated, directional_accuracy=round(correct / evaluated * 100, 2) if evaluated else 0, positive_predictions=positive_predictions, negative_predictions=negative_predictions, evaluated_at=datetime.now(timezone.utc))


def insight_for_public(symbol: str) -> PublicPredictionResponse:
    insight = insight_for(symbol)

    return PublicPredictionResponse(
        **insight.prediction.model_dump(),
        name=insight.name,
        current_price=insight.price,
        currency="INR",
        change_percent=insight.change_percent,
        risks=insight.risks,
        data_as_of=insight.prediction.as_of,
        is_stale=False,
    )

@router.get("/stocks/{symbol}/insights", response_model=InsightResponse)
def stock_insights(symbol: str) -> InsightResponse:
    return insight_for(symbol)

@router.get("/insights", response_model=InsightsListResponse)
def insights() -> InsightsListResponse:
    symbols = ["SUZLON", "RELIANCE", "TCS", "INFY", "TATASTEEL"]
    items = [insight_for(symbol) for symbol in symbols]
    positive_signals = sum(item.prediction.outlook in {"Bullish", "Positive"} for item in items)
    score = round(sum(item.prediction.confidence for item in items) / len(items)) if items else 0
    news_signals = [InsightNewsSignal(source=source, symbol=symbol, title=title, sentiment="Neutral", time="Live") for item in items for source, symbol, title in [(item.sources[0], item.symbol, item.explanation)]][:5]
    return InsightsListResponse(items=items, market_score=score, market_sentiment="Positive" if score >= 55 else "Neutral", market_summary="Signals are calculated from live market data using a transparent rule-based model. AI-generated explanations are not enabled.", positive_signals=positive_signals, positive_signals_change="Live", risk_alerts=len(items) - positive_signals, risk_alerts_change="Live", news_analyzed=len(news_signals), last_analysis="Just now", factors=[InsightFactor(title="Live momentum", description="Recent price history is used to calculate momentum.", score=score, type="positive" if score >= 55 else "neutral")], risks=[InsightRisk(level="MEDIUM", title="Model limitation", description="This is a rule-based signal, not investment advice or an AI prediction.")], news_signals=news_signals)
