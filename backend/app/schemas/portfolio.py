from pydantic import BaseModel, ConfigDict, Field

class Holding(BaseModel):
    model_config = ConfigDict(extra="forbid")
    symbol: str
    quantity: int
    average_price: float
    current_price: float
    pnl: float
    pnl_percent: float

class PortfolioResponse(BaseModel):
    holdings: list[Holding] = Field(default_factory=list)
    total_value: float
    today_pnl: float
    overall_pnl: float

class WatchlistResponse(BaseModel):
    symbols: list[str] = Field(default_factory=list)

class WatchlistMutation(BaseModel):
    symbol: str = Field(min_length=1, max_length=20)
