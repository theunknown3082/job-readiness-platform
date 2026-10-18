export type UserRole = 'candidate' | 'admin';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type ProblemStatus = 'Todo' | 'In Progress' | 'Completed';

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface DecodedToken {
  sub: string;
  role: UserRole;
  exp?: number;
}

export interface Problem {
  id: number;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  source_url?: string | null;
}

export interface ProblemCreatePayload {
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  source_url?: string;
}

export interface UserProblemProgress {
  id: number;
  problem_id: number;
  status: ProblemStatus;
  time_spent_minutes: number;
  updated_at: string;
}

export type ProgressResponse = UserProblemProgress;

export interface ProgressUpdatePayload {
  problem_id: number;
  status: ProblemStatus;
  time_spent_minutes: number;
}

export interface CategoryReadiness {
  category: string;
  total_problems: number;
  completed_problems: number;
  completion_rate: number;
  effective_score: number;
}

export interface ReadinessReport {
  overall_score: number;
  retention_score: number;
  total_solved: number;
  total_problems: number;
  target_role_match_pct: number;
  category_breakdown: CategoryReadiness[];
}

export interface ProblemWithProgress extends Problem {
  user_status?: ProblemStatus;
  user_time_spent?: number;
  last_updated?: string;
}
