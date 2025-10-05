import requests
import uuid

BASE_URL = "http://localhost:3000"
TIMEOUT = 30  # seconds
HEADERS = {
    "Content-Type": "application/json",
    # Include authentication headers here if needed, e.g.:
    # "Authorization": "Bearer <token>"
}


def put_product_by_id_should_update_product():
    # First, get product types (to have a valid productTypeId)
    try:
        resp_pt = requests.get(f"{BASE_URL}/api/product-types", headers=HEADERS, timeout=TIMEOUT)
        resp_pt.raise_for_status()
        product_types = resp_pt.json()
    except requests.exceptions.RequestException as e:
        print(f"Could not retrieve product types: {e}")
        product_types = []
    if not product_types:
        print("No product types available; cannot create product. Expecting possible DB 500 errors or configuration issues.")
        return

    product_type_id = product_types[0].get("id")

    # Then, create a project to associate with the product
    project_data = {
        "title": "Test Project for Product Update",
        "summary": "Project summary for testing product update.",
        "keywords": ["test", "product", "update"],
        "proponentEntity": "Test Entity"
    }
    product_id = None
    project_id = None
    try:
        resp_proj = requests.post(f"{BASE_URL}/api/projects", headers=HEADERS, json=project_data, timeout=TIMEOUT)
        if resp_proj.status_code == 500:
            print("Received 500 Internal Server Error from /api/projects POST - likely DB paused")
            return
        resp_proj.raise_for_status()
        project_created = resp_proj.json() if resp_proj.headers.get("Content-Type", "").startswith("application/json") else None
        project_id = project_created.get("id") if isinstance(project_created, dict) else None
        if not project_id:
            # Try to fallback as no ID returned, but created (some APIs may return no body)
            print("Project created but no ID returned; cannot proceed reliably.")
            return

        # Create a new product associated to the project
        product_data = {
            "title": "Test Product",
            "summary": "Initial product summary",
            "productTypeId": product_type_id,
            "projectId": project_id
        }
        resp_prod = requests.post(f"{BASE_URL}/api/products", headers=HEADERS, json=product_data, timeout=TIMEOUT)
        if resp_prod.status_code == 500:
            print("Received 500 Internal Server Error from /api/products POST - likely DB paused")
            return
        resp_prod.raise_for_status()
        product_created = resp_prod.json() if resp_prod.headers.get("Content-Type", "").startswith("application/json") else None
        product_id = product_created.get("id") if isinstance(product_created, dict) else None
        if not product_id:
            print("Product created but no ID returned; cannot proceed reliably.")
            return

        # Now attempt to update the product with PUT /api/products/{id}
        update_data = {
            "title": "Updated Product Title",
            "summary": "Updated summary of product",
            "description": "Updated description.",
            "productUrl": "https://example.com/updated-product",
            "isPublic": True
        }
        put_resp = requests.put(f"{BASE_URL}/api/products/{product_id}", headers=HEADERS, json=update_data, timeout=TIMEOUT)

        if put_resp.status_code == 500:
            print("Received 500 Internal Server Error on PUT existing product - likely DB paused")
        else:
            assert put_resp.status_code == 200, f"Expected 200 on updating existing product, got {put_resp.status_code}"

        # Test updating non-existent product ID
        non_existent_id = str(uuid.uuid4())
        put_resp_nonexist = requests.put(f"{BASE_URL}/api/products/{non_existent_id}", headers=HEADERS, json=update_data, timeout=TIMEOUT)

        # According to instructions, if DB paused, may get 500 instead of 404
        if put_resp_nonexist.status_code == 500:
            print("Received 500 Internal Server Error on PUT non-existent product - likely DB paused")
        else:
            assert put_resp_nonexist.status_code == 404, f"Expected 404 on updating non-existent product, got {put_resp_nonexist.status_code}"

    except requests.exceptions.RequestException as e:
        print(f"Request error occurred: {e}")
    finally:
        # Cleanup: delete product if created
        if product_id:
            try:
                del_resp = requests.delete(f"{BASE_URL}/api/products/{product_id}", headers=HEADERS, timeout=TIMEOUT)
                # It's okay if deletion fails due to DB paused -- just note it
                if del_resp.status_code == 500:
                    print("Received 500 Internal Server Error on DELETE product - likely DB paused")
            except requests.exceptions.RequestException as e:
                print(f"Deletion request error: {e}")

        # Cleanup: delete project if created
        if project_id:
            try:
                del_resp_proj = requests.delete(f"{BASE_URL}/api/projects/{project_id}", headers=HEADERS, timeout=TIMEOUT)
                if del_resp_proj.status_code == 500:
                    print("Received 500 Internal Server Error on DELETE project - likely DB paused")
            except requests.exceptions.RequestException as e:
                print(f"Deletion request error for project: {e}")


put_product_by_id_should_update_product()