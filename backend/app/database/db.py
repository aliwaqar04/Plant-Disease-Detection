from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import BACKEND_DIR, settings

url = settings.DATABASE_URL
prefix = "sqlite:///./"
if url.startswith(prefix):
    # Always keep the database file inside backend/, whatever folder the server starts from.
    url = "sqlite:///" + (BACKEND_DIR / url[len(prefix):]).as_posix()

engine = create_engine(url, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()