from fastapi import APIRouter
from ...repositories.mock_data import MOCK_USER
from ...schemas.users import AuthRequest, AuthResponse, RegisterRequest, User

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=AuthResponse)
def register(payload: RegisterRequest) -> AuthResponse:
    return AuthResponse(user=User(id=MOCK_USER.id, name=payload.name, email=payload.email), message="Mock registration successful")

@router.post("/login", response_model=AuthResponse)
def login(payload: AuthRequest) -> AuthResponse:
    return AuthResponse(user=MOCK_USER, message="Mock login successful")

@router.post("/logout")
def logout() -> dict[str, str]:
    return {"message": "Mock logout successful"}

@router.get("/me", response_model=User)
def auth_me() -> User:
    return MOCK_USER

@router.get("/google/start")
def google_start() -> dict[str, str]:
    return {"message": "Google OAuth is not configured in mock mode"}

@router.get("/google/callback")
def google_callback() -> dict[str, str]:
    return {"message": "Google OAuth callback is not configured in mock mode"}
