from datetime import UTC, datetime

from app.core.database import Base, SessionLocal, engine
from app.core.security import get_password_hash
from app.models.models import (
    DifficultyLevel,
    Problem,
    ProblemStatus,
    User,
    UserProblemProgress,
    UserRole,
)

Base.metadata.create_all(bind=engine)

from populate_nc150 import NC150_PROBLEMS

PROBLEMS_DATA = NC150_PROBLEMS


def seed_database():
    db = SessionLocal()
    try:
        # 1. Seed Admin User
        admin = db.query(User).filter(User.email == "admin@platform.dev").first()
        if not admin:
            admin = User(
                email="admin@platform.dev",
                hashed_password=get_password_hash("AdminPassSecure123!"),
                full_name="Platform Admin",
                role=UserRole.ADMIN,
                created_at=datetime.now(UTC),
            )
            db.add(admin)

        # 2. Seed Candidate User
        candidate = db.query(User).filter(User.email == "candidate@prep.dev").first()
        if not candidate:
            candidate = User(
                email="candidate@prep.dev",
                hashed_password=get_password_hash("CandidatePass123!"),
                full_name="Alex River",
                role=UserRole.CANDIDATE,
                created_at=datetime.now(UTC),
            )
            db.add(candidate)
        db.commit()

        # 3. Seed Problems
        for prob_data in PROBLEMS_DATA:
            existing = db.query(Problem).filter(Problem.title == prob_data["title"]).first()
            if not existing:
                db.add(Problem(**prob_data))
        db.commit()

        # 4. Seed Mock Progress for the candidate
        prob_two_sum = db.query(Problem).filter(Problem.title == "Two Sum").first()
        prob_invert = db.query(Problem).filter(Problem.title == "Invert Binary Tree").first()

        if prob_two_sum and candidate:
            if not db.query(UserProblemProgress).filter_by(user_id=candidate.id, problem_id=prob_two_sum.id).first():
                db.add(UserProblemProgress(
                    user_id=candidate.id,
                    problem_id=prob_two_sum.id,
                    status=ProblemStatus.COMPLETED,
                    time_spent_minutes=25,
                    updated_at=datetime.now(UTC)
                ))

        if prob_invert and candidate:
            if not db.query(UserProblemProgress).filter_by(user_id=candidate.id, problem_id=prob_invert.id).first():
                db.add(UserProblemProgress(
                    user_id=candidate.id,
                    problem_id=prob_invert.id,
                    status=ProblemStatus.COMPLETED,
                    time_spent_minutes=15,
                    updated_at=datetime.now(UTC)
                ))

        db.commit()
        print("Database seeded successfully with default roles, problems, and progress.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
