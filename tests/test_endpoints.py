from fastapi import status


def test_register_and_login(client):
    reg_res = client.post(
        "/api/v1/auth/register",
        json={
            "email": "candidate@example.com",
            "password": "strongpassword123",
            "full_name": "Test Candidate",
            "role": "candidate",
        },
    )
    assert reg_res.status_code == status.HTTP_201_CREATED
    assert reg_res.json()["email"] == "candidate@example.com"

    login_res = client.post(
        "/api/v1/auth/login",
        data={"username": "candidate@example.com", "password": "strongpassword123"},
    )
    assert login_res.status_code == status.HTTP_200_OK
    assert "access_token" in login_res.json()


def test_rbac_problem_creation(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "candidate2@example.com",
            "password": "password123",
            "role": "candidate",
        },
    )
    token = client.post(
        "/api/v1/auth/login",
        data={"username": "candidate2@example.com", "password": "password123"},
    ).json()["access_token"]

    res = client.post(
        "/api/v1/problems/",
        json={"title": "Invert Binary Tree", "category": "Trees", "difficulty": "Easy"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == status.HTTP_403_FORBIDDEN


def test_request_id_middleware(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert "x-request-id" in response.headers


def test_full_readiness_and_progress_lifecycle(client):
    # 1. Register admin and candidate
    client.post(
        "/api/v1/auth/register",
        json={"email": "admin@test.com", "password": "adminsecret123", "role": "admin"},
    )
    admin_token = client.post(
        "/api/v1/auth/login",
        data={"username": "admin@test.com", "password": "adminsecret123"},
    ).json()["access_token"]

    client.post(
        "/api/v1/auth/register",
        json={"email": "user@test.com", "password": "usersecret123", "role": "candidate"},
    )
    user_token = client.post(
        "/api/v1/auth/login",
        data={"username": "user@test.com", "password": "usersecret123"},
    ).json()["access_token"]

    # 2. Admin creates two problems
    p1 = client.post(
        "/api/v1/problems/",
        json={"title": "Two Sum", "category": "Arrays & Hashing", "difficulty": "Easy"},
        headers={"Authorization": f"Bearer {admin_token}"},
    ).json()

    p2 = client.post(
        "/api/v1/problems/",
        json={"title": "LRU Cache", "category": "System Design & DB", "difficulty": "Medium"},
        headers={"Authorization": f"Bearer {admin_token}"},
    ).json()

    # 3. Check initial zero readiness
    r_initial = client.get(
        "/api/v1/readiness/me",
        headers={"Authorization": f"Bearer {user_token}"},
    ).json()
    assert r_initial["total_problems"] == 2
    assert r_initial["total_solved"] == 0
    assert r_initial["overall_score"] == 0.0

    # 4. User solves Two Sum (Easy: 1.0 weight out of total 3.5 = ~28.57%)
    prog_res = client.post(
        "/api/v1/progress/",
        json={"problem_id": p1["id"], "status": "Completed", "time_spent_minutes": 20},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert prog_res.status_code == status.HTTP_200_OK

    # 5. Check updated readiness report
    r_updated = client.get(
        "/api/v1/readiness/me",
        headers={"Authorization": f"Bearer {user_token}"},
    ).json()
    assert r_updated["total_solved"] == 1
    assert r_updated["overall_score"] > 28.0
    assert r_updated["retention_score"] > 0.0
    assert len(r_updated["category_breakdown"]) == 2
