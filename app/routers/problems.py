
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user, require_role
from app.models.models import Problem, User, UserRole
from app.schemas.schemas import ProblemCreate, ProblemResponse

router = APIRouter(prefix="/api/v1/problems", tags=["Problems"])

@router.post("/", response_model=ProblemResponse, status_code=status.HTTP_201_CREATED)
def create_problem(
    problem_in: ProblemCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role(UserRole.ADMIN))
):
    problem = Problem(**problem_in.model_dump())
    db.add(problem)
    db.commit()
    db.refresh(problem)
    return problem

@router.get("/", response_model=list[ProblemResponse])
def list_problems(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Problem)
    if category:
        query = query.filter(Problem.category == category)
    return query.offset(skip).limit(limit).all()
