from sqlmodel import SQLModel, Field, UniqueConstraint
from datetime import datetime, timezone
from typing import Optional
from security import hash_password


def utc_now():
    return datetime.now(timezone.utc)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
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


class Lemma(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    lemma: str
    pos: str
    language: str
    __table_args__ = (UniqueConstraint("lemma", "pos", "language"),)


class UserLemma(SQLModel, table=True):  # optional but useful
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    lemma_id: int = Field(foreign_key="lemma.id")
    seen_count: int
