from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "HireSense AI"
    api_prefix: str = "/api/v1"
    database_url: str = "sqlite:///./hiresense.db"
    secret_key: str = "dev-secret-change-me"
    access_token_expire_minutes: int = 1440
    cors_origins: str = "http://localhost:5173"
    max_upload_mb: int = 5
    use_sentence_transformers: bool = False
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def origins(self) -> list[str]:
        return [x.strip() for x in self.cors_origins.split(",") if x.strip()]

settings = Settings()
