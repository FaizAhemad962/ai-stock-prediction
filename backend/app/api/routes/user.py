from fastapi import APIRouter, Depends, HTTPException
from ...api.dependencies import current_user, session_token
from ...repositories import postgres
from ...schemas.portfolio import PortfolioHoldingMutation, PortfolioPerformancePoint, PortfolioResponse, WatchlistMutation, WatchlistResponse
from ...schemas.users import Notification, PasswordChangeRequest, Preferences, PrivacyPreferences, SessionInfo, User, UserUpdate

router = APIRouter(prefix="/api", tags=["user"])

@router.get("/users/me", response_model=User)
def current_user_profile(user: User = Depends(current_user)) -> User:
    return user

@router.patch("/users/me", response_model=User)
def update_user(payload: UserUpdate, user: User = Depends(current_user)) -> User:
    return postgres.update_user(user.id, payload.name, payload.email)

@router.get("/users/me/preferences", response_model=Preferences)
def get_preferences(user: User = Depends(current_user)) -> Preferences:
    return postgres.get_preferences(user.id)

@router.patch("/users/me/preferences", response_model=Preferences)
def update_preferences(payload: Preferences, user: User = Depends(current_user)) -> Preferences:
    return postgres.update_preferences(user.id, payload)

@router.get("/notifications", response_model=list[Notification])
def notifications(user: User = Depends(current_user)) -> list[Notification]:
    return postgres.get_notifications(user.id)

@router.patch("/notifications/{notification_id}", response_model=Notification)
def mark_notification_read(notification_id: str, user: User = Depends(current_user)) -> Notification:
    notification = postgres.mark_notification_read(user.id, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.read = True
    return notification

@router.get("/watchlist", response_model=WatchlistResponse)
def get_watchlist(user: User = Depends(current_user)) -> WatchlistResponse:
    return WatchlistResponse(symbols=postgres.get_watchlist(user.id))

@router.post("/watchlist", response_model=WatchlistResponse)
def add_watchlist(payload: WatchlistMutation, user: User = Depends(current_user)) -> WatchlistResponse:
    return WatchlistResponse(symbols=postgres.add_watchlist(user.id, payload.symbol))

@router.delete("/watchlist/{symbol}", response_model=WatchlistResponse)
def remove_watchlist(symbol: str, user: User = Depends(current_user)) -> WatchlistResponse:
    return WatchlistResponse(symbols=postgres.remove_watchlist(user.id, symbol))

@router.get("/portfolio", response_model=PortfolioResponse)
def portfolio(user: User = Depends(current_user)) -> PortfolioResponse:
    holdings, total_value, today_pnl, overall_pnl = postgres.get_portfolio(user.id)
    return PortfolioResponse(holdings=holdings, total_value=total_value, today_pnl=today_pnl, overall_pnl=overall_pnl)

@router.post("/users/me/password")
def change_password(payload: PasswordChangeRequest, user: User = Depends(current_user)) -> dict[str, str]:
    try:
        postgres.change_password(user.id, payload.current_password, payload.new_password)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    return {"message": "Password updated; all sessions were revoked"}

@router.get("/users/me/sessions", response_model=list[SessionInfo])
def sessions(user: User = Depends(current_user), token: str = Depends(session_token)) -> list[SessionInfo]:
    return postgres.get_sessions(user.id, token)

@router.delete("/users/me/sessions")
def revoke_other_sessions(user: User = Depends(current_user), token: str = Depends(session_token)) -> dict[str, str]:
    postgres.revoke_other_sessions(user.id, token)
    return {"message": "Other sessions revoked"}

@router.get("/users/me/privacy", response_model=PrivacyPreferences)
def privacy(user: User = Depends(current_user)) -> PrivacyPreferences:
    return postgres.get_privacy(user.id)

@router.patch("/users/me/privacy", response_model=PrivacyPreferences)
def update_privacy(payload: PrivacyPreferences, user: User = Depends(current_user)) -> PrivacyPreferences:
    return postgres.update_privacy(user.id, payload)

@router.get("/portfolio/performance", response_model=list[PortfolioPerformancePoint])
def portfolio_performance(user: User = Depends(current_user)) -> list[PortfolioPerformancePoint]:
    return postgres.get_portfolio_performance(user.id)

@router.post("/portfolio", response_model=PortfolioResponse)
def add_portfolio_holding(payload: PortfolioHoldingMutation, user: User = Depends(current_user)) -> PortfolioResponse:
    postgres.upsert_portfolio_holding(user.id, payload.symbol, payload.quantity, payload.average_price)
    return portfolio(user)

@router.delete("/portfolio/{symbol}", response_model=PortfolioResponse)
def remove_portfolio_holding(symbol: str, user: User = Depends(current_user)) -> PortfolioResponse:
    postgres.remove_portfolio_holding(user.id, symbol)
    return portfolio(user)
