from backend.storage.sqlite import (
    SCHEMA_VERSION,
    SQLiteRepository,
    create_sqlite_engine,
    get_schema_version,
    initialize_database,
)

EXPECTED_TABLES = {
    "users",
    "sessions",
    "model_profiles",
    "projects",
    "runs",
    "uploads",
    "artifacts",
    "citations",
}


def test_initialize_database_creates_contract_tables(tmp_path):
    db_path = tmp_path / "data" / "app.sqlite"
    engine = create_sqlite_engine(db_path)

    initialize_database(engine)

    assert db_path.exists()
    assert get_schema_version(engine) == SCHEMA_VERSION
    with engine.connect() as connection:
        table_names = set(
            connection.exec_driver_sql(
                "select name from sqlite_master where type = 'table'"
            ).scalars()
        )
    assert EXPECTED_TABLES.issubset(table_names)


def test_repository_inserts_and_reads_representative_metadata(tmp_path):
    repo = SQLiteRepository.from_path(tmp_path / "app.sqlite")

    user = repo.create_user(
        id="user-1",
        email="teacher@cuhk.edu.hk",
        role="teacher",
        password_hash="hash:local",
    )
    session = repo.create_session(
        id="session-1",
        user_id=user["id"],
        token_hash="sha256:token",
    )
    profile = repo.create_model_profile(
        id="profile-1",
        user_id=user["id"],
        display_name="Qwen local profile",
        provider="openai_compatible",
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
        model="qwen-placeholder",
        api_key_ref="env:MODEL_API_KEY",
        context_window_hint=128000,
        supports_streaming=True,
        is_default=True,
    )
    project = repo.create_project(
        id="project-1",
        user_id=user["id"],
        title="CS homework",
        root_path="workspace/project-1",
    )
    run = repo.create_run(
        id="run-1",
        project_id=project["id"],
        user_id=user["id"],
        model_profile_id=profile["id"],
        intent="code_homework",
        task_text="Solve the assignment.",
        search_mode="auto",
        status="queued",
        output_root="workspace/project-1/run-1",
    )
    upload = repo.create_upload(
        id="upload-1",
        run_id=run["id"],
        original_name="brief.pdf",
        media_type="application/pdf",
        stored_path="workspace/uploads/brief.pdf",
        sha256="0" * 64,
        size_bytes=128,
    )
    artifact = repo.create_artifact(
        id="artifact-1",
        run_id=run["id"],
        kind="manifest",
        path="workspace/project-1/run-1/manifest.json",
        media_type="application/json",
    )
    citation = repo.create_citation(
        id="citation-1",
        run_id=run["id"],
        title="Reference",
        url="https://example.edu/reference",
        snippet="Short source note.",
    )

    assert repo.get_user(user["id"])["email"] == "teacher@cuhk.edu.hk"
    assert repo.get_user_by_email("teacher@cuhk.edu.hk")["id"] == user["id"]
    assert repo.get_session(session["id"])["token_hash"] == "sha256:token"
    assert repo.get_model_profile(profile["id"])["api_key_ref"] == "env:MODEL_API_KEY"
    assert repo.get_project(project["id"])["root_path"] == "workspace/project-1"
    assert repo.get_run(run["id"])["status"] == "queued"
    assert repo.get_upload(upload["id"])["stored_path"] == "workspace/uploads/brief.pdf"
    assert repo.get_artifact(artifact["id"])["kind"] == "manifest"
    assert repo.get_citation(citation["id"])["url"] == "https://example.edu/reference"
    assert repo.list_citations_for_run(run["id"])[0]["id"] == citation["id"]
