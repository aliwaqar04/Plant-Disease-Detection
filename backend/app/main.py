from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import models
from app.database.db import Base, engine

from app.config import settings
from app.routes import dashboard, diseases, history, predict
from app.services import prediction_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    prediction_service.load_model()
    yield


app = FastAPI(title="Plant Disease Detection API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)
app.include_router(dashboard.router)
app.include_router(history.router)
app.include_router(diseases.router)

@app.get("/api/health")
def health():
    return {"status": "ok", "model_loaded": prediction_service.is_loaded()}