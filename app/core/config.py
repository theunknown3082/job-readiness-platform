from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Job Readiness & Skill Tracking Platform"
    SECRET_KEY: str = "production-super-secret-key-change-in-env-32bytes"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    DATABASE_URL: str = "sqlite:///./readiness.db"

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
