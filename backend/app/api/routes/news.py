from fastapi import APIRouter, HTTPException, Query
from ...providers.yahoo_finance import YahooFinanceError, YahooFinanceProvider
from ...schemas.news import NewsDetailResponse, NewsListResponse

router = APIRouter(prefix="/api/news", tags=["news"])
provider = YahooFinanceProvider()

@router.get("", response_model=NewsListResponse)
def list_news(q: str | None = Query(default=None, max_length=100), category: str | None = None, sentiment: str | None = None, page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)) -> NewsListResponse:
    try:
        response = provider.get_news(query=q, page=page, page_size=page_size)
    except YahooFinanceError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    if category and category != "Markets":
        response.items = []
        response.total = 0
    if sentiment and sentiment != "Neutral":
        response.items = []
        response.total = 0
    return response

@router.get("/stock/{symbol}", response_model=NewsListResponse)
def stock_news(symbol: str, page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)) -> NewsListResponse:
    try:
        return provider.get_news(symbol=symbol, page=page, page_size=page_size)
    except YahooFinanceError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error

@router.get("/{article_id}", response_model=NewsDetailResponse)
def get_news(article_id: str) -> NewsDetailResponse:
    raise HTTPException(status_code=404, detail="Article detail is provided by the publisher URL")
