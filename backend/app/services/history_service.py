import json

from sqlalchemy.orm import Session

from app.database.models import Prediction


def save_prediction(db: Session, result: dict) -> Prediction:
    row = Prediction(
        predicted_class=result["predicted_class"],
        plant=result["plant"],
        disease=result["disease"],
        health_status=result["health_status"],
        confidence=result["confidence"],
        top_predictions=json.dumps(result["top_predictions"]),
        image_path=None,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def to_dict(row: Prediction) -> dict:
    return {
        "id": row.id,
        "predicted_class": row.predicted_class,
        "plant": row.plant,
        "disease": row.disease,
        "health_status": row.health_status,
        "confidence": row.confidence,
        "top_predictions": json.loads(row.top_predictions),
        "image_path": row.image_path,
        "created_at": row.created_at.isoformat() + "Z",  # stored in UTC
    }