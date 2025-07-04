from dotenv import load_dotenv
from sqlmodel import Session, create_engine
import os

load_dotenv()
DB_URL = os.getenv("DB_URL")
if DB_URL is None:
    raise ValueError("DB_URL is not defined in .env")
engine = create_engine(DB_URL, echo=False)


def get_session():
    with Session(engine) as session:
        yield session
