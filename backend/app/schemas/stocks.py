from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class Stock(BaseModel):
    model_config = ConfigDict(extra="forbid")
    symbol: str
    name: str
    exchange: str
    sector: str
    price: float
    change: float
    change_percent: float
    currency: str = "INR"
    market_cap: float | None = None
    volume: int | None = None

class PricePoint(BaseModel):
    model_config = ConfigDict(extra="forbid")
    timestamp: str
    price: float
    volume: int | None = None

class StockHistoryResponse(BaseModel):
    symbol: str
    exchange: str
    range: str
    as_of: datetime
    is_stale: bool
    points: list[PricePoint] = Field(default_factory=list)

class TechnicalIndicator(BaseModel):
    label: str
    value: str
    status: str
    signal: str

class StockTechnicalsResponse(BaseModel):
    symbol: str
    exchange: str
    as_of: datetime
    indicators: list[TechnicalIndicator] = Field(default_factory=list)

class StockSearchResponse(BaseModel):
    query: str
    exchange: str
    results: list[Stock] = Field(default_factory=list)
