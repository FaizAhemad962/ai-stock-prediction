from datetime import datetime, timezone
import time
from typing import Any

import httpx

from ..schemas.markets import MarketIndex, MarketMover, MarketOverviewResponse, SectorPerformance
from ..schemas.news import NewsArticle, NewsListResponse
from ..schemas.stocks import PricePoint, Stock, StockHistoryResponse, StockSearchResponse, StockTechnicalsResponse, TechnicalIndicator


class YahooFinanceError(RuntimeError):
    pass


class YahooFinanceProvider:
    base_url = "https://query2.finance.yahoo.com"

    def __init__(self, timeout: float = 15.0) -> None:
        self.timeout = timeout
        self._cache: dict[str, tuple[float, dict[str, Any]]] = {}

    def _get(self, path: str, params: dict[str, Any]) -> dict[str, Any]:
        cache_key = f"{path}?{sorted(params.items())}"
        cached = self._cache.get(cache_key)
        if cached and cached[0] > time.monotonic():
            return cached[1]
        try:
            response = httpx.get(
                f"{self.base_url}{path}",
                params=params,
                timeout=self.timeout,
                headers={"User-Agent": "Mozilla/5.0 (compatible; AIStockPrediction/1.0)"},
            )
            response.raise_for_status()
            payload = response.json()
            self._cache[cache_key] = (time.monotonic() + 30, payload)
            return payload
        except (httpx.HTTPError, ValueError) as error:
            raise YahooFinanceError("Yahoo Finance is temporarily unavailable") from error

    @staticmethod
    def _ticker(symbol: str, exchange: str) -> str:
        suffix = ".NS" if exchange == "NSE" else ".BO"
        return symbol.upper() if symbol.upper().endswith(suffix) else f"{symbol.upper()}{suffix}"

    def _chart(self, ticker: str, range: str = "1d", interval: str = "1d") -> dict[str, Any]:
        payload = self._get(f"/v8/finance/chart/{ticker}", {"range": range, "interval": interval})
        result = (payload.get("chart", {}).get("result") or [None])[0]
        if not result:
            raise YahooFinanceError(f"No market data found for {ticker}")
        return result

    def get_stock(self, symbol: str, exchange: str = "NSE") -> Stock:
        ticker = self._ticker(symbol, exchange)
        meta = self._chart(ticker)["meta"]
        price = float(meta.get("regularMarketPrice") or meta.get("previousClose") or 0)
        previous = float(meta.get("previousClose") or price)
        change = price - previous
        return Stock(
            symbol=symbol.upper(),
            name=meta.get("longName") or meta.get("shortName") or symbol.upper(),
            exchange=exchange,
            sector="Unknown",
            price=price,
            change=change,
            change_percent=(change / previous * 100) if previous else 0,
            currency=meta.get("currency", "INR"),
            market_cap=None,
            volume=None,
        )

    def search_stocks(self, query: str, exchange: str = "NSE") -> StockSearchResponse:
        payload = self._get("/v1/finance/search", {"q": query, "quotesCount": 20, "newsCount": 0})
        suffix = ".NS" if exchange == "NSE" else ".BO"
        results: list[Stock] = []
        for quote in payload.get("quotes", []):
            if quote.get("quoteType") != "EQUITY" or not quote.get("symbol", "").endswith(suffix):
                continue
            try:
                stock = self.get_stock(quote["symbol"].removesuffix(suffix), exchange)
            except YahooFinanceError:
                continue
            stock.name = quote.get("longname") or quote.get("shortname") or stock.name
            stock.sector = quote.get("sectorDisp") or quote.get("sector") or stock.sector
            results.append(stock)
        return StockSearchResponse(query=query, exchange=exchange, results=results)

    def get_history(self, symbol: str, range: str, exchange: str = "NSE") -> StockHistoryResponse:
        yahoo_ranges = {"1D": "1d", "1W": "5d", "1M": "1mo", "6M": "6mo", "1Y": "1y", "5Y": "5y"}
        result = self._chart(self._ticker(symbol, exchange), range=yahoo_ranges.get(range.upper(), "1mo"), interval="1d")
        timestamps = result.get("timestamp") or []
        quote = (result.get("indicators", {}).get("quote") or [{}])[0]
        points = [
            PricePoint(
                timestamp=datetime.fromtimestamp(timestamp, timezone.utc).isoformat(),
                price=float(price),
                volume=int(volume) if volume is not None else None,
            )
            for timestamp, price, volume in zip(timestamps, quote.get("close", []), quote.get("volume", []))
            if price is not None
        ]
        return StockHistoryResponse(symbol=symbol.upper(), exchange=exchange, range=range, as_of=datetime.now(timezone.utc), is_stale=False, points=points)

    def get_technicals(self, symbol: str, exchange: str = "NSE") -> StockTechnicalsResponse:
        history = self.get_history(symbol, "6mo", exchange)
        prices = [point.price for point in history.points]
        latest = prices[-1] if prices else 0
        sma_20 = sum(prices[-20:]) / min(len(prices), 20) if prices else 0
        change = ((latest - prices[-2]) / prices[-2] * 100) if len(prices) > 1 and prices[-2] else 0
        signal = "Positive" if latest >= sma_20 else "Caution"
        return StockTechnicalsResponse(
            symbol=symbol.upper(),
            exchange=exchange,
            as_of=datetime.now(timezone.utc),
            indicators=[
                TechnicalIndicator(label="Price vs 20D SMA", value=f"{sma_20:.2f}", status="Above" if latest >= sma_20 else "Below", signal=signal),
                TechnicalIndicator(label="Daily change", value=f"{change:+.2f}%", status="Momentum", signal="Positive" if change >= 0 else "Caution"),
            ],
        )

    def get_news(self, query: str | None = None, symbol: str | None = None, page: int = 1, page_size: int = 20) -> NewsListResponse:
        search = query or symbol or "NSE stocks"
        payload = self._get("/v1/finance/search", {"q": search, "quotesCount": 0, "newsCount": page_size})
        items: list[NewsArticle] = []
        symbols = [symbol.upper()] if symbol else []
        for article in payload.get("news", []):
            published = datetime.fromtimestamp(article.get("providerPublishTime", datetime.now().timestamp()), timezone.utc)
            items.append(NewsArticle(id=article.get("uuid") or article.get("title", "article"), title=article.get("title", "Market news"), summary=article.get("title", ""), source=article.get("publisher", "Yahoo Finance"), published_at=published, url=article.get("link", "https://finance.yahoo.com"), category="Markets", sentiment="Neutral", impact="Low", symbols=symbols))
        return NewsListResponse(items=items, page=page, page_size=page_size, total=len(items))

    def get_overview(self, exchange: str = "NSE") -> MarketOverviewResponse:
        index_specs = [("NIFTY 50", "^NSEI"), ("SENSEX", "^BSESN"), ("NIFTY BANK", "^NSEBANK"), ("NIFTY IT", "^CNXIT")]
        indices: list[MarketIndex] = []
        for name, ticker in index_specs:
            meta = self._chart(ticker)["meta"]
            value = float(meta.get("regularMarketPrice") or 0)
            previous = float(meta.get("previousClose") or value)
            change = value - previous
            indices.append(MarketIndex(name=name, value=value, change=change, change_percent=(change / previous * 100) if previous else 0))

        gainers = self._get_movers("day_gainers")
        losers = self._get_movers("day_losers")
        return MarketOverviewResponse(exchange=exchange, market_status="open", as_of=datetime.now(timezone.utc), is_stale=False, indices=indices, gainers=gainers, losers=losers, sectors=[])

    def _get_movers(self, screener: str) -> list[MarketMover]:
        payload = self._get("/v1/finance/screener/predefined/saved", {"scrIds": screener, "count": 5})
        quotes = (((payload.get("finance", {}).get("result") or [{}])[0]).get("quotes") or [])
        movers: list[MarketMover] = []
        for quote in quotes:
            symbol = quote.get("symbol", "")
            if not symbol.endswith((".NS", ".BO")):
                continue
            movers.append(MarketMover(symbol=symbol.rsplit(".", 1)[0], name=quote.get("longName") or quote.get("shortName") or symbol, price=float(quote.get("regularMarketPrice") or 0), change_percent=float(quote.get("regularMarketChangePercent") or 0)))
        return movers