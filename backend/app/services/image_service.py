import io

import numpy as np
import tensorflow as tf
from PIL import Image, UnidentifiedImageError

from app.config import settings

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"}
ALLOWED_FORMATS = {"JPEG", "PNG"}


class ImageError(ValueError):
    """Raised when an uploaded file is not an acceptable image."""


def validate_image(data: bytes, content_type: str | None) -> None:
    if not data:
        raise ImageError("The uploaded file is empty.")
    if len(data) > settings.max_upload_bytes:
        raise ImageError(f"File is too large. Maximum size is {settings.MAX_UPLOAD_MB} MB.")
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise ImageError("Only JPEG and PNG images are supported.")
    try:
        with Image.open(io.BytesIO(data)) as img:
            fmt = img.format
            img.verify()
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError):
        raise ImageError("File is not a valid JPEG or PNG image.")
    if fmt not in ALLOWED_FORMATS:
        raise ImageError("Only JPEG and PNG images are supported.")


def preprocess(data: bytes) -> np.ndarray:
    """Same steps as the Colab pipeline: RGB, bilinear resize, float32, 0-255."""
    try:
        img = tf.io.decode_image(data, channels=3, expand_animations=False)
    except tf.errors.InvalidArgumentError:
        raise ImageError("Image could not be decoded.")
    img = tf.image.resize(img, (settings.IMAGE_SIZE, settings.IMAGE_SIZE))
    return np.expand_dims(img.numpy().astype("float32"), 0)