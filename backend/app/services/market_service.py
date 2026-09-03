from ..providers.mock_market import MockMarketProvider
from ..schemas.markets import MarketOverviewResponse


class MarketService:
	def __init__(self, provider: MockMarketProvider | None = None) -> None:
		self.provider = provider or MockMarketProvider()

	def get_overview(self, exchange: str) -> MarketOverviewResponse:
		return self.provider.get_overview(exchange)
