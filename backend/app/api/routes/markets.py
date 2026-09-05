from typing import Annotated

from fastapi import APIRouter, HTTPException, Query

from ...providers.yahoo_finance import YahooFinanceError
from ...schemas.markets import MarketOverviewResponse
from ...services.market_service import MarketService

router = APIRouter(prefix="/api/markets", tags=["markets"])
market_service = MarketService()


@router.get("/overview", response_model=MarketOverviewResponse)
def get_market_overview(
    exchange: Annotated[str, Query(pattern="^(NSE|BSE)$")] = "NSE",
) -> MarketOverviewResponse:
    try:
        return market_service.get_overview(exchange)
    except YahooFinanceError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
