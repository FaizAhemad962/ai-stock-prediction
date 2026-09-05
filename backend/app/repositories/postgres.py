from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from hashlib import pbkdf2_hmac
from os import urandom
from typing import Iterator
from uuid import uuid4

import psycopg
from psycopg.rows import dict_row

from ..core.config import get_settings
from ..schemas.portfolio import Holding, PortfolioPerformancePoint
from ..schemas.users import Notification, Preferences, PrivacyPreferences, SessionInfo, User


@contextmanager
def connection() -> Iterator[psycopg.Connection]:
    database_url = get_settings().database_url
    if not database_url:
        raise RuntimeError("DATABASE_URL is required for PostgreSQL persistence")
    with psycopg.connect(database_url, row_factory=dict_row) as conn:
        yield conn


def hash_password(password: str, salt: bytes | None = None) -> str:
    salt = salt or urandom(16)
    digest = pbkdf2_hmac("sha256", password.encode(), salt, 120_000)
    return f"{salt.hex()}${digest.hex()}"


def verify_password(password: str, encoded: str) -> bool:
    try:
        salt, expected = encoded.split("$", 1)
        actual = pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), 120_000).hex()
        return actual == expected
    except ValueError:
        return False


def create_user(name: str, email: str, password: str) -> tuple[User, str]:
    user_id = uuid4()
    token = urandom(32).hex()
    with connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("INSERT INTO users (id, name, email, password_hash) VALUES (%s, %s, %s, %s)", (user_id, name, email.lower(), hash_password(password)))
            cursor.execute("INSERT INTO preferences (user_id) VALUES (%s)", (user_id,))
            cursor.execute("INSERT INTO sessions (token, user_id, expires_at) VALUES (%s, %s, %s)", (token, user_id, datetime.now(timezone.utc) + timedelta(days=30)))
    return User(id=str(user_id), name=name, email=email.lower()), token


def authenticate(email: str, password: str) -> tuple[User, str] | None:
    with connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, name, email, password_hash FROM users WHERE email = %s", (email.lower(),))
            row = cursor.fetchone()
            if not row or not verify_password(password, row["password_hash"]):
                return None
            token = urandom(32).hex()
            cursor.execute("INSERT INTO sessions (token, user_id, expires_at) VALUES (%s, %s, %s)", (token, row["id"], datetime.now(timezone.utc) + timedelta(days=30)))
    return User(id=str(row["id"]), name=row["name"], email=row["email"]), token


def user_for_token(token: str) -> User | None:
    with connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT u.id, u.name, u.email FROM users u JOIN sessions s ON s.user_id = u.id WHERE s.token = %s AND s.expires_at > NOW()", (token,))
            row = cursor.fetchone()
    return User(id=str(row["id"]), name=row["name"], email=row["email"]) if row else None


def delete_session(token: str) -> None:
    with connection() as conn:
        conn.execute("DELETE FROM sessions WHERE token = %s", (token,))


def update_user(user_id: str, name: str | None, email: str | None) -> User:
    with connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("UPDATE users SET name = COALESCE(%s, name), email = COALESCE(%s, email) WHERE id = %s RETURNING id, name, email", (name, email.lower() if email else None, user_id))
            row = cursor.fetchone()
    if not row:
        raise ValueError("User not found")
    return User(id=str(row["id"]), name=row["name"], email=row["email"])


def get_preferences(user_id: str) -> Preferences:
    with connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT theme, compact_mode, notifications, price_alerts, news_alerts, ai_alerts, market_region, timezone, ai_frequency_minutes FROM preferences WHERE user_id = %s", (user_id,))
            row = cursor.fetchone()
    if not row:
        raise ValueError("Preferences not found")
    return Preferences(**row)


def update_preferences(user_id: str, preferences: Preferences) -> Preferences:
    values = preferences.model_dump()
    with connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("UPDATE preferences SET theme=%s, compact_mode=%s, notifications=%s, price_alerts=%s, news_alerts=%s, ai_alerts=%s, market_region=%s, timezone=%s, ai_frequency_minutes=%s WHERE user_id=%s", (*values.values(), user_id))
    return preferences


def get_watchlist(user_id: str) -> list[str]:
    with connection() as conn:
        return [row["symbol"] for row in conn.execute("SELECT symbol FROM watchlist_symbols WHERE user_id = %s ORDER BY symbol", (user_id,)).fetchall()]


def add_watchlist(user_id: str, symbol: str) -> list[str]:
    with connection() as conn:
        conn.execute("INSERT INTO watchlist_symbols (user_id, symbol) VALUES (%s, %s) ON CONFLICT DO NOTHING", (user_id, symbol.upper()))
    return get_watchlist(user_id)


def remove_watchlist(user_id: str, symbol: str) -> list[str]:
    with connection() as conn:
        conn.execute("DELETE FROM watchlist_symbols WHERE user_id = %s AND symbol = %s", (user_id, symbol.upper()))
    return get_watchlist(user_id)


