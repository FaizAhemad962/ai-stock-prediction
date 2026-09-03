from fastapi import APIRouter

from .routes.health import router as health_router
from .routes.markets import router as markets_router
from .routes.dashboard import router as dashboard_router
from .routes.stocks import router as stocks_router
from .routes.news import router as news_router
from .routes.user import router as user_router
from .routes.auth import router as auth_router
from .routes.insights import router as insights_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(markets_router)
api_router.include_router(dashboard_router)
api_router.include_router(stocks_router)
api_router.include_router(news_router)
api_router.include_router(user_router)
api_router.include_router(auth_router)
api_router.include_router(insights_router)
