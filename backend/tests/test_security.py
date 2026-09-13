"""Security-audit tests: rate limiting, input length caps, generic 500."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://dialect-content-ai.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Input length caps (422 on overflow) ---
def test_generate_topic_too_long_422(client):
    payload = {"category": "tiktok-scripts", "dialect": "ar-EG",
               "topic": "a" * 301, "vibe": "viral"}
    r = client.post(f"{API}/generate", json=payload)
    assert r.status_code == 422, r.text


def test_generate_prompt_idea_too_long_422(client):
    r = client.post(f"{API}/generate-prompt",
                    json={"idea": "b" * 501, "dialect": "ar-EG"})
    assert r.status_code == 422, r.text


def test_contact_message_too_long_422(client):
    r = client.post(f"{API}/contact", json={
        "name": "TEST_x", "email": "a@b.com", "topic": "t",
        "message": "m" * 2001
    })
    assert r.status_code == 422, r.text


def test_contact_name_too_long_422(client):
    r = client.post(f"{API}/contact", json={
        "name": "n" * 101, "email": "a@b.com", "topic": "t", "message": "ok"
    })
    assert r.status_code == 422, r.text


def test_contact_topic_too_long_422(client):
    r = client.post(f"{API}/contact", json={
        "name": "TEST_x", "email": "a@b.com",
        "topic": "t" * 51, "message": "ok"
    })
    assert r.status_code == 422, r.text


# --- Rate limit on contact: per-XFF 5/min then 429; different XFF NOT throttled ---
LOCAL_API = "http://localhost:8001/api"


def test_contact_rate_limit_per_xff_429_after_5():
    # Fresh session so we can control X-Forwarded-For header
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json",
                      "X-Forwarded-For": "203.0.113.10"})
    payload = {"name": "TEST_RL", "email": "rl@example.com",
               "topic": "General", "message": "rate-limit probe"}
    statuses = [s.post(f"{LOCAL_API}/contact", json=payload).status_code
                for _ in range(8)]
    assert statuses[:5].count(200) == 5, f"Expected 5x200 first, got {statuses}"
    assert 429 in statuses[5:], f"Expected 429 after 5, got {statuses}"


def test_contact_rate_limit_different_xff_not_throttled():
    # Wait so previous window is not the sole determinant; use a brand new XFF anyway
    time.sleep(2)
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json",
                      "X-Forwarded-For": "198.51.100.77"})
    payload = {"name": "TEST_RL2", "email": "rl2@example.com",
               "topic": "General", "message": "diff-ip probe"}
    r = s.post(f"{LOCAL_API}/contact", json=payload)
    assert r.status_code == 200, f"Different-XFF request should not be throttled, got {r.status_code}: {r.text}"
