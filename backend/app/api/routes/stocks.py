from typing import Annotated
from fastapi import APIRouter, HTTPException, Query
from ...providers.yahoo_finance import YahooFinanceError, YahooFinanceProvider
from ...schemas.stocks import Stock, StockHistoryResponse, StockSearchResponse, StockTechnicalsResponse

router = APIRouter(prefix="/api/stocks", tags=["stocks"])
provider = YahooFinanceProvider()

@router.get("/search", response_model=StockSearchResponse)
def search_stocks(q: Annotated[str, Query(min_length=1, max_length=50)], exchange: str = "NSE") -> StockSearchResponse:
    try:
        return provider.search_stocks(q, exchange)
    except YahooFinanceError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error

@router.get("/{symbol}", response_model=Stock)
def get_stock(symbol: str, exchange: str = "NSE") -> Stock:
    try:
        return provider.get_stock(symbol, exchange)
    except YahooFinanceError:
        raise HTTPException(status_code=404, detail="Stock not found")

@router.get("/{symbol}/history", response_model=StockHistoryResponse)
def get_history(symbol: str, range: str = "1M", exchange: str = "NSE") -> StockHistoryResponse:
    try:
        return provider.get_history(symbol, range, exchange)
    except YahooFinanceError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error

@router.get("/{symbol}/technicals", response_model=StockTechnicalsResponse)
def get_technicals(symbol: str, exchange: str = "NSE") -> StockTechnicalsResponse:
    try:
        return provider.get_technicals(symbol, exchange)
    except YahooFinanceError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
