"""LLM provider factory — Ollama default, paid providers via env."""

from pydantic_ai.models import Model

from app.config import Settings, get_settings


def get_chat_model(settings: Settings | None = None) -> Model:
    s = settings or get_settings()
    provider = s.llm_provider

    if provider == "ollama":
        from pydantic_ai.models.openai import OpenAIModel

        return OpenAIModel(
            s.ollama_model,
            base_url=f"{s.ollama_base_url.rstrip('/')}/v1",
            api_key="ollama",
        )

    if provider == "openai":
        from pydantic_ai.models.openai import OpenAIModel

        return OpenAIModel(s.openai_model, api_key=s.openai_api_key)

    if provider == "anthropic":
        from pydantic_ai.models.anthropic import AnthropicModel

        return AnthropicModel(s.anthropic_model, api_key=s.anthropic_api_key)

    if provider == "openrouter":
        from pydantic_ai.models.openai import OpenAIModel

        return OpenAIModel(
            s.openrouter_model,
            base_url="https://openrouter.ai/api/v1",
            api_key=s.openrouter_api_key,
        )

    raise ValueError(f"Unknown LLM provider: {provider}")


def get_llm_config() -> dict[str, str]:
    s = get_settings()
    if s.llm_provider == "ollama":
        return {
            "provider": s.llm_provider,
            "chat_model": s.ollama_model,
            "embed_model": s.ollama_embed_model,
        }
    if s.llm_provider == "openai":
        return {
            "provider": s.llm_provider,
            "chat_model": s.openai_model,
            "embed_model": s.openai_embed_model,
        }
    return {
        "provider": s.llm_provider,
        "chat_model": getattr(s, f"{s.llm_provider}_model", "unknown"),
        "embed_model": s.ollama_embed_model,
    }
