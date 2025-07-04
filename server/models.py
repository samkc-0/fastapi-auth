from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

from security import hash_password


def utc_now():
    return datetime.now(timezone.utc)


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password_hash: str
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=utc_now)

    @classmethod
    def from_create(cls, user_create: "UserCreate") -> "User":
        return cls(
            username=user_create.username,
            password_hash=hash_password(user_create.password),
        )


class UserCreate(SQLModel):
    username: str
    password: str


class UserLogin(SQLModel):
    username: str
    password: str


class UserRead(SQLModel):
    id: int
    username: str
    created_at: datetime
