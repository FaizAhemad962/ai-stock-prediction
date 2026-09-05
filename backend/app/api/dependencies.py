from fastapi import Header, HTTPException

from ..repositories.postgres import user_for_token
from ..schemas.users import User


def session_token(authorization: str | None = Header(default=None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    return authorization.removeprefix("Bearer ").strip()


def current_user(token: str = Header(default="", alias="Authorization")) -> User:
    token = session_token(token)
    user = user_for_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Session expired or invalid")
    return user