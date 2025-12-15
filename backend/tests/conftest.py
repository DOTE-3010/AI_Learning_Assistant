import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app
from backend.models.postgres import Base as ModelBase, User, Course, Assignment, GenerationJob, AuditEvent
from backend.app.database import Base, get_db

from sqlalchemy.pool import StaticPool

# Use in-memory SQLite for testing to isolate from production DB
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool # Ensure data persists across multiple connections in memory
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """Create a new database session for a test function and rollback after."""
    # Ensure all models are explicitly imported so they are registered with Base.metadata
    ModelBase.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        ModelBase.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    """Override the get_db dependency to use the test database session."""
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    # Also patch get_db for direct calls (like in background tasks)
    from unittest.mock import patch
    with patch("backend.main.get_db", side_effect=override_get_db), \
         patch("backend.app.database.get_db", side_effect=override_get_db), \
         TestClient(app) as c:
        yield c

