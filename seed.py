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

PROBLEMS_DATA = [
    # Arrays & Hashing
    {"title": "Two Sum", "category": "Arrays & Hashing", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/two-sum/"},
    {"title": "Valid Anagram", "category": "Arrays & Hashing", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/valid-anagram/"},
    {"title": "Group Anagrams", "category": "Arrays & Hashing", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/group-anagrams/"},
    {"title": "Top K Frequent Elements", "category": "Arrays & Hashing", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/top-k-frequent-elements/"},
    # Two Pointers & Sliding Window
    {"title": "Valid Palindrome", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/valid-palindrome/"},
    {"title": "3Sum", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/3sum/"},
    {"title": "Longest Substring Without Repeating Characters", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/"},
    {"title": "Trapping Rain Water", "category": "Two Pointers & Sliding Window", "difficulty": DifficultyLevel.HARD, "source_url": "https://leetcode.com/problems/trapping-rain-water/"},
    # Trees & Graphs
    {"title": "Invert Binary Tree", "category": "Trees & Graphs", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/invert-binary-tree/"},
    {"title": "Maximum Depth of Binary Tree", "category": "Trees & Graphs", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/maximum-depth-of-binary-tree/"},
    {"title": "Lowest Common Ancestor of a BST", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"},
    {"title": "Number of Islands", "category": "Trees & Graphs", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/number-of-islands/"},
    # Dynamic Programming
    {"title": "Climbing Stairs", "category": "Dynamic Programming", "difficulty": DifficultyLevel.EASY, "source_url": "https://leetcode.com/problems/climbing-stairs/"},
    {"title": "Coin Change", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/coin-change/"},
    {"title": "Longest Increasing Subsequence", "category": "Dynamic Programming", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/longest-increasing-subsequence/"},
    # System Design & DB
    {"title": "LRU Cache", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/lru-cache/"},
    {"title": "Design Twitter", "category": "System Design & DB", "difficulty": DifficultyLevel.MEDIUM, "source_url": "https://leetcode.com/problems/design-twitter/"},
]


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
