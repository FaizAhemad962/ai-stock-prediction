from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["service"] == "ai-stock-prediction-api"


def test_market_overview_defaults_to_nse() -> None:
    response = client.get("/api/markets/overview")

    assert response.status_code == 200
    assert response.json()["exchange"] == "NSE"
    assert len(response.json()["indices"]) == 4


def test_market_overview_rejects_unknown_exchange() -> None:
    response = client.get("/api/markets/overview?exchange=NYSE")

    assert response.status_code == 422
