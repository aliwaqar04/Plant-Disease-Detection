import json
import threading

import numpy as np
import tensorflow as tf

from app.config import settings

_model = None
_class_names: list[str] = []
_lock = threading.Lock()


def load_model() -> None:
    """Load the model and class names once (called at application startup)."""
    global _model, _class_names
    _model = tf.keras.models.load_model(settings.MODEL_PATH)
    with open(settings.CLASS_NAMES_PATH, encoding="utf-8") as f:
        _class_names = json.load(f)
    size = settings.IMAGE_SIZE
    _model.predict(np.zeros((1, size, size, 3), dtype="float32"), verbose=0)  # warm-up


def is_loaded() -> bool:
    return _model is not None


def class_names() -> list[str]:
    return list(_class_names)


def split_class(name: str) -> tuple[str, str]:
    plant, disease = name.split("___", 1)
    plant = "Bell pepper" if plant.startswith("Pepper") else plant.replace("_", " ")
    return plant, disease.replace("_", " ").capitalize()


def predict(x: np.ndarray, top_k: int = 3) -> dict:
    if _model is None:
        raise RuntimeError("Model is not loaded.")
    with _lock:
        probs = _model.predict(x, verbose=0)[0]
    order = probs.argsort()[::-1]
    best = _class_names[order[0]]
    plant, disease = split_class(best)
    return {
        "predicted_class": best,
        "plant": plant,
        "disease": disease,
        "health_status": "Healthy" if disease.lower() == "healthy" else "Diseased",
        "confidence": round(float(probs[order[0]]), 4),
        "top_predictions": [
            {"class": _class_names[i], "confidence": round(float(probs[i]), 4)}
            for i in order[:top_k]
        ],
    }