from pydantic import BaseModel, ConfigDict, Field

class User(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str
    name: str
    email: str

class UserUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str | None = None
    email: str | None = None

class Preferences(BaseModel):
    model_config = ConfigDict(extra="forbid")
    theme: str = "dark"
    compact_mode: bool = False
    notifications: bool = True
    price_alerts: bool = True
    news_alerts: bool = True
    ai_alerts: bool = True
    market_region: str = "India"
    timezone: str = "Asia/Kolkata"
    ai_frequency_minutes: int = Field(default=15, ge=5, le=1440)

class Notification(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str
    title: str
    message: str
    read: bool = False
    created_at: str

class AuthRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    email: str
    password: str = Field(min_length=8)

class RegisterRequest(AuthRequest):
    name: str = Field(min_length=1)

class PasswordChangeRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    current_password: str = Field(min_length=8)
    new_password: str = Field(min_length=8)

class SessionInfo(BaseModel):
    token_hint: str
    expires_at: str
    current: bool = False

class PrivacyPreferences(BaseModel):
    analytics: bool = True
    personalization: bool = True

class AuthResponse(BaseModel):
    user: User
    authenticated: bool = True
    message: str
    token: str
