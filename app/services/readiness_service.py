from sqlalchemy.orm import Session

from app.models.models import (
    DifficultyLevel,
    Problem,
    ProblemStatus,
    UserProblemProgress,
)
from app.schemas.schemas import CategoryReadiness, ReadinessReport

DIFFICULTY_WEIGHTS = {
    DifficultyLevel.EASY: 1.0,
    DifficultyLevel.MEDIUM: 2.5,
    DifficultyLevel.HARD: 5.0
}

def calculate_user_readiness(user_id: int, db: Session) -> ReadinessReport:
    all_problems = db.query(Problem).all()
    user_progress = db.query(UserProblemProgress).filter(
        UserProblemProgress.user_id == user_id,
        UserProblemProgress.status == ProblemStatus.COMPLETED
    ).all()

    completed_problem_ids = {p.problem_id for p in user_progress}

    if not all_problems:
        return ReadinessReport(
            overall_score=0.0,
            total_solved=0,
            total_problems=0,
            category_breakdown=[]
        )

    categories = {}
    total_weighted_points = sum(DIFFICULTY_WEIGHTS[p.difficulty] for p in all_problems)
    earned_weighted_points = 0.0

    for prob in all_problems:
        cat = prob.category
        if cat not in categories:
            categories[cat] = {"total": 0, "completed": 0}
        categories[cat]["total"] += 1

        if prob.id in completed_problem_ids:
            categories[cat]["completed"] += 1
            earned_weighted_points += DIFFICULTY_WEIGHTS[prob.difficulty]

    category_breakdown = [
        CategoryReadiness(
            category=cat,
            total_problems=stats["total"],
            completed_problems=stats["completed"],
            completion_rate=round((stats["completed"] / stats["total"]) * 100, 2)
        )
        for cat, stats in categories.items()
    ]

    readiness_score = round((earned_weighted_points / total_weighted_points) * 100, 2) if total_weighted_points > 0 else 0.0

    return ReadinessReport(
        overall_score=readiness_score,
        total_solved=len(completed_problem_ids),
        total_problems=len(all_problems),
        category_breakdown=category_breakdown
    )
