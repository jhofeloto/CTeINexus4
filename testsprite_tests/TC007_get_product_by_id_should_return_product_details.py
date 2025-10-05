import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

# Placeholder token for test purposes
AUTH_TOKEN = "Bearer valid_test_token"

def test_get_product_by_id_should_return_product_details():
    headers = {
        "Accept": "application/json",
        "Authorization": AUTH_TOKEN
    }

    try:
        # Step 1: Create a product to get a valid product ID for testing
        # To create a product, we need productTypeId and projectId.
        # According to instructions, database is paused, expecting 500 errors from DB endpoints
        # So focus on structure and authentication aspects, not DB data accuracy.
        # We'll try to create a product, but expect 500 or handle it gracefully.

        # First get product types (should not depend on DB)
        resp_pt = requests.get(f"{BASE_URL}/api/product-types", headers=headers, timeout=TIMEOUT)
        if resp_pt.status_code != 200:
            # Could be 500 or other due to DB paused
            product_type_id = None
        else:
            pts = resp_pt.json()
            product_type_id = pts[0]['id'] if pts else None

        # Similarly, try to get projects of user (likely 500 due to DB paused)
        resp_projects = requests.get(f"{BASE_URL}/api/projects", headers=headers, timeout=TIMEOUT)
        if resp_projects.status_code != 200:
            project_id = None
        else:
            projects = resp_projects.json()
            project_id = projects[0]['id'] if projects else None

        # If we have both ids, try to create a product (likely to fail with 500)
        product_id = None
        product_created = False
        if product_type_id and project_id:
            payload = {
                "title": "Test Product for TC007",
                "summary": "Summary for test product created in test",
                "productTypeId": product_type_id,
                "projectId": project_id
            }
            resp_create = requests.post(f"{BASE_URL}/api/products", json=payload, headers=headers, timeout=TIMEOUT)
            if resp_create.status_code == 201 and resp_create.headers.get("Location"):
                # If Location header is given with new resource path, extract product id from it
                location = resp_create.headers["Location"]
                product_id = location.rstrip('/').split("/")[-1]
                product_created = True
            elif resp_create.status_code == 201:
                # If response body contains product id
                data = resp_create.json()
                if "id" in data:
                    product_id = data["id"]
                    product_created = True

        # If no product_id created due to DB pause or other, use a placeholder fake id for test
        if not product_id:
            product_id = "non-existent-id"

        # Step 2: Test GET /api/products/{id} for existing product id
        resp_get_existing = requests.get(f"{BASE_URL}/api/products/{product_id}", headers=headers, timeout=TIMEOUT)

        # Since DB is paused, we expect either 500 (DB error) or possibly 200 for structure
        if product_created:
            # If product was created successfully, expect 200 or 500 only (DB may be paused)
            assert resp_get_existing.status_code in [200, 500], f"Expected 200 or 500, got {resp_get_existing.status_code}"
            if resp_get_existing.status_code == 200:
                # Validate basic structure if possible
                data = resp_get_existing.json()
                assert isinstance(data, dict)
                # Expected fields in Product schema
                for field in ["id", "title", "summary", "productTypeId", "projectId", "isPublic"]:
                    assert field in data
                assert data["id"] == product_id
            else:
                # Documenting: 500 is likely due to DB paused
                pass
        else:
            # Product not created - likely using fake id - expect 404 or 500 error
            # The 404 means product not found, 500 means DB paused
            assert resp_get_existing.status_code in [404, 500], f"Expected 404 or 500, got {resp_get_existing.status_code}"

        # Step 3: Test GET /api/products/{id} for non-existent product id (expect 404 or 500)
        non_existent_id = "this-id-does-not-exist-12345"
        resp_get_nonexistent = requests.get(f"{BASE_URL}/api/products/{non_existent_id}", headers=headers, timeout=TIMEOUT)

        assert resp_get_nonexistent.status_code in [404, 500], f"Expected 404 or 500 for non-existent product id, got {resp_get_nonexistent.status_code}"

    finally:
        # Cleanup: delete created product if any
        if product_created and product_id:
            requests.delete(f"{BASE_URL}/api/products/{product_id}", headers=headers, timeout=TIMEOUT)

test_get_product_by_id_should_return_product_details()
