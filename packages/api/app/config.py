from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "LegisFlow API"
    debug: bool = False

    database_url: str = "postgresql+psycopg://legisflow:legisflow@localhost:5432/legisflow"
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    upload_dir: str = "/app/uploads"
    max_upload_bytes: int = 25 * 1024 * 1024

    llm_provider: Literal["ollama", "openai", "anthropic", "openrouter"] = "ollama"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2"
    ollama_embed_model: str = "nomic-embed-text"

    openai_api_key: str | None = None
    openai_model: str = "gpt-4o-mini"
    openai_embed_model: str = "text-embedding-3-small"

    anthropic_api_key: str | None = None
    anthropic_model: str = "claude-3-5-haiku-latest"

    openrouter_api_key: str | None = None
    openrouter_model: str = "meta-llama/llama-3.2-3b-instruct:free"

    cors_origins: str = "http://localhost:3000"
    n8n_webhook_secret: str = "legisflow-webhook-secret"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
