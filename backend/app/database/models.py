from datetime import datetime, timezone

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.db import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(primary_key=True)
    predicted_class: Mapped[str] = mapped_column(String(100))
    plant: Mapped[str] = mapped_column(String(50))
    disease: Mapped[str] = mapped_column(String(100))
    health_status: Mapped[str] = mapped_column(String(20))
    confidence: Mapped[float]
    top_predictions: Mapped[str] = mapped_column(Text)  # stored as a JSON string
    image_path: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )