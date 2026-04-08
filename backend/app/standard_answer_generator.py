import logging
from typing import Optional
from uuid import uuid4

from openai import OpenAI

from backend.app.iterative_generation import (
    AssignmentOrchestrator,
    InMemoryTelemetrySink,
    LangChainContextAdapter,
    NativeAPIContextAdapter,
    OpenAIChatGateway,
    OrchestratorConfig,
    PromptSections,
    SectionPromptCompiler,
    SimpleTokenEstimator,
)
from backend.app.latex_renderer import render_beamer_template
from backend.app.web_search import perform_web_search
from backend.core.config import (
    BIANXIE_API_KEY,
    BIANXIE_ENDPOINT,
    CONTEXT_ADAPTER,
    CONTEXT_WINDOW_LIMIT,
    ITERATION_TURNS,
    MODEL_NAME,
    TARGET_OUTPUT_TOKENS,
)

logger = logging.getLogger(__name__)
client = OpenAI(api_key=BIANXIE_API_KEY, base_url=BIANXIE_ENDPOINT)


def _build_context_bundle(assignment_title: str, custom_context: Optional[str], use_search: bool) -> str:
    chunks = []
    if use_search:
        search_results = perform_web_search(f"{assignment_title} solution")
        if search_results:
            lines = ["Web Search Context:"]
            for res in search_results:
                lines.append(f"- {res['title']}: {res['body']}")
            chunks.append("\n".join(lines))
    if custom_context:
        chunks.append(f"Additional Teacher Instructions/Context:\n{custom_context.strip()}")
    return "\n\n".join(chunks) if chunks else "No extra context provided."


def _technical_description_for(output_format: str, adapter_name: str) -> str:
    shared = (
        f"Current stack adapter: {adapter_name}. "
        "Respect modular prompt sections and keep output deterministic for iterative refinement."
    )
    if output_format == "pdf":
        return (
            f"{shared}\nGenerate LaTeX Beamer frame content only.\n"
            "Do not include \\begin{document}/\\end{document} or any preamble.\n"
            "Escape special characters and keep output valid for template rendering."
        )
    return (
        f"{shared}\nGenerate markdown standard answer content.\n"
        "Do not wrap output in fenced code blocks."
    )


def _output_contract_for(output_format: str) -> str:
    if output_format == "pdf":
        return (
            "Output contract:\n"
            "- Raw LaTeX frame content only.\n"
            "- No markdown fences.\n"
            "- Structured sections and concise pedagogical flow."
        )
    return (
        "Output contract:\n"
        "- Markdown only.\n"
        "- No markdown fences.\n"
        "- Include clear structure and concise explanations."
    )


def _select_context_adapter():
    if CONTEXT_ADAPTER == "native":
        return NativeAPIContextAdapter()
    return LangChainContextAdapter()


def generate_answer_logic(
    assignment_title,
    instructions,
    custom_context=None,
    use_search=True,
    output_format="md",
    turns=None,
    return_details=False,
):
    session_id = str(uuid4())
    turns = turns or ITERATION_TURNS
    context_bundle = _build_context_bundle(assignment_title, custom_context, use_search)

    prompt_sections = PromptSections(
        task_definition=(
            f"Assignment: {assignment_title}\n"
            f"Instructions: {instructions}\n"
            "Goal: produce a high-quality solution suitable for teaching use."
        ),
        technical_description=_technical_description_for(output_format, CONTEXT_ADAPTER),
        iteration_state="Initial iterative generation state.",
        quality_bar=(
            "Quality bar:\n"
            "- Accurate and complete reasoning\n"
            "- Handle edge cases where relevant\n"
            "- Keep explanations concise and readable"
        ),
        output_contract=_output_contract_for(output_format),
        context_bundle=context_bundle,
    )

    telemetry = InMemoryTelemetrySink()
    orchestrator = AssignmentOrchestrator(
        context_manager=_select_context_adapter(),
        prompt_compiler=SectionPromptCompiler(),
        model_gateway=OpenAIChatGateway(client),
        token_estimator=SimpleTokenEstimator(context_window_limit=CONTEXT_WINDOW_LIMIT),
        telemetry_sink=telemetry,
        config=OrchestratorConfig(turns=turns, target_output_tokens=TARGET_OUTPUT_TOKENS),
    )

    try:
        logger.info("Calling BianxieAPI model=%s turns=%s session=%s", MODEL_NAME, turns, session_id)
        result = orchestrator.run(session_id=session_id, seed_sections=prompt_sections)
        logger.info(
            "Iterative generation completed turns=%s telemetry_events=%s",
            len(result.turn_outputs),
            len(result.telemetry_events),
        )
        if return_details:
            latest_context_window_estimate = None
            for event in reversed(result.telemetry_events):
                if event.get("event_name") == "context_window_estimate":
                    latest_context_window_estimate = event.get("payload")
                    break
            return {
                "final_output": result.final_output,
                "turn_outputs": result.turn_outputs,
                "telemetry_events": result.telemetry_events,
                "context_window_estimate": latest_context_window_estimate,
            }
        return result.final_output
    except Exception as exc:
        logger.exception("BianxieAPI iterative call failed: %s", exc)
        return f"Error generating answer: {str(exc)}"

def convert_to_format(content, fmt):
    if fmt == "md":
        return content
    elif fmt == "txt":
        return content # Simple pass through
    elif fmt == "py":
        # Extract code blocks
        import re
        code_blocks = re.findall(r'```python(.*?)```', content, re.DOTALL)
        return "\n\n".join(code_blocks) if code_blocks else "# No python code found in solution"
    elif fmt == "ipynb":
        import nbformat
        nb = nbformat.v4.new_notebook()
        nb.cells.append(nbformat.v4.new_markdown_cell(content))
        return nbformat.writes(nb)
    elif fmt == "pdf":
        # Render using Beamer Template
        return render_beamer_template(content)
    return content
