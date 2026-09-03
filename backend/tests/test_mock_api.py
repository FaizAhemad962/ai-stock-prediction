from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


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


def test_mock_user_workflows() -> None:
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


def test_mock_auth_and_insights() -> None:
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
    assert payload["market_score"] == 72
    assert payload["positive_signals"] == 14
    assert payload["factors"]
    assert payload["risks"]
    assert payload["news_signals"]
