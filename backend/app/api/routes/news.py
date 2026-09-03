from fastapi import APIRouter, HTTPException, Query
from ...repositories.mock_data import MOCK_NEWS
from ...schemas.news import NewsDetailResponse, NewsListResponse

router = APIRouter(prefix="/api/news", tags=["news"])

@router.get("", response_model=NewsListResponse)
def list_news(q: str | None = Query(default=None, max_length=100), category: str | None = None, sentiment: str | None = None, page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)) -> NewsListResponse:
    items = MOCK_NEWS
    if q:
        query = q.lower()
        items = [item for item in items if query in item.title.lower() or query in item.summary.lower() or any(query in symbol.lower() for symbol in item.symbols)]
    if category:
        items = [item for item in items if item.category == category]
    if sentiment:
        items = [item for item in items if item.sentiment == sentiment]
    start = (page - 1) * page_size
    return NewsListResponse(items=items[start:start + page_size], page=page, page_size=page_size, total=len(items))

@router.get("/stock/{symbol}", response_model=NewsListResponse)
def stock_news(symbol: str, page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)) -> NewsListResponse:
    items = [item for item in MOCK_NEWS if symbol.upper() in item.symbols]
    return NewsListResponse(items=items, page=page, page_size=page_size, total=len(items))

@router.get("/{article_id}", response_model=NewsDetailResponse)
def get_news(article_id: str) -> NewsDetailResponse:
    article = next((item for item in MOCK_NEWS if item.id == article_id), None)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article
