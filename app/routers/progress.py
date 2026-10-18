from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import Problem, User, UserProblemProgress
from app.schemas.schemas import ProgressResponse, ProgressUpdate

router = APIRouter(prefix="/api/v1/progress", tags=["Progress"])

@router.post("/", response_model=ProgressResponse)
def log_progress(
    progress_in: ProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problem = db.query(Problem).filter(Problem.id == progress_in.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    record = db.query(UserProblemProgress).filter(
        UserProblemProgress.user_id == current_user.id,
        UserProblemProgress.problem_id == progress_in.problem_id
    ).first()

    if not record:
        record = UserProblemProgress(
            user_id=current_user.id,
            problem_id=progress_in.problem_id,
            status=progress_in.status,
            time_spent_minutes=progress_in.time_spent_minutes
        )
        db.add(record)
    else:
        record.status = progress_in.status
        record.time_spent_minutes += progress_in.time_spent_minutes

    db.commit()
    db.refresh(record)
    return record
