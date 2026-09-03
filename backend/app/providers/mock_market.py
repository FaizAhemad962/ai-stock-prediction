from datetime import datetime, timezone

from ..schemas.markets import (
    MarketIndex,
    MarketMover,
    MarketOverviewResponse,
    SectorPerformance,
)


class MockMarketProvider:
    def get_overview(self, exchange: str) -> MarketOverviewResponse:
        return MarketOverviewResponse(
            exchange=exchange,
            market_status="closed",
            as_of=datetime.now(timezone.utc),
            is_stale=True,
            indices=[
                MarketIndex(name="NIFTY 50", value=24718.60, change=182.45, change_percent=0.74),
                MarketIndex(name="SENSEX", value=80567.42, change=594.91, change_percent=0.74),
                MarketIndex(name="NIFTY BANK", value=54231.80, change=-124.30, change_percent=-0.23),
                MarketIndex(name="NIFTY IT", value=41892.25, change=386.70, change_percent=0.93),
            ],
            gainers=[
                MarketMover(symbol="SUZLON", name="Suzlon Energy", price=52.40, change_percent=4.21),
                MarketMover(symbol="TATASTEEL", name="Tata Steel", price=168.25, change_percent=3.68),
            ],
            losers=[
                MarketMover(symbol="INFY", name="Infosys", price=1482.20, change_percent=-2.14),
                MarketMover(symbol="TCS", name="Tata Consultancy Services", price=3184.50, change_percent=-0.41),
            ],
            sectors=[
                SectorPerformance(name="Information Technology", performance_percent=1.82),
                SectorPerformance(name="Renewable Energy", performance_percent=1.54),
                SectorPerformance(name="Banking", performance_percent=-0.23),
            ],
        )
