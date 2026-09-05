from ..providers.yahoo_finance import YahooFinanceProvider
from ..schemas.markets import MarketOverviewResponse


class MarketService:
	def __init__(self, provider: YahooFinanceProvider | None = None) -> None:
		self.provider = provider or YahooFinanceProvider()

	def get_overview(self, exchange: str) -> MarketOverviewResponse:
		return self.provider.get_overview(exchange)
