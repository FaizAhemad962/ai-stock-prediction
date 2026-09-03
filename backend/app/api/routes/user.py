from fastapi import APIRouter, HTTPException
from ...repositories import mock_data
from ...schemas.portfolio import PortfolioResponse, WatchlistMutation, WatchlistResponse
from ...schemas.users import Notification, Preferences, User, UserUpdate

router = APIRouter(prefix="/api", tags=["user"])

@router.get("/users/me", response_model=User)
def current_user() -> User:
    return mock_data.MOCK_USER

@router.patch("/users/me", response_model=User)
def update_user(payload: UserUpdate) -> User:
    if payload.name is not None:
        mock_data.MOCK_USER.name = payload.name
    if payload.email is not None:
        mock_data.MOCK_USER.email = payload.email
    return mock_data.MOCK_USER

@router.get("/users/me/preferences", response_model=Preferences)
def get_preferences() -> Preferences:
    return mock_data.MOCK_PREFERENCES

@router.patch("/users/me/preferences", response_model=Preferences)
def update_preferences(payload: Preferences) -> Preferences:
    mock_data.MOCK_PREFERENCES = payload
    return mock_data.MOCK_PREFERENCES

@router.get("/notifications", response_model=list[Notification])
def notifications() -> list[Notification]:
    return mock_data.MOCK_NOTIFICATIONS

@router.patch("/notifications/{notification_id}", response_model=Notification)
def mark_notification_read(notification_id: str) -> Notification:
    notification = next((item for item in mock_data.MOCK_NOTIFICATIONS if item.id == notification_id), None)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.read = True
    return notification

@router.get("/watchlist", response_model=WatchlistResponse)
def get_watchlist() -> WatchlistResponse:
    return WatchlistResponse(symbols=sorted(mock_data.MOCK_WATCHLIST))

@router.post("/watchlist", response_model=WatchlistResponse)
def add_watchlist(payload: WatchlistMutation) -> WatchlistResponse:
    mock_data.MOCK_WATCHLIST.add(payload.symbol.upper())
    return get_watchlist()

@router.delete("/watchlist/{symbol}", response_model=WatchlistResponse)
def remove_watchlist(symbol: str) -> WatchlistResponse:
    mock_data.MOCK_WATCHLIST.discard(symbol.upper())
    return get_watchlist()

@router.get("/portfolio", response_model=PortfolioResponse)
def portfolio() -> PortfolioResponse:
    return PortfolioResponse(holdings=mock_data.MOCK_HOLDINGS, total_value=842615.0, today_pnl=8421.0, overall_pnl=7031.0)
