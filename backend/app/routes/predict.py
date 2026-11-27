from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
from starlette.concurrency import run_in_threadpool

from app.config import settings
from app.database.db import get_db
from app.services import prediction_service
from app.services.history_service import save_prediction
from app.services.image_service import ImageError, preprocess, validate_image

router = APIRouter(prefix="/api", tags=["predict"])


@router.post("/predict")
async def predict(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Read at most one byte over the limit, so huge uploads are not loaded fully.
    data = await file.read(settings.max_upload_bytes + 1)
    try:
        validate_image(data, file.content_type)
        x = await run_in_threadpool(preprocess, data)
    except ImageError as e:
        raise HTTPException(status_code=400, detail=str(e))
    result = await run_in_threadpool(prediction_service.predict, x)
    row = save_prediction(db, result)
    return {"id": row.id, **result}