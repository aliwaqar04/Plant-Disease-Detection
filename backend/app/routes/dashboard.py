from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import Prediction
from app.services.history_service import to_dict

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


def _count(db: Session, *conditions) -> int:
    stmt = select(func.count()).select_from(Prediction)
    for c in conditions:
        stmt = stmt.where(c)
    return db.scalar(stmt) or 0


@router.get("")
def dashboard(db: Session = Depends(get_db)):
    total = _count(db)
    healthy = _count(db, Prediction.health_status == "Healthy")
    diseased = _count(db, Prediction.health_status == "Diseased")

    freq_rows = db.execute(
        select(
            Prediction.predicted_class,
            Prediction.plant,
            Prediction.disease,
            func.count().label("count"),
        )
        .where(Prediction.health_status == "Diseased")
        .group_by(Prediction.predicted_class, Prediction.plant, Prediction.disease)
        .order_by(func.count().desc())
    ).all()

    cutoff = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=30)
    day = func.date(Prediction.created_at)
    trend_rows = db.execute(
        select(day.label("date"), func.count().label("count"))
        .where(Prediction.created_at >= cutoff)
        .group_by(day)
        .order_by(day)
    ).all()

    recent = db.scalars(select(Prediction).order_by(Prediction.id.desc()).limit(5)).all()
    avg_conf = db.scalar(select(func.avg(Prediction.confidence)))

    return {
        "total_predictions": total,
        "healthy": healthy,
        "diseased": diseased,
        "average_confidence": round(avg_conf, 4) if avg_conf is not None else None,
        "disease_frequency": [
            {"class": r.predicted_class, "plant": r.plant, "disease": r.disease, "count": r.count}
            for r in freq_rows
        ],
        "daily_trend": [{"date": r.date, "count": r.count} for r in trend_rows],
        "recent": [to_dict(r) for r in recent],
    }