import json
from pathlib import Path

from backend.core.runs import create_run, make_run_executor
from backend.pipelines.essay_latex import LatexCompileError, LatexCompileResult
from backend.storage.sqlite import SQLiteRepository


class FakeModelProvider:
    def __init__(self, output: str | list[str]):
        self.outputs = output if isinstance(output, list) else [output]
        self.requests = []

    def generate_text(self, request):
        self.requests.append(request)
        output_index = min(len(self.requests) - 1, len(self.outputs) - 1)
        return self.outputs[output_index]


class FakeLatexCompiler:
    def __init__(
        self,
        *,
        error: LatexCompileError | None = None,
        errors: list[LatexCompileError | None] | None = None,
        log_text: str = "latex compile ok\n",
    ):
        self.errors = errors if errors is not None else [error]
        self.log_text = log_text
        self.calls = []

    def compile(self, *, tex_path: Path, output_dir: Path, job_name: str):
        self.calls.append(
            {"tex_path": tex_path, "output_dir": output_dir, "job_name": job_name}
        )
        assert tex_path.exists()
        error_index = min(len(self.calls) - 1, len(self.errors) - 1)
        if self.errors[error_index]:
            raise self.errors[error_index]
        pdf_path = output_dir / f"{job_name}.pdf"
        pdf_path.write_bytes(b"%PDF-1.4\n% fake test pdf\n")
        return LatexCompileResult(pdf_path=pdf_path, log_text=self.log_text)


class NoopSearchAdapter:
    def search(self, query: str, *, max_results: int = 3):
        raise AssertionError("search should not run in these tests")


def test_essay_latex_pipeline_writes_source_and_compiled_pdf(tmp_path):
    repo, user = _repo_with_user(tmp_path)
    provider = FakeModelProvider(
        "```latex\n"
        "\\documentclass{article}\n"
        "\\begin{document}\n"
        "\\section{Answer}\n"
        "A concise essay.\n"
        "\\end{document}\n"
        "```"
    )
    compiler = FakeLatexCompiler()

    body = create_run(
        repo,
        current_user=user,
        request={
            "task_text": "Write a short essay.",
            "intent": "essay_latex",
            "search_mode": "off",
        },
        workspace_root=str(tmp_path / "workspace"),
        executor=make_run_executor(provider, latex_compiler=compiler),
        search_adapter=NoopSearchAdapter(),
    )

    assert body["status"] == "succeeded"
    output_root = Path(body["output_root"])
    assert (output_root / "output" / "main.tex").read_text(
        encoding="utf-8"
    ).startswith("\\documentclass{article}")
    assert (output_root / "output" / "main.pdf").read_bytes().startswith(b"%PDF")
    assert (output_root / "logs" / "latex.log").read_text(encoding="utf-8") == (
        "latex compile ok\n"
    )
    assert compiler.calls[0]["tex_path"] == output_root / "output" / "main.tex"
    assert "full compilable LaTeX article" in provider.requests[0].user_prompt

    manifest = json.loads((output_root / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["status"] == "succeeded"
    assert {"path": "output/main.tex", "kind": "source"} in manifest["outputs"]
    assert {"path": "output/main.pdf", "kind": "pdf"} in manifest["outputs"]

    artifact_kinds = {row["kind"] for row in repo.list_artifacts_for_run(body["id"])}
    assert {"source", "pdf", "log", "manifest"}.issubset(artifact_kinds)


def test_essay_latex_pipeline_repairs_source_after_compile_failure(tmp_path):
    repo, user = _repo_with_user(tmp_path)
    provider = FakeModelProvider(
        [
            "\\documentclass{article}\n"
            "\\begin{document}\n"
            "\\begin{tabular}{ll}\n"
            "A & B & C \\\\\n"
            "\\end{tabular}\n"
            "\\end{document}\n",
            "\\documentclass{article}\n"
            "\\begin{document}\n"
            "\\begin{tabular}{lll}\n"
            "A & B & C \\\\\n"
            "\\end{tabular}\n"
            "\\end{document}\n",
        ]
    )
    compiler = FakeLatexCompiler(
        errors=[
            LatexCompileError(
                "LaTeX PDF compilation failed.",
                log_text="./main.tex:4: Extra alignment tab has been changed to \\cr.\n",
            ),
            None,
        ],
        log_text="repaired latex compile ok\n",
    )

    body = create_run(
        repo,
        current_user=user,
        request={
            "task_text": "Write a short essay with a table.",
            "intent": "essay_latex",
            "search_mode": "off",
        },
        workspace_root=str(tmp_path / "workspace"),
        executor=make_run_executor(provider, latex_compiler=compiler),
        search_adapter=NoopSearchAdapter(),
    )

    assert body["status"] == "succeeded"
    output_root = Path(body["output_root"])
    assert "\\begin{tabular}{lll}" in (output_root / "output" / "main.tex").read_text(
        encoding="utf-8"
    )
    assert (output_root / "output" / "main.pdf").read_bytes().startswith(b"%PDF")
    latex_log = (output_root / "logs" / "latex.log").read_text(encoding="utf-8")
    assert "[initial compile failure]" in latex_log
    assert "Repair source written; repaired compile succeeded." in latex_log
    generation_log = (output_root / "logs" / "generation.log").read_text(
        encoding="utf-8"
    )
    assert "Repair: source_repaired" in generation_log
    assert len(provider.requests) == 2
    assert "[Repair Contract]" in provider.requests[1].user_prompt
    assert len(compiler.calls) == 2


def test_essay_latex_pipeline_failure_preserves_source_log_and_manifest(tmp_path):
    repo, user = _repo_with_user(tmp_path)
    provider = FakeModelProvider(
        "\\documentclass{article}\n"
        "\\begin{document}\n"
        "\\badcommand\n"
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
            "task_text": "Write a short essay with a compile error.",
            "intent": "essay_latex",
            "search_mode": "off",
        },
        workspace_root=str(tmp_path / "workspace"),
        executor=make_run_executor(provider, latex_compiler=compiler),
        search_adapter=NoopSearchAdapter(),
    )

    assert body["status"] == "failed"
    assert body["error_message"] == "compile_failed: LaTeX PDF compilation failed."
    output_root = Path(body["output_root"])
    assert (output_root / "output" / "main.tex").exists()
    assert not (output_root / "output" / "main.pdf").exists()
    latex_log = (output_root / "logs" / "latex.log").read_text(encoding="utf-8")
    assert "[initial compile failure]" in latex_log
    assert "Repair source written; repaired compile still failed." in latex_log
    assert "! Undefined control sequence." in latex_log
    assert len(provider.requests) == 2
    assert len(compiler.calls) == 2

    manifest = json.loads((output_root / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["status"] == "failed"
    assert {"path": "output/main.tex", "kind": "source"} in manifest["outputs"]
    assert {"path": "output/main.pdf", "kind": "pdf"} not in manifest["outputs"]

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
