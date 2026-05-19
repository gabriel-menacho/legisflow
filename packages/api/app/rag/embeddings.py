import httpx

from app.config import get_settings


async def embed_texts(texts: list[str]) -> list[list[float]]:
    settings = get_settings()
    if settings.llm_provider == "openai" and settings.openai_api_key:
        return await _openai_embed(texts, settings.openai_api_key, settings.openai_embed_model)
    return await _ollama_embed(texts, settings.ollama_base_url, settings.ollama_embed_model)


async def _ollama_embed(texts: list[str], base_url: str, model: str) -> list[list[float]]:
    vectors: list[list[float]] = []
    async with httpx.AsyncClient(timeout=120.0) as client:
        for text in texts:
            resp = await client.post(
                f"{base_url.rstrip('/')}/api/embeddings",
                json={"model": model, "prompt": text},
            )
            resp.raise_for_status()
            vectors.append(resp.json()["embedding"])
    return vectors


async def _openai_embed(texts: list[str], api_key: str, model: str) -> list[list[float]]:
    async with httpx.AsyncClient(timeout=120.0) as client:
        resp = await client.post(
            "https://api.openai.com/v1/embeddings",
            headers={"Authorization": f"Bearer {api_key}"},
            json={"model": model, "input": texts},
        )
        resp.raise_for_status()
        data = resp.json()["data"]
        return [item["embedding"] for item in sorted(data, key=lambda x: x["index"])]
