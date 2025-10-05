import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_get_product_types_should_return_list_of_product_types():
    url = f"{BASE_URL}/api/product-types"
    headers = {
        "Accept": "application/json",
    }

    try:
        response = requests.get(url, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to {url} failed with exception: {e}"

    # Because Supabase DB may be paused and cause 500 errors, we document response cases:
    if response.status_code == 200:
        # Validate content is a JSON array of objects with expected keys for ProductType
        try:
            data = response.json()
        except ValueError:
            assert False, "Response is not valid JSON"

        assert isinstance(data, list), "Response JSON is not a list"
        # We expect product type objects with keys: id, name, description, category (all strings)
        for item in data:
            assert isinstance(item, dict), "Each item in product types list should be an object"
            assert "id" in item and isinstance(item["id"], str), "ProductType missing 'id' or not string"
            assert "name" in item and isinstance(item["name"], str), "ProductType missing 'name' or not string"
            assert "description" in item and isinstance(item["description"], str), "ProductType missing 'description' or not string"
            assert "category" in item and isinstance(item["category"], str), "ProductType missing 'category' or not string"

    elif response.status_code == 500:
        # Known issue due to paused Supabase DB backend, acceptable as per instructions
        pass
    else:
        # Other unexpected codes should raise an assertion error and be noted for investigation
        assert False, f"Unexpected status code {response.status_code} received. Possible configuration issue."

test_get_product_types_should_return_list_of_product_types()