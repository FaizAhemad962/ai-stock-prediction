from datetime import datetime, timezone

from fastapi import APIRouter

from ...schemas.common import HealthResponse

router = APIRouter(tags=["system"])


@router.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="ai-stock-prediction-api",
        timestamp=datetime.now(timezone.utc),
    )
