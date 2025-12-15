import base64

def test_create_course_flow(client):
    """
    A simple example test for students to refer to.
    """
    # 1. Setup Auth
    email = "prof@cuhk.edu.hk"
    token = base64.b64encode(email.encode('utf-8')).decode('utf-8')
    headers = {"X-User-Email": email, "X-User-Token": token}

    # 2. Call API
    resp = client.post("/courses", json={"title": "Demo 101", "term": "Spring"}, headers=headers)

    # 3. Assert
    assert resp.status_code == 200
    assert resp.json()["title"] == "Demo 101"

