from fastapi import status


def test_register_and_login(client):
    reg_res = client.post("/api/v1/auth/register", json={
        "email": "candidate@example.com",
        "password": "strongpassword123",
        "full_name": "Test Candidate",
        "role": "candidate"
    })
    assert reg_res.status_code == status.HTTP_201_CREATED
    assert reg_res.json()["email"] == "candidate@example.com"

    login_res = client.post("/api/v1/auth/login", data={
        "username": "candidate@example.com",
        "password": "strongpassword123"
    })
    assert login_res.status_code == status.HTTP_200_OK
    assert "access_token" in login_res.json()

def test_rbac_problem_creation(client):
    client.post("/api/v1/auth/register", json={
        "email": "candidate@example.com",
        "password": "password123",
        "role": "candidate"
    })
    token = client.post("/api/v1/auth/login", data={
        "username": "candidate@example.com",
        "password": "password123"
    }).json()["access_token"]

    res = client.post(
        "/api/v1/problems/",
        json={"title": "Invert Binary Tree", "category": "Trees", "difficulty": "Easy"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == status.HTTP_403_FORBIDDEN
