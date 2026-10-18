import math
from datetime import UTC, datetime

from sqlalchemy import func
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
    DifficultyLevel.HARD: 5.0,
}

# Target distribution benchmark for SDE-1 backend roles
TARGET_CATEGORY_WEIGHTS = {
    "Arrays & Hashing": 0.20,
    "Two Pointers & Sliding Window": 0.15,
    "Trees & Graphs": 0.25,
    "Dynamic Programming": 0.20,
    "System Design & DB": 0.20,
}


def calculate_retention_multiplier(last_reviewed: datetime) -> float:
    """Calculates spaced-repetition memory retention using exponential decay."""
    now = datetime.now(UTC)
    if last_reviewed.tzinfo is None:
        last_reviewed = last_reviewed.replace(tzinfo=UTC)

    days_elapsed = max(0, (now - last_reviewed).total_seconds() / 86400)
    # 0.015 decay factor yields ~63% retention at 30 days and ~40% at 60 days
    return round(math.exp(-0.015 * days_elapsed), 4)


def calculate_user_readiness(user_id: int, db: Session) -> ReadinessReport:
    # 1. Aggregate problem totals by category and difficulty via SQL GROUP BY
    problem_counts = (
        db.query(
            Problem.category,
            Problem.difficulty,
            func.count(Problem.id).label("count"),
        )
        .group_by(Problem.category, Problem.difficulty)
        .all()
    )

    if not problem_counts:
        return ReadinessReport(
            overall_score=0.0,
            retention_score=0.0,
            total_solved=0,
            total_problems=0,
            target_role_match_pct=0.0,
            category_breakdown=[],
        )

    category_stats = {}
    total_weighted_points = 0.0
    total_problems_count = 0

    for cat, diff, count in problem_counts:
        if cat not in category_stats:
            category_stats[cat] = {
                "total": 0,
                "completed": 0,
                "earned_weight": 0.0,
                "decayed_weight": 0.0,
            }
        category_stats[cat]["total"] += count
        total_problems_count += count
        total_weighted_points += DIFFICULTY_WEIGHTS[diff] * count

    # 2. Fetch completed user progress
    completed_progress = (
        db.query(UserProblemProgress, Problem)
        .join(Problem, UserProblemProgress.problem_id == Problem.id)
        .filter(
            UserProblemProgress.user_id == user_id,
            UserProblemProgress.status == ProblemStatus.COMPLETED,
        )
        .all()
    )

    earned_weighted_points = 0.0
    decayed_weighted_points = 0.0

    for prog, prob in completed_progress:
        cat = prob.category
        weight = DIFFICULTY_WEIGHTS[prob.difficulty]
        retention = calculate_retention_multiplier(prog.updated_at)

        if cat in category_stats:
            category_stats[cat]["completed"] += 1
            category_stats[cat]["earned_weight"] += weight
            category_stats[cat]["decayed_weight"] += weight * retention

        earned_weighted_points += weight
        decayed_weighted_points += weight * retention

    # 3. Build category breakdown and calculate role match index
    category_breakdown = []
    weighted_role_match = 0.0

    for cat, stats in category_stats.items():
        comp_rate = round((stats["completed"] / stats["total"]) * 100, 2)
        effective_score = round(
            (stats["decayed_weight"] / max(stats["earned_weight"], 1.0)) * comp_rate, 2
        )
        category_breakdown.append(
            CategoryReadiness(
                category=cat,
                total_problems=stats["total"],
                completed_problems=stats["completed"],
                completion_rate=comp_rate,
                effective_score=effective_score,
            )
        )
        target_weight = TARGET_CATEGORY_WEIGHTS.get(cat, 0.10)
        weighted_role_match += (comp_rate / 100.0) * target_weight

    overall_score = (
        round((earned_weighted_points / total_weighted_points) * 100, 2)
        if total_weighted_points > 0
        else 0.0
    )
    retention_score = (
        round((decayed_weighted_points / total_weighted_points) * 100, 2)
        if total_weighted_points > 0
        else 0.0
    )

    return ReadinessReport(
        overall_score=overall_score,
        retention_score=retention_score,
        total_solved=len(completed_progress),
        total_problems=total_problems_count,
        target_role_match_pct=round(min(100.0, weighted_role_match * 100), 2),
        category_breakdown=category_breakdown,
    )
