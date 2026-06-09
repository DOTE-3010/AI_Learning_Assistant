from pathlib import Path

import pytest

from backend.core.runs import create_run, make_run_executor
from backend.pipelines.essay_latex import LatexCompileResult, repair_latex_source
from backend.pipelines.latex_diagrams import sanitize_latex_diagram_placeholders
from backend.storage.sqlite import SQLiteRepository


class FakeModelProvider:
    def __init__(self, output: str):
        self.output = output
        self.requests = []

    def generate_text(self, request):
        self.requests.append(request)
        return self.output


class InspectingLatexCompiler:
    def __init__(self):
        self.sources = []

    def compile(self, *, tex_path: Path, output_dir: Path, job_name: str):
        self.sources.append(tex_path.read_text(encoding="utf-8"))
        pdf_path = output_dir / f"{job_name}.pdf"
        pdf_path.write_bytes(b"%PDF-1.4\n% fake test pdf\n")
        return LatexCompileResult(pdf_path=pdf_path, log_text="compile ok\n")


class NoopSearchAdapter:
    def search(self, query: str, *, max_results: int = 3):
        raise AssertionError("search should not run in these tests")


@pytest.mark.parametrize(
    ("intent", "filename", "options", "document_class"),
    [
        ("essay_latex", "main.tex", {}, "article"),
        ("beamer_slides", "slides.tex", {}, "beamer"),
        (
            "cheat_sheet",
            "cheat-sheet.tex",
            {"target_pages": 1},
            "article",
        ),
    ],
)
def test_latex_pipelines_replace_complex_diagram_placeholders_before_compile(
    tmp_path,
    intent,
    filename,
    options,
    document_class,
):
    repo, user = _repo_with_user(tmp_path)
    provider = FakeModelProvider(
        f"\\documentclass{{{document_class}}}\n"
        "\\begin{document}\n"
        "A transformer maps an input sequence to an output sequence.\n"
        "[Diagram: Transformer Encoder-Decoder Architecture]\n"
        "\\end{document}\n"
    )
    compiler = InspectingLatexCompiler()

    body = create_run(
        repo,
        current_user=user,
        request={
            "task_text": "Explain a transformer encoder-decoder architecture.",
            "intent": intent,
            "search_mode": "off",
            "options": options,
        },
        workspace_root=str(tmp_path / intent),
        executor=make_run_executor(provider, latex_compiler=compiler),
        search_adapter=NoopSearchAdapter(),
    )

    assert body["status"] == "succeeded"
    source = (Path(body["output_root"]) / "output" / filename).read_text(
        encoding="utf-8"
    )
    assert "[Diagram:" not in source
    assert "Transformer Encoder-Decoder Architecture" not in source
    assert "key relationships are described" in source
    assert compiler.sources == [source]
    assert "Do not emit visible diagram placeholders" in provider.requests[0].user_prompt
    assert "transformer encoder-decoder" in provider.requests[0].user_prompt


def test_diagram_sanitizer_preserves_references_and_complete_tikz():
    source = (
        "\\documentclass{article}\n"
        "\\usepackage{tikz}\n"
        "\\begin{document}\n"
        "As shown in [Figure 1], the simple flow is complete.\n"
        "\\begin{tikzpicture}\n"
        "\\node (a) {Input};\n"
        "\\node[right of=a] (b) {Output};\n"
        "\\draw[->] (a) -- (b);\n"
        "\\end{tikzpicture}\n"
        "\\end{document}\n"
    )

    assert sanitize_latex_diagram_placeholders(source) == source


def test_latex_repair_sanitizes_reintroduced_diagram_placeholder(tmp_path):
    tex_path = tmp_path / "main.tex"
    tex_path.write_text(
        "\\documentclass{article}\n"
        "\\begin{document}\n"
        "\\badcommand\n"
        "\\end{document}\n",
        encoding="utf-8",
    )
    provider = FakeModelProvider(
        "\\documentclass{article}\n"
        "\\begin{document}\n"
        "[Diagram: Transformer Encoder-Decoder Architecture]\n"
        "\\end{document}\n"
    )

    repaired = repair_latex_source(
        tex_path=tex_path,
        compile_log="! Undefined control sequence.",
        document_kind="essay_latex article",
        model_profile={"model": "test-model"},
        model_provider=provider,
        max_output_tokens=2000,
        accepted_languages={"latex", "tex"},
    )

    assert "[Diagram:" not in repaired
    assert "key relationships are described" in repaired
    assert "Do not emit visible diagram placeholders" in provider.requests[0].user_prompt


@pytest.mark.parametrize(
    "placeholder",
    [
        "[Diagram: attention flow]",
        "[Insert figure here]",
        "[TODO: diagram of the pipeline]",
        "[Placeholder: schematic showing the architecture]",
    ],
)
def test_diagram_sanitizer_handles_explicit_placeholder_variants(placeholder):
    sanitized = sanitize_latex_diagram_placeholders(
        "\\begin{document}\n" + placeholder + "\n\\end{document}\n"
    )

    assert placeholder not in sanitized
    assert "key relationships are described" in sanitized


def _repo_with_user(tmp_path):
    repo = SQLiteRepository.from_path(tmp_path / "app.sqlite")
    user = repo.create_user(
        id="user-1",
        email="teacher@cuhk.edu.hk",
        role="teacher",
        password_hash="hash",
    )
    return repo, user
