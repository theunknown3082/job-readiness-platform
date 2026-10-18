from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User
from app.schemas.schemas import ReadinessReport
from app.services.readiness_service import calculate_user_readiness

router = APIRouter(prefix="/api/v1/readiness", tags=["Readiness Engine"])

@router.get("/me", response_model=ReadinessReport)
def get_my_readiness(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return calculate_user_readiness(current_user.id, db)
