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
        log_text: str = "cheat-sheet compile ok\n",
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
        pdf_path.write_bytes(b"%PDF-1.4\n% fake cheat sheet pdf\n")
        return LatexCompileResult(pdf_path=pdf_path, log_text=self.log_text)


class NoopSearchAdapter:
    def search(self, query: str, *, max_results: int = 3):
        raise AssertionError("search should not run in these tests")


def test_cheat_sheet_pipeline_accepts_multiple_pdfs_and_compiles_pdf(tmp_path):
    repo, user = _repo_with_user(tmp_path)
    lecture_one = tmp_path / "lecture-01.pdf"
    lecture_two = tmp_path / "lecture-02.pdf"
    _write_text_pdf(lecture_one, "Lecture one covers gradient descent.")
    _write_text_pdf(lecture_two, "Lecture two covers dynamic programming.")
    _create_pdf_upload(repo, "upload-1", lecture_one)
    _create_pdf_upload(repo, "upload-2", lecture_two)

    provider = FakeModelProvider(
        "```latex\n"
        "\\documentclass[a4paper]{article}\n"
        "\\usepackage[margin=0.35in]{geometry}\n"
        "\\usepackage{multicol}\n"
        "\\begin{document}\n"
        "\\begin{multicols}{3}\n"
        "\\section*{Optimization}Gradient descent.\n"
        "\\section*{DP}Dynamic programming.\n"
        "\\end{multicols}\n"
        "\\end{document}\n"
        "```"
    )
    compiler = FakeLatexCompiler()

    body = create_run(
        repo,
        current_user=user,
        request={
            "task_text": "Compress these lecture slides into a dense study sheet.",
            "intent": "cheat_sheet",
            "search_mode": "off",
            "upload_ids": ["upload-1", "upload-2"],
            "options": {"target_pages": 2, "paper_size": "A4", "density": "dense"},
        },
        workspace_root=str(tmp_path / "workspace"),
        executor=make_run_executor(provider, latex_compiler=compiler),
        search_adapter=NoopSearchAdapter(),
    )

    assert body["status"] == "succeeded"
    output_root = Path(body["output_root"])
    assert (output_root / "output" / "cheat-sheet.tex").read_text(
        encoding="utf-8"
    ).startswith("\\documentclass[a4paper]{article}")
    assert (output_root / "output" / "cheat-sheet.pdf").read_bytes().startswith(b"%PDF")
    assert (output_root / "logs" / "latex.log").read_text(encoding="utf-8") == (
        "cheat-sheet compile ok\n"
    )
    assert compiler.calls[0]["tex_path"] == output_root / "output" / "cheat-sheet.tex"
    assert compiler.calls[0]["job_name"] == "cheat-sheet"

    user_prompt = provider.requests[0].user_prompt
    assert "Lecture one covers gradient descent." in user_prompt
    assert "Lecture two covers dynamic programming." in user_prompt
    assert "targeting exactly 2 A4 page(s)" in user_prompt

    extraction_log = (output_root / "logs" / "extraction.log").read_text(
        encoding="utf-8"
    )
    assert "Upload count: 2" in extraction_log
    assert "lecture-01.pdf" in extraction_log
    assert "lecture-02.pdf" in extraction_log
    assert "Notes: none" in extraction_log

    manifest = json.loads((output_root / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["intent"] == "cheat_sheet"
    assert manifest["status"] == "succeeded"
    assert {"path": "output/cheat-sheet.tex", "kind": "source"} in manifest["outputs"]
    assert {"path": "output/cheat-sheet.pdf", "kind": "pdf"} in manifest["outputs"]

    artifact_kinds = {row["kind"] for row in repo.list_artifacts_for_run(body["id"])}
    assert {"source", "pdf", "log", "manifest"}.issubset(artifact_kinds)


def test_cheat_sheet_pipeline_failure_preserves_source_log_and_manifest(tmp_path):
    repo, user = _repo_with_user(tmp_path)
    blank_pdf = tmp_path / "image-only-slides.pdf"
    _write_blank_pdf(blank_pdf)
    _create_pdf_upload(repo, "upload-blank", blank_pdf)
    provider = FakeModelProvider(
        "\\documentclass[a4paper]{article}\n"
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
            "task_text": "Make a one-page cheat sheet.",
            "intent": "cheat_sheet",
            "search_mode": "off",
            "upload_ids": ["upload-blank"],
            "options": {"target_pages": 1},
        },
        workspace_root=str(tmp_path / "workspace"),
        executor=make_run_executor(provider, latex_compiler=compiler),
        search_adapter=NoopSearchAdapter(),
    )

    assert body["status"] == "failed"
    assert body["error_message"] == "compile_failed: LaTeX PDF compilation failed."
    output_root = Path(body["output_root"])
    assert (output_root / "output" / "cheat-sheet.tex").exists()
    assert not (output_root / "output" / "cheat-sheet.pdf").exists()
    assert (output_root / "logs" / "latex.log").read_text(encoding="utf-8") == (
        "! Undefined control sequence.\n"
    )
    assert "PDF contained no extractable text." in (
        output_root / "logs" / "extraction.log"
    ).read_text(encoding="utf-8")

    manifest = json.loads((output_root / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["intent"] == "cheat_sheet"
    assert manifest["status"] == "failed"
    assert {"path": "output/cheat-sheet.tex", "kind": "source"} in manifest["outputs"]
    assert {"path": "output/cheat-sheet.pdf", "kind": "pdf"} not in manifest["outputs"]

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


def _create_pdf_upload(repo: SQLiteRepository, upload_id: str, path: Path) -> None:
    repo.create_upload(
        id=upload_id,
        original_name=path.name,
        media_type="application/pdf",
        stored_path=str(path),
        sha256=upload_id.rjust(64, "0")[-64:],
        size_bytes=path.stat().st_size,
    )


def _write_blank_pdf(path: Path) -> None:
    from pypdf import PdfWriter

    writer = PdfWriter()
    writer.add_blank_page(width=72, height=72)
    with path.open("wb") as file:
        writer.write(file)


def _write_text_pdf(path: Path, text: str) -> None:
    content = f"BT /F1 18 Tf 72 720 Td ({_pdf_literal(text)}) Tj ET".encode(
        "latin-1"
    )
    objects = [
        b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
        b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
        (
            b"3 0 obj\n"
            b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
            b"/Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\n"
            b"endobj\n"
        ),
        b"4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
        (
            b"5 0 obj\n<< /Length "
            + str(len(content)).encode("ascii")
            + b" >>\nstream\n"
            + content
            + b"\nendstream\nendobj\n"
        ),
    ]

    pdf = b"%PDF-1.4\n"
    offsets = []
    for object_bytes in objects:
        offsets.append(len(pdf))
        pdf += object_bytes

    xref_start = len(pdf)
    pdf += f"xref\n0 {len(objects) + 1}\n".encode("ascii")
    pdf += b"0000000000 65535 f \n"
    for offset in offsets:
        pdf += f"{offset:010d} 00000 n \n".encode("ascii")
    pdf += (
        f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
        f"startxref\n{xref_start}\n%%EOF\n"
    ).encode("ascii")
    path.write_bytes(pdf)


def _pdf_literal(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
