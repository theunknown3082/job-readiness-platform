import enum
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class UserRole(str, enum.Enum):
    CANDIDATE = "candidate"
    ADMIN = "admin"

class DifficultyLevel(str, enum.Enum):
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"

class ProblemStatus(str, enum.Enum):
    TODO = "Todo"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.CANDIDATE, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    progress_records = relationship("UserProblemProgress", back_populates="user", cascade="all, delete-orphan")

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)
    difficulty = Column(Enum(DifficultyLevel), nullable=False)
    source_url = Column(String, nullable=True)

    progress_records = relationship("UserProblemProgress", back_populates="problem", cascade="all, delete-orphan")

class UserProblemProgress(Base):
    __tablename__ = "user_problem_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(Enum(ProblemStatus), default=ProblemStatus.TODO, nullable=False)
    time_spent_minutes = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="progress_records")
    problem = relationship("Problem", back_populates="progress_records")
