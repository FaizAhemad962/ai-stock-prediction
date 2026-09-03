from fastapi import APIRouter
from ...schemas.markets import MarketOverviewResponse
from ...services.market_service import MarketService

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("", response_model=MarketOverviewResponse)
def dashboard(exchange: str = "NSE") -> MarketOverviewResponse:
    return MarketService().get_overview(exchange)
