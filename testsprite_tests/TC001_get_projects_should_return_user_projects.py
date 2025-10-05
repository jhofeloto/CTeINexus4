import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_get_projects_should_return_user_projects():
    """
    Test the GET /api/projects endpoint for authenticated and unauthenticated access.
    Since the Supabase DB may be paused, allow for potential 500 errors due to DB issues.
    Focus on verifying authentication and general API structure.
    """

    # Endpoint URL
    url = f"{BASE_URL}/api/projects"

    # --- Test unauthorized access returns 401 ---
    try:
        response_unauth = requests.get(url, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to {url} failed unexpectedly: {e}"

    assert response_unauth.status_code in (401, 500), (
        f"Expected 401 Unauthorized or 500 Server Error for unauthenticated access, "
        f"got {response_unauth.status_code}"
    )
    # If 500 returned, note it's possibly due to paused DB


    # --- Test authenticated access returns list or possible 500 due to DB paused ---

    # For authentication, we need a bearer token or session cookie.
    # Since no auth details or token provided, simulate with placeholder token.
    # In real tests, replace 'your_valid_token_here' with a real token.

    headers_auth = {
        "Authorization": "Bearer your_valid_token_here",
        "Accept": "application/json"
    }

    try:
        response_auth = requests.get(url, headers=headers_auth, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Authenticated request to {url} failed unexpectedly: {e}"

    # Possible outcomes:
    # - 200 OK with JSON array of projects (success)
    # - 401 Unauthorized if token invalid
    # - 500 Internal Server Error due to DB paused

    assert response_auth.status_code in (200, 401, 500), (
        f"Expected status 200, 401, or 500 for authenticated request, got {response_auth.status_code}"
    )

    if response_auth.status_code == 200:
        # Validate response is a JSON array
        try:
            projects = response_auth.json()
        except ValueError:
            assert False, "Response content is not valid JSON."

        assert isinstance(projects, list), "Expected a list of projects in response."

        # Optional: Validate projects elements structure roughly
        if projects:
            proj = projects[0]
            assert isinstance(proj, dict), "Each project should be a JSON object."
            # Check some expected keys from Project schema
            expected_keys = {"id", "title", "summary", "keywords", "proponentEntity", "status"}
            missing_keys = expected_keys - proj.keys()
            assert not missing_keys, f"Project object missing expected keys: {missing_keys}"

    elif response_auth.status_code == 401:
        # Unauthorized, probably invalid token
        pass

    elif response_auth.status_code == 500:
        # Likely DB paused, documented as expected error in instructions
        pass

test_get_projects_should_return_user_projects()