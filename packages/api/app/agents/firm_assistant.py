from pydantic_ai import Agent

from app.llm import get_chat_model

SYSTEM_PROMPT = """You are LegisFlow's firm AI assistant for law firms.
Answer questions using the provided document context when available.
Be professional, precise, and concise. Cite document excerpts when relevant.
If context is insufficient, say so clearly. Never invent case facts or legal outcomes."""

firm_assistant_agent = Agent(
    get_chat_model(),
    system_prompt=SYSTEM_PROMPT,
)


async def run_firm_assistant(user_message: str, context_blocks: list[str]) -> str:
    context = "\n\n---\n\n".join(context_blocks) if context_blocks else "No firm documents indexed yet."
    prompt = f"""Context from firm knowledge base:
{context}

User question: {user_message}

Respond with clear legal-operations guidance. Reference context where applicable."""
    result = await firm_assistant_agent.run(prompt)
    if hasattr(result, "data"):
        return str(result.data)
    if hasattr(result, "output"):
        return str(result.output)
    return str(result)
