from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class Prediction(BaseModel):
    model_config = ConfigDict(extra="forbid")
    symbol: str
    outlook: str
    confidence: float
    uncertainty: float
    summary: str
    factors: list[str] = Field(default_factory=list)
    model_version: str
    as_of: datetime


class PublicPredictionResponse(Prediction):
    name: str
    current_price: float
    currency: str
    change_percent: float
    risks: list[str] = Field(default_factory=list)
    data_as_of: datetime
    is_stale: bool

class PredictionEvaluationResponse(BaseModel):
    symbol: str
    model_version: str
    evaluated_points: int
    directional_accuracy: float
    positive_predictions: int
    negative_predictions: int
    evaluated_at: datetime

class InsightResponse(BaseModel):
    symbol: str
    prediction: Prediction
    explanation: str
    risks: list[str] = Field(default_factory=list)
    news_impact: str
    sources: list[str] = Field(default_factory=list)
    name: str
    price: float
    change_percent: float


class InsightFactor(BaseModel):
    title: str
    description: str
    score: int
    type: str


class InsightRisk(BaseModel):
    level: str
    title: str
    description: str


class InsightNewsSignal(BaseModel):
    source: str
    symbol: str
    title: str
    sentiment: str
    time: str

class InsightsListResponse(BaseModel):
    items: list[InsightResponse] = Field(default_factory=list)
    market_score: int
    market_sentiment: str
    market_summary: str
    positive_signals: int
    positive_signals_change: str
    risk_alerts: int
    risk_alerts_change: str
    news_analyzed: int
    last_analysis: str
    factors: list[InsightFactor] = Field(default_factory=list)
    risks: list[InsightRisk] = Field(default_factory=list)
    news_signals: list[InsightNewsSignal] = Field(default_factory=list)
