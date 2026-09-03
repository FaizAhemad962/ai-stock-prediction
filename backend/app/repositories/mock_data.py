from datetime import datetime, timezone

from ..schemas.news import NewsArticle
from ..schemas.portfolio import Holding
from ..schemas.stocks import PricePoint, Stock, TechnicalIndicator
from ..schemas.users import Notification, Preferences, User

MOCK_STOCKS = [
    Stock(symbol="SUZLON", name="Suzlon Energy", exchange="NSE", sector="Renewable Energy", price=52.40, change=1.18, change_percent=2.31, market_cap=714000, volume=84200000),
    Stock(symbol="RELIANCE", name="Reliance Industries", exchange="NSE", sector="Oil and Gas", price=1458.25, change=12.40, change_percent=0.86, market_cap=19700000, volume=12400000),
    Stock(symbol="TCS", name="Tata Consultancy Services", exchange="NSE", sector="Information Technology", price=3184.50, change=-13.10, change_percent=-0.41, market_cap=11500000, volume=3100000),
    Stock(symbol="INFY", name="Infosys", exchange="NSE", sector="Information Technology", price=1482.20, change=-32.40, change_percent=-2.14, market_cap=6150000, volume=9200000),
    Stock(symbol="TATASTEEL", name="Tata Steel", exchange="NSE", sector="Metals", price=168.25, change=5.97, change_percent=3.68, market_cap=2100000, volume=22100000),
    Stock(symbol="HDFCBANK", name="HDFC Bank", exchange="NSE", sector="Banking", price=1742.60, change=6.25, change_percent=0.36, market_cap=13200000, volume=5400000),
]

MOCK_HISTORY = [
    PricePoint(timestamp="09:15", price=50.80, volume=1200000),
    PricePoint(timestamp="10:30", price=51.35, volume=1600000),
    PricePoint(timestamp="11:45", price=50.95, volume=1100000),
    PricePoint(timestamp="13:00", price=51.80, volume=1900000),
    PricePoint(timestamp="14:15", price=52.10, volume=2200000),
    PricePoint(timestamp="15:30", price=52.40, volume=2600000),
]

MOCK_TECHNICALS = [
    TechnicalIndicator(label="RSI", value="58.2", status="Neutral", signal="Neutral"),
    TechnicalIndicator(label="MACD", value="+1.24", status="Positive", signal="Bullish"),
    TechnicalIndicator(label="50 DMA", value="₹47.82", status="Above", signal="Bullish"),
    TechnicalIndicator(label="200 DMA", value="₹41.56", status="Above", signal="Bullish"),
]

MOCK_NEWS = [
    NewsArticle(id="renewable-interest", title="Renewable energy sector attracts renewed investor attention", summary="Investors continue to track renewable energy companies as new capacity additions support the sector.", source="Economic Times", published_at=datetime.now(timezone.utc), url="https://economictimes.indiatimes.com", category="Renewable Energy", sentiment="Positive", impact="High", symbols=["SUZLON"]),
    NewsArticle(id="wind-capacity", title="Wind energy companies remain in focus as capacity additions accelerate", summary="Wind energy companies remain in focus as investors monitor sector fundamentals.", source="Moneycontrol", published_at=datetime.now(timezone.utc), url="https://www.moneycontrol.com", category="Renewable Energy", sentiment="Positive", impact="Medium", symbols=["SUZLON", "TATASTEEL"]),
    NewsArticle(id="it-demand", title="IT stocks remain mixed as investors assess global technology demand", summary="Large-cap technology stocks show mixed movement while markets await more clarity.", source="Business Standard", published_at=datetime.now(timezone.utc), url="https://www.business-standard.com", category="Technology", sentiment="Neutral", impact="Medium", symbols=["TCS", "INFY"]),
]

MOCK_USER = User(id="user-demo", name="Investor", email="investor@example.com")
MOCK_PREFERENCES = Preferences()
MOCK_NOTIFICATIONS = [
    Notification(id="price-suzlon", title="Price movement", message="SUZLON moved up 2.31% today.", created_at="2026-09-03T09:00:00Z"),
    Notification(id="ai-watchlist", title="AI insight ready", message="A new AI insight is available for your watchlist.", created_at="2026-09-03T08:30:00Z"),
]
MOCK_WATCHLIST = {"SUZLON", "RELIANCE", "TCS", "INFY", "TATASTEEL", "HDFCBANK"}
MOCK_HOLDINGS = [
    Holding(symbol="SUZLON", quantity=500, average_price=46.20, current_price=52.40, pnl=3100.0, pnl_percent=13.42),
    Holding(symbol="RELIANCE", quantity=25, average_price=1365.40, current_price=1458.25, pnl=2321.25, pnl_percent=6.80),
    Holding(symbol="TCS", quantity=10, average_price=3020.00, current_price=3184.50, pnl=1645.0, pnl_percent=5.45),
]
