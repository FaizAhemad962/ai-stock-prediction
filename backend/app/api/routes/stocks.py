from datetime import datetime, timezone
from typing import Annotated
from fastapi import APIRouter, HTTPException, Query
from ...repositories.mock_data import MOCK_HISTORY, MOCK_STOCKS, MOCK_TECHNICALS
from ...schemas.stocks import Stock, StockHistoryResponse, StockSearchResponse, StockTechnicalsResponse

router = APIRouter(prefix="/api/stocks", tags=["stocks"])

@router.get("/search", response_model=StockSearchResponse)
def search_stocks(q: Annotated[str, Query(min_length=1, max_length=50)], exchange: str = "NSE") -> StockSearchResponse:
    query = q.lower().strip()
    results = [stock for stock in MOCK_STOCKS if stock.exchange == exchange and (query in stock.symbol.lower() or query in stock.name.lower())]
    return StockSearchResponse(query=q, exchange=exchange, results=results)

@router.get("/{symbol}", response_model=Stock)
def get_stock(symbol: str, exchange: str = "NSE") -> Stock:
    stock = next((item for item in MOCK_STOCKS if item.symbol == symbol.upper() and item.exchange == exchange), None)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

@router.get("/{symbol}/history", response_model=StockHistoryResponse)
def get_history(symbol: str, range: str = "1M", exchange: str = "NSE") -> StockHistoryResponse:
    get_stock(symbol, exchange)
    return StockHistoryResponse(symbol=symbol.upper(), exchange=exchange, range=range, as_of=datetime.now(timezone.utc), is_stale=True, points=MOCK_HISTORY)

@router.get("/{symbol}/technicals", response_model=StockTechnicalsResponse)
def get_technicals(symbol: str, exchange: str = "NSE") -> StockTechnicalsResponse:
    get_stock(symbol, exchange)
    return StockTechnicalsResponse(symbol=symbol.upper(), exchange=exchange, as_of=datetime.now(timezone.utc), indicators=MOCK_TECHNICALS)
