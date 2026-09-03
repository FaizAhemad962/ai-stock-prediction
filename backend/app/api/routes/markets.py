from typing import Annotated

from fastapi import APIRouter, Query

from ...schemas.markets import MarketOverviewResponse
from ...services.market_service import MarketService

router = APIRouter(prefix="/api/markets", tags=["markets"])
market_service = MarketService()


@router.get("/overview", response_model=MarketOverviewResponse)
def get_market_overview(
    exchange: Annotated[str, Query(pattern="^(NSE|BSE)$")] = "NSE",
) -> MarketOverviewResponse:
    return market_service.get_overview(exchange)