def get_portfolio(user_id: str) -> tuple[list[Holding], float, float, float]:
    with connection() as conn:
        rows = conn.execute("SELECT symbol, quantity, average_price, current_price FROM portfolio_holdings WHERE user_id = %s ORDER BY symbol", (user_id,)).fetchall()
    holdings = []
    for row in rows:
        pnl = float(row["current_price"] - row["average_price"]) * row["quantity"]
        cost = float(row["average_price"]) * row["quantity"]
        holdings.append(Holding(symbol=row["symbol"], quantity=row["quantity"], average_price=float(row["average_price"]), current_price=float(row["current_price"]), pnl=pnl, pnl_percent=(pnl / cost * 100) if cost else 0))
    total = sum(item.current_price * item.quantity for item in holdings)
    overall = sum(item.pnl for item in holdings)
    return holdings, total, 0, overall


def upsert_portfolio_holding(user_id: str, symbol: str, quantity: int, average_price: float) -> None:
    with connection() as conn:
        conn.execute("INSERT INTO portfolio_holdings (user_id, symbol, quantity, average_price, current_price) VALUES (%s, %s, %s, %s, %s) ON CONFLICT (user_id, symbol) DO UPDATE SET quantity = EXCLUDED.quantity, average_price = EXCLUDED.average_price", (user_id, symbol.upper(), quantity, average_price, average_price))
        total = conn.execute("SELECT COALESCE(SUM(quantity * current_price), 0) AS total FROM portfolio_holdings WHERE user_id = %s", (user_id,)).fetchone()["total"]
        conn.execute("INSERT INTO portfolio_performance (user_id, recorded_at, total_value) VALUES (%s, NOW(), %s)", (user_id, total))


def remove_portfolio_holding(user_id: str, symbol: str) -> None:
    with connection() as conn:
        conn.execute("DELETE FROM portfolio_holdings WHERE user_id = %s AND symbol = %s", (user_id, symbol.upper()))
        total = conn.execute("SELECT COALESCE(SUM(quantity * current_price), 0) AS total FROM portfolio_holdings WHERE user_id = %s", (user_id,)).fetchone()["total"]
        conn.execute("INSERT INTO portfolio_performance (user_id, recorded_at, total_value) VALUES (%s, NOW(), %s)", (user_id, total))


def record_portfolio_performance(user_id: str, total_value: float) -> None:
    with connection() as conn:
        conn.execute("INSERT INTO portfolio_performance (user_id, recorded_at, total_value) VALUES (%s, NOW(), %s)", (user_id, total_value))


def get_portfolio_performance(user_id: str, limit: int = 120) -> list[PortfolioPerformancePoint]:
    with connection() as conn:
        rows = conn.execute("SELECT recorded_at, total_value FROM portfolio_performance WHERE user_id = %s ORDER BY recorded_at DESC LIMIT %s", (user_id, limit)).fetchall()
    return [PortfolioPerformancePoint(timestamp=row["recorded_at"].isoformat(), total_value=float(row["total_value"])) for row in reversed(rows)]


def change_password(user_id: str, current_password: str, new_password: str) -> None:
    with connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT password_hash FROM users WHERE id = %s", (user_id,))
            row = cursor.fetchone()
            if not row or not verify_password(current_password, row["password_hash"]):
                raise ValueError("Current password is incorrect")
            cursor.execute("UPDATE users SET password_hash = %s WHERE id = %s", (hash_password(new_password), user_id))
            cursor.execute("DELETE FROM sessions WHERE user_id = %s", (user_id,))


def get_sessions(user_id: str, current_token: str) -> list[SessionInfo]:
    with connection() as conn:
        rows = conn.execute("SELECT token, expires_at FROM sessions WHERE user_id = %s ORDER BY expires_at DESC", (user_id,)).fetchall()
    return [SessionInfo(token_hint=f"...{row['token'][-6:]}", expires_at=row["expires_at"].isoformat(), current=row["token"] == current_token) for row in rows]


def revoke_other_sessions(user_id: str, current_token: str) -> None:
    with connection() as conn:
        conn.execute("DELETE FROM sessions WHERE user_id = %s AND token <> %s", (user_id, current_token))


def get_privacy(user_id: str) -> PrivacyPreferences:
    with connection() as conn:
        row = conn.execute("SELECT analytics, personalization FROM preferences WHERE user_id = %s", (user_id,)).fetchone()
    if not row:
        raise ValueError("Privacy preferences not found")
    return PrivacyPreferences(**row)


def update_privacy(user_id: str, privacy: PrivacyPreferences) -> PrivacyPreferences:
    with connection() as conn:
        conn.execute("UPDATE preferences SET analytics = %s, personalization = %s WHERE user_id = %s", (privacy.analytics, privacy.personalization, user_id))
    return privacy


def get_notifications(user_id: str) -> list[Notification]:
    with connection() as conn:
        rows = conn.execute("SELECT id, title, message, read, created_at FROM notifications WHERE user_id = %s ORDER BY created_at DESC", (user_id,)).fetchall()
    return [Notification(id=str(row["id"]), title=row["title"], message=row["message"], read=row["read"], created_at=row["created_at"].isoformat()) for row in rows]


def mark_notification_read(user_id: str, notification_id: str) -> Notification | None:
    with connection() as conn:
        conn.execute("UPDATE notifications SET read = TRUE WHERE id = %s AND user_id = %s", (notification_id, user_id))
    return next((item for item in get_notifications(user_id) if item.id == notification_id), None)