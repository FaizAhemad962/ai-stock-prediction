from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MarketIndex(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    value: float
    change: float
    change_percent: float


class MarketMover(BaseModel):
    model_config = ConfigDict(extra="forbid")

    symbol: str
    name: str
    price: float
    change_percent: float


class SectorPerformance(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    performance_percent: float


class MarketOverviewResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    exchange: str
    market_status: str
    as_of: datetime
    is_stale: bool
    indices: list[MarketIndex] = Field(default_factory=list)
    gainers: list[MarketMover] = Field(default_factory=list)
    losers: list[MarketMover] = Field(default_factory=list)
    sectors: list[SectorPerformance] = Field(default_factory=list)
