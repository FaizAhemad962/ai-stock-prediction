from fastapi import APIRouter, Depends, Header, HTTPException
from ...api.dependencies import current_user
from ...repositories.postgres import authenticate, create_user, delete_session
from ...schemas.users import AuthRequest, AuthResponse, RegisterRequest, User

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=AuthResponse)
def register(payload: RegisterRequest) -> AuthResponse:
    try:
        user, token = create_user(payload.name, payload.email, payload.password)
    except Exception as error:
        raise HTTPException(status_code=409, detail="An account with this email already exists") from error
    return AuthResponse(user=user, token=token, message="Registration successful")

@router.post("/login", response_model=AuthResponse)
def login(payload: AuthRequest) -> AuthResponse:
    result = authenticate(payload.email, payload.password)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    user, token = result
    return AuthResponse(user=user, token=token, message="Login successful")

@router.post("/logout")
def logout(authorization: str | None = Header(default=None)) -> dict[str, str]:
    if authorization and authorization.startswith("Bearer "):
        delete_session(authorization.removeprefix("Bearer ").strip())
    return {"message": "Logout successful"}

@router.get("/me", response_model=User)
def auth_me(user: User = Depends(current_user)) -> User:
    return user

@router.get("/google/start")
def google_start() -> dict[str, str]:
    return {"message": "Google OAuth is not configured"}

@router.get("/google/callback")
def google_callback() -> dict[str, str]:
    return {"message": "Google OAuth is not configured"}
