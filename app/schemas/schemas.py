from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.models.models import DifficultyLevel, ProblemStatus, UserRole


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str | None = None
    role: UserRole | None = UserRole.CANDIDATE

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None
    role: str | None = None

class ProblemCreate(BaseModel):
    title: str = Field(examples=["Two Sum"])
    category: str = Field(examples=["Arrays & Hashing"])
    difficulty: DifficultyLevel
    source_url: str | None = None

class ProblemResponse(ProblemCreate):
    id: int

    class Config:
        from_attributes = True

class ProgressUpdate(BaseModel):
    problem_id: int
    status: ProblemStatus
    time_spent_minutes: int = Field(ge=0, default=0)

class ProgressResponse(BaseModel):
    id: int
    problem_id: int
    status: ProblemStatus
    time_spent_minutes: int
    updated_at: datetime

    class Config:
        from_attributes = True

class CategoryReadiness(BaseModel):
    category: str
    total_problems: int
    completed_problems: int
    completion_rate: float

class ReadinessReport(BaseModel):
    overall_score: float
    total_solved: int
    total_problems: int
    category_breakdown: list[CategoryReadiness]
