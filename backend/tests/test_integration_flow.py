import base64
from fastapi.testclient import TestClient
from backend.models.postgres import GenerationJob
from backend.app.database import get_assignment

class TestIntegrationFlow:
    """
    Integration tests for the full API flow.
    Focus: Endpoint connectivity, Authentication, Database persistence.
    """

    def test_full_assignment_flow(self, client, db_session):
        """
        Scenario: A teacher logs in, creates a course, creates an assignment, and requests generation.
        Expected: All steps return 200 OK and data is persisted.
        """
        # 1. Simulate Auth Headers (Teacher)
        email = "prof@cuhk.edu.hk"
        token = base64.b64encode(email.encode('utf-8')).decode('utf-8')
        headers = {
            "X-User-Email": email,
            "X-User-Token": token
        }

        # 2. Create Course
        course_data = {"title": "CS 101", "term": "Fall 2024"}
        resp = client.post("/courses", json=course_data, headers=headers)
        assert resp.status_code == 200
        course_id = resp.json()["id"]

        # 3. Create Assignment
        assignment_data = {
            "course_id": course_id,
            "title": "Midterm",
            "instructions": "Solve all problems.",
            "due_at": "2024-12-31T23:59:59"
        }
        resp = client.post("/assignments", json=assignment_data, headers=headers)
        assert resp.status_code == 200
        assignment_id = resp.json()["id"]

        # Verify Assignment in DB
        assignment = get_assignment(db_session, assignment_id)
        assert assignment.title == "Midterm"

        # 4. Trigger Answer Generation
        gen_data = {
            "assignment_id": assignment_id,
            "output_format": "md"
        }
        resp = client.post("/generate-answer", data=gen_data, headers=headers)
        
        assert resp.status_code == 200
        assert resp.json()["status"] == "queued"

    def test_unauthorized_access(self, client):
        """
        Scenario: A user tries to access a protected endpoint without credentials.
        Expected: 401 Unauthorized or 403 Forbidden.
        """
        # Try to create a course without headers
        resp = client.post("/courses", json={"title": "Hacker 101", "term": "Now"})
        
        # Expecting failure (400 because header is missing in our middleware implementation, or 401/403)
        # Middleware returns 400 for missing header, 401 for missing token, 403 for invalid token
        assert resp.status_code in [400, 401, 403]

    def test_student_cannot_create_course(self, client):
        """
        Scenario: A student tries to create a course.
        Expected: 403 Forbidden.
        """
        email = "student@link.cuhk.edu.hk"
        token = base64.b64encode(email.encode('utf-8')).decode('utf-8')
        headers = {
            "X-User-Email": email,
            "X-User-Token": token
        }

        resp = client.post("/courses", json={"title": "Hacker 101", "term": "Now"}, headers=headers)
        assert resp.status_code == 403

