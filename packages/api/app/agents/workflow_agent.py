from pydantic_ai import Agent

from app.llm import get_chat_model

workflow_agent = Agent(
    get_chat_model(),
    system_prompt="You execute legal automation workflow steps. Output structured, actionable summaries.",
)


async def run_workflow_step(workflow_name: str, step_name: str, payload: dict, context: str) -> str:
    prompt = f"""Workflow: {workflow_name}
Step: {step_name}
Input: {payload}
Context: {context}

Produce a concise step output for the firm's automation run log."""
    result = await workflow_agent.run(prompt)
    if hasattr(result, "data"):
        return str(result.data)
    if hasattr(result, "output"):
        return str(result.output)
    return str(result)
