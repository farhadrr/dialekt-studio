"""Backend API tests for AI Content Creator Hub."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://dialect-content-ai.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Health / root ---
def test_root(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200
    assert "message" in r.json()


# --- Dialects ---
def test_dialects_returns_seven(client):
    r = client.get(f"{API}/dialects")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) == 7
    codes = {d["code"] for d in data}
    assert {"ar-EG", "ar-LEV", "ar-GULF", "ar-IRQ", "ar-MAG", "ku-SOR", "ku-BAD"}.issubset(codes)


# --- Content ---
def test_content_all(client):
    r = client.get(f"{API}/content")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # ensure required fields
    item = data[0]
    for k in ("id", "category", "dialect", "title", "body"):
        assert k in item
    assert "_id" not in item


def test_content_filter_by_category(client):
    r = client.get(f"{API}/content", params={"category": "tiktok-scripts"})
    assert r.status_code == 200
    data = r.json()
    assert len(data) > 0
    assert all(x["category"] == "tiktok-scripts" for x in data)


def test_content_filter_by_dialect(client):
    r = client.get(f"{API}/content", params={"dialect": "ar-EG"})
    assert r.status_code == 200
    data = r.json()
    assert len(data) > 0
    assert all(x["dialect"] == "ar-EG" for x in data)


# --- Contact ---
def test_contact_submit(client):
    payload = {
        "name": "TEST_User",
        "email": "test@example.com",
        "topic": "General",
        "dialect": "ar-EG",
        "message": "TEST message"
    }
    r = client.post(f"{API}/contact", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data.get("success") is True
    assert "id" in data


def test_contact_invalid_email(client):
    r = client.post(f"{API}/contact", json={
        "name": "x", "email": "not-an-email", "topic": "t", "message": "m"
    })
    assert r.status_code in (400, 422)


# --- Generate (AI) ---
@pytest.mark.parametrize("category", ["tiktok-scripts", "ai-prompts", "content-ideas"])
def test_generate_categories(client, category):
    payload = {"category": category, "dialect": "ar-EG", "topic": "coffee", "vibe": "viral"}
    r = client.post(f"{API}/generate", json=payload, timeout=60)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "text" in data
    assert isinstance(data["text"], str)
    assert len(data["text"].strip()) > 20


def test_generate_invalid_category(client):
    r = client.post(f"{API}/generate", json={
        "category": "bogus", "dialect": "ar-EG", "topic": "x", "vibe": "viral"
    })
    assert r.status_code == 400
