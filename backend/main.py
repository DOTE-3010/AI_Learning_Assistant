import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from backend.api.auth import auth_error_handler, router as auth_router
from backend.api.runs import router as runs_router, run_error_handler
from backend.api.settings import router as settings_router, settings_error_handler
from backend.api.uploads import router as uploads_router, upload_error_handler
from backend.core.config import validate_config
from backend.core.model_settings import SettingsError
from backend.core.runs import RunError
from backend.core.uploads import UploadError
from backend.core.weak_auth import AuthError
from backend.storage.sqlite import SQLiteRepository

app = FastAPI(title="AI Learning Assistant Backend")
app.add_exception_handler(AuthError, auth_error_handler)
app.add_exception_handler(RunError, run_error_handler)
app.add_exception_handler(SettingsError, settings_error_handler)
app.add_exception_handler(UploadError, upload_error_handler)
app.include_router(auth_router)
app.include_router(runs_router)
app.include_router(settings_router)
app.include_router(uploads_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

static_path = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_path):
    os.makedirs(static_path)
app.mount("/ui", StaticFiles(directory=static_path, html=True), name="ui")


@app.get("/")
def root():
    return RedirectResponse(url="/ui")


@app.on_event("startup")
async def startup_event():
    # Check if we are in testing mode
    if os.getenv("TESTING"):
        return

    validate_config()
    SQLiteRepository.from_path()
    print("SQLite metadata store is ready.")


@app.get("/health")
def health_check():
    return {"status": "ok"}
