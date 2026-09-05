import os

import pytest
from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)
database_required = pytest.mark.skipif(not os.getenv("DATABASE_URL"), reason="DATABASE_URL is required for PostgreSQL integration tests")


def test_stock_search_matches_company_name() -> None:
    response = client.get("/api/stocks/search?q=Suzlon")

    assert response.status_code == 200
    assert response.json()["results"][0]["symbol"] == "SUZLON"


def test_stock_details_and_history() -> None:
    stock_response = client.get("/api/stocks/SUZLON")
    history_response = client.get("/api/stocks/SUZLON/history?range=1M")

    assert stock_response.status_code == 200
    assert history_response.status_code == 200
    assert history_response.json()["points"]


def test_news_stock_mapping() -> None:
    response = client.get("/api/news/stock/SUZLON")

    assert response.status_code == 200
    assert response.json()["items"]
    assert "SUZLON" in response.json()["items"][0]["symbols"]


@database_required
def test_postgres_user_workflows() -> None:
    add_response = client.post("/api/watchlist", json={"symbol": "INFY"})
    portfolio_response = client.get("/api/portfolio")
    preferences_response = client.patch(
        "/api/users/me/preferences",
        json={"theme": "system", "compact_mode": True},
    )

    assert add_response.status_code == 200
    assert "INFY" in add_response.json()["symbols"]
    assert portfolio_response.status_code == 200
    assert preferences_response.status_code == 200
    assert preferences_response.json()["theme"] == "system"


@database_required
def test_postgres_auth_and_insights() -> None:
    login_response = client.post(
        "/api/auth/login",
        json={"email": "investor@example.com", "password": "password123"},
    )
    insight_response = client.get("/api/stocks/SUZLON/insights")

    assert login_response.status_code == 200
    assert login_response.json()["authenticated"] is True
    assert insight_response.status_code == 200
    assert insight_response.json()["prediction"]["symbol"] == "SUZLON"


def test_insights_dashboard_contains_all_ui_sections() -> None:
    response = client.get("/api/insights")

    assert response.status_code == 200
    payload = response.json()
    assert 0 <= payload["market_score"] <= 100
    assert 0 <= payload["positive_signals"] <= len(payload["items"])
    assert payload["factors"]
    assert payload["risks"]
    assert payload["news_signals"]


def test_public_prediction_contains_current_price_and_risks() -> None:
    response = client.get("/api/stocks/SUZLON/prediction")

    assert response.status_code == 200
    payload = response.json()
    assert payload["current_price"] > 0
    assert 0 <= payload["confidence"] <= 100
    assert payload["uncertainty"] == 100 - payload["confidence"]
    assert payload["risks"]
    assert payload["is_stale"] is False


def test_public_prediction_does_not_require_login() -> None:
    response = client.get("/api/stocks/INFY/prediction")

    assert response.status_code == 200
    assert response.json()["symbol"] == "INFY"

    def test_prediction_evaluation_returns_quality_metrics() -> None:
        response = client.get("/api/stocks/SUZLON/prediction/evaluation")

        assert response.status_code == 200
        payload = response.json()
        assert payload["symbol"] == "SUZLON"
        assert payload["model_version"] == "rules-v1"
        assert 0 <= payload["directional_accuracy"] <= 100
        assert payload["evaluated_points"] >= 0
