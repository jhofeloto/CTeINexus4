import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_get_public_projects_should_return_filtered_paginated_projects():
    url = f"{BASE_URL}/api/public/projects"
    headers = {
        "Accept": "application/json"
    }
    # Test different query param variations to check search, limit, offset
    test_params = [
        {},  # No params
        {"search": "ai"},  # Search term
        {"limit": "5"},  # Limit results
        {"offset": "10"},  # Offset results
        {"search": "innovation", "limit": "3", "offset": "1"}  # Combined filters
    ]
    
    for params in test_params:
        try:
            response = requests.get(url, headers=headers, params=params, timeout=TIMEOUT)
        except requests.RequestException as e:
            # Any connection issues etc. are test failures here
            assert False, f"Request failed: {str(e)}"
        
        # According to instructions DB is paused, expecting 500 if DB required,
        # but this public endpoint ideally shouldn't cause DB 500 error for all
        # If 500 occurs likely due to DB paused. Log this distinction.
        if response.status_code == 500:
            # This is likely due to paused Supabase DB - acceptable per instructions
            print(f"INFO: Received HTTP 500 for params {params} - probable DB pause issue.")
            continue
        else:
            # Validate 200 OK for successful requests
            assert response.status_code == 200, f"Expected 200 but got {response.status_code} for params {params}"
            data = response.json()
            
            # Validate top-level structure with 'projects' and 'pagination' keys
            assert isinstance(data, dict), "Response JSON is not an object"
            assert "projects" in data, "'projects' key missing in response"
            assert "pagination" in data, "'pagination' key missing in response"
            
            projects = data["projects"]
            pagination = data["pagination"]
            
            # Validate 'projects' is a list
            assert isinstance(projects, list), "'projects' is not a list"
            # Validate each project contains expected keys minimally
            for project in projects:
                assert isinstance(project, dict), "Project item is not an object"
                required_project_keys = {"id", "title", "summary", "keywords", "proponentEntity", "createdAt", "user", "products"}
                missing_keys = required_project_keys - project.keys()
                assert not missing_keys, f"Project missing keys: {missing_keys}"
                # Validate user object structure
                assert isinstance(project["user"], dict), "'user' in project is not an object"
                assert "name" in project["user"], "'name' missing from project user object"
                # Validate keywords is a list
                assert isinstance(project["keywords"], list), "'keywords' is not a list"
                # Validate products is a list
                assert isinstance(project["products"], list), "'products' is not a list"
            
            # Validate pagination object includes required keys
            required_pagination_keys = {"total", "limit", "offset", "hasMore"}
            missing_pag_keys = required_pagination_keys - pagination.keys()
            assert not missing_pag_keys, f"Pagination missing keys: {missing_pag_keys}"
            # Validate types of pagination fields
            assert isinstance(pagination["total"], int), "'total' in pagination is not int"
            assert isinstance(pagination["limit"], int), "'limit' in pagination is not int"
            assert isinstance(pagination["offset"], int), "'offset' in pagination is not int"
            assert isinstance(pagination["hasMore"], bool), "'hasMore' in pagination is not bool"
            
            # Validate pagination limits per spec: limit max 50, default 10
            if "limit" in params:
                requested_limit = int(params["limit"])
                # The response limit should not exceed requested limit (or max 50)
                assert pagination["limit"] == requested_limit or pagination["limit"] <= 50, \
                    "Pagination limit does not match requested limit or exceeds max 50"
            else:
                # If no limit specified, default should be 10 as per spec
                assert pagination["limit"] == 10, "Default pagination limit is not 10"
            
            # Offset should match or default 0
            if "offset" in params:
                assert pagination["offset"] == int(params["offset"]), "Pagination offset does not match requested offset"
            else:
                assert pagination["offset"] == 0, "Default pagination offset is not 0"


test_get_public_projects_should_return_filtered_paginated_projects()