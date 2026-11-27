from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_DIR = BACKEND_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BACKEND_DIR / ".env", extra="ignore")

    # From .env
    DATABASE_URL: str = "sqlite:///./plant_disease.db"
    MAX_UPLOAD_MB: int = 5
    ALLOWED_ORIGINS: str = "http://localhost:5173"

    # Model files (same ones tested in Phase 7, Step 4)
    MODEL_PATH: Path = PROJECT_DIR / "ai" / "models" / "plant_cnn_best.keras"
    CLASS_NAMES_PATH: Path = PROJECT_DIR / "ai" / "dataset" / "class_names.json"
    IMAGE_SIZE: int = 128

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    @property
    def max_upload_bytes(self) -> int:
        return self.MAX_UPLOAD_MB * 1024 * 1024


settings = Settings()