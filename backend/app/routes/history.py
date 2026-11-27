from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import Prediction
from app.services.history_service import to_dict

router = APIRouter(prefix="/api/history", tags=["history"])


@router.get("")
def list_history(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    rows = db.scalars(
        select(Prediction).order_by(Prediction.id.desc()).limit(limit).offset(offset)
    ).all()
    total = db.scalar(select(func.count()).select_from(Prediction))
    return {"total": total, "items": [to_dict(r) for r in rows]}


@router.get("/{record_id}")
def get_record(record_id: int, db: Session = Depends(get_db)):
    row = db.get(Prediction, record_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Record not found.")
    return to_dict(row)


@router.delete("/{record_id}")
def delete_record(record_id: int, db: Session = Depends(get_db)):
    row = db.get(Prediction, record_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Record not found.")
    db.delete(row)
    db.commit()
    return {"deleted": record_id}


@router.delete("")
def clear_history(db: Session = Depends(get_db)):
    count = db.query(Prediction).delete()
    db.commit()
    return {"deleted": count}