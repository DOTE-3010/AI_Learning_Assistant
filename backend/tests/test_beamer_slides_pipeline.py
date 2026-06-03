import json
from pathlib import Path

from backend.core.runs import create_run, make_run_executor
from backend.pipelines.essay_latex import LatexCompileError, LatexCompileResult
from backend.storage.sqlite import SQLiteRepository


class FakeModelProvider:
    def __init__(self, output: str):
        self.output = output
        self.requests = []

    def generate_text(self, request):
        self.requests.append(request)
        return self.output


class FakeLatexCompiler:
    def __init__(
        self,
        *,
        error: LatexCompileError | None = None,
        log_text: str = "beamer compile ok\n",
    ):
        self.error = error
        self.log_text = log_text
        self.calls = []

    def compile(self, *, tex_path: Path, output_dir: Path, job_name: str):
        self.calls.append(
            {"tex_path": tex_path, "output_dir": output_dir, "job_name": job_name}
        )
        assert tex_path.exists()
        if self.error:
            raise self.error
        pdf_path = output_dir / f"{job_name}.pdf"
        pdf_path.write_bytes(b"%PDF-1.4\n% fake beamer pdf\n")
        return LatexCompileResult(pdf_path=pdf_path, log_text=self.log_text)


class NoopSearchAdapter:
    def search(self, query: str, *, max_results: int = 3):
        raise AssertionError("search should not run in these tests")


def test_beamer_slides_pipeline_writes_source_and_compiled_pdf(tmp_path):
    repo, user = _repo_with_user(tmp_path)
    provider = FakeModelProvider(
        "```beamer\n"
        "\\documentclass{beamer}\n"
        "\\usetheme{Madrid}\n"
        "\\title{Sample Lecture}\n"
        "\\begin{document}\n"
        "\\begin{frame}\\titlepage\\end{frame}\n"
        "\\begin{frame}{Key Idea}A concise slide.\\end{frame}\n"
        "\\end{document}\n"
        "```"
    )
    compiler = FakeLatexCompiler()

    body = create_run(
        repo,
        current_user=user,
        request={
            "task_text": "Create a short lecture deck.",
            "intent": "beamer_slides",
            "search_mode": "off",
        },
        workspace_root=str(tmp_path / "workspace"),
        executor=make_run_executor(provider, latex_compiler=compiler),
        search_adapter=NoopSearchAdapter(),
    )

    assert body["status"] == "succeeded"
    output_root = Path(body["output_root"])
    assert (output_root / "output" / "slides.tex").read_text(
        encoding="utf-8"
    ).startswith("\\documentclass{beamer}")
    assert (output_root / "output" / "slides.pdf").read_bytes().startswith(b"%PDF")
    assert (output_root / "logs" / "latex.log").read_text(encoding="utf-8") == (
        "beamer compile ok\n"
    )
    assert compiler.calls[0]["tex_path"] == output_root / "output" / "slides.tex"
    assert compiler.calls[0]["job_name"] == "slides"
    assert "full compilable LaTeX Beamer" in provider.requests[0].user_prompt

    manifest = json.loads((output_root / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["intent"] == "beamer_slides"
    assert manifest["status"] == "succeeded"
    assert {"path": "output/slides.tex", "kind": "source"} in manifest["outputs"]
    assert {"path": "output/slides.pdf", "kind": "pdf"} in manifest["outputs"]

    artifact_kinds = {row["kind"] for row in repo.list_artifacts_for_run(body["id"])}
    assert {"source", "pdf", "log", "manifest"}.issubset(artifact_kinds)


def test_beamer_slides_pipeline_failure_preserves_source_log_and_manifest(tmp_path):
    repo, user = _repo_with_user(tmp_path)
    provider = FakeModelProvider(
        "\\documentclass{beamer}\n"
        "\\begin{document}\n"
        "\\begin{frame}{Broken}\\badcommand\\end{frame}\n"
        "\\end{document}\n"
    )
    compiler = FakeLatexCompiler(
        error=LatexCompileError(
            "LaTeX PDF compilation failed.",
            log_text="! Undefined control sequence.\n",
        )
    )

    body = create_run(
        repo,
        current_user=user,
        request={
            "task_text": "Create a deck with a compile error.",
            "intent": "beamer_slides",
            "search_mode": "off",
        },
        workspace_root=str(tmp_path / "workspace"),
        executor=make_run_executor(provider, latex_compiler=compiler),
        search_adapter=NoopSearchAdapter(),
    )

    assert body["status"] == "failed"
    assert body["error_message"] == "compile_failed: LaTeX PDF compilation failed."
    output_root = Path(body["output_root"])
    assert (output_root / "output" / "slides.tex").exists()
    assert not (output_root / "output" / "slides.pdf").exists()
    latex_log = (output_root / "logs" / "latex.log").read_text(encoding="utf-8")
    assert "[initial compile failure]" in latex_log
    assert "Repair source written; repaired compile still failed." in latex_log
    assert "! Undefined control sequence." in latex_log
    assert len(provider.requests) == 2
    assert len(compiler.calls) == 2

    manifest = json.loads((output_root / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["intent"] == "beamer_slides"
    assert manifest["status"] == "failed"
    assert {"path": "output/slides.tex", "kind": "source"} in manifest["outputs"]
    assert {"path": "output/slides.pdf", "kind": "pdf"} not in manifest["outputs"]

    generation_log = (output_root / "logs" / "generation.log").read_text(
        encoding="utf-8"
    )
    assert "compile_failed" in generation_log
    assert "Traceback" not in generation_log


def _repo_with_user(tmp_path):
    repo = SQLiteRepository.from_path(tmp_path / "app.sqlite")
    user = repo.create_user(
        id="user-1",
        email="teacher@cuhk.edu.hk",
        role="teacher",
        password_hash="hash",
    )
    return repo, user
