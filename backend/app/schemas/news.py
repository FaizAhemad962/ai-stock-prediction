from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class NewsArticle(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str
    title: str
    summary: str
    source: str
    published_at: datetime
    url: str
    category: str
    sentiment: str
    impact: str
    symbols: list[str] = Field(default_factory=list)

class NewsListResponse(BaseModel):
    items: list[NewsArticle] = Field(default_factory=list)
    page: int
    page_size: int
    total: int

class NewsDetailResponse(NewsArticle):
    pass
