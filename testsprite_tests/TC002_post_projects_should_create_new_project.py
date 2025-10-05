import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def post_projects_should_create_new_project():
    headers_auth = {
        # No specific auth token provided; assuming endpoints require auth token here.
        # For this test, token is omitted to test unauthorized access.
        'Content-Type': 'application/json'
    }
    headers_with_auth = {
        # Placeholder for auth header, e.g., 'Authorization': 'Bearer <token>'
        # Since no token or auth instructions provided, leaving this empty to mimic unauthorized.
        'Content-Type': 'application/json'
    }

    url = f"{BASE_URL}/api/projects"

    valid_project_data = {
        "title": "Proyecto Test Valid",
        "summary": "Resumen válido para prueba",
        "keywords": ["CTeI", "test", "python"],
        "proponentEntity": "Entidad Test",
        "startDate": "2024-01-01",
        "endDate": "2024-12-31",
        "budget": 10000,
        "isPublic": True
    }

    invalid_project_data = {
        # Missing required 'title' and 'keywords' empty to trigger 400
        "summary": "",
        "keywords": [],
        "proponentEntity": ""
    }

    # Test 1: Unauthorized access returns 401
    try:
        response_unauth = requests.post(url, json=valid_project_data, headers={'Content-Type': 'application/json'}, timeout=TIMEOUT)
    except requests.RequestException as e:
        raise AssertionError(f"Request failed unexpectedly: {e}")
    assert response_unauth.status_code == 401, f"Expected 401 Unauthorized, got {response_unauth.status_code}"

    # Since we cannot authenticate (no credentials/token provided), we cannot test with valid auth.
    # Following instructions: focus on structure, authentication, and aspects not dependent on DB.
    # But we do test invalid data with no auth: expect 401 rather than 400 due DB paused?

    # Test 2: Invalid data without auth returns 401 (due to no authentication)
    try:
        response_invalid_unauth = requests.post(url, json=invalid_project_data, headers={'Content-Type': 'application/json'}, timeout=TIMEOUT)
    except requests.RequestException as e:
        raise AssertionError(f"Request failed unexpectedly: {e}")
    assert response_invalid_unauth.status_code == 401, f"Expected 401 Unauthorized on invalid data w/o auth, got {response_invalid_unauth.status_code}"

    # We cannot perform authorized tests due to lack of authentication token.
    # According to instructions, expect 500 if DB is paused when calling with auth (not tested here).

post_projects_should_create_new_project()
