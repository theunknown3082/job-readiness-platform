import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  AuthToken,
  Problem,
  ProblemCreatePayload,
  ProgressResponse,
  ProgressUpdatePayload,
  ReadinessReport,
  User,
} from '../types';
import { MOCK_PROBLEMS, MOCK_PROGRESS, MOCK_READINESS_REPORT } from './mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export interface RequestMetrics {
  requestId: string | null;
  latencyMs: number | null;
  status: number | null;
  timestamp: string;
}

let latestMetrics: RequestMetrics = {
  requestId: null,
  latencyMs: null,
  status: null,
  timestamp: new Date().toISOString(),
};

type MetricsListener = (metrics: RequestMetrics) => void;
const metricsListeners: Set<MetricsListener> = new Set();

export const subscribeToMetrics = (listener: MetricsListener) => {
  metricsListeners.add(listener);
  listener(latestMetrics);
  return () => {
    metricsListeners.delete(listener);
  };
};

const notifyMetrics = (metrics: RequestMetrics) => {
  latestMetrics = metrics;
  metricsListeners.forEach((l) => l(metrics));
};

export const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor: inject token & track start time
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  (config as any).metadata = { startTime: performance.now() };
  return config;
});

// Response interceptor: extract X-Request-ID and calculate latency
api.interceptors.response.use(
  (response) => {
    const startTime = (response.config as any).metadata?.startTime;
    const latencyMs = startTime ? Math.round(performance.now() - startTime) : null;
    const requestId =
      response.headers['x-request-id'] ||
      response.headers['X-Request-ID'] ||
      response.headers['x-request-id'.toLowerCase()] ||
      null;

    notifyMetrics({
      requestId,
      latencyMs,
      status: response.status,
      timestamp: new Date().toISOString(),
    });

    return response;
  },
  (error: AxiosError) => {
    const startTime = (error.config as any)?.metadata?.startTime;
    const latencyMs = startTime ? Math.round(performance.now() - startTime) : null;
    const requestId =
      (error.response?.headers &&
        (error.response.headers['x-request-id'] ||
          error.response.headers['X-Request-ID'])) ||
      null;

    notifyMetrics({
      requestId,
      latencyMs,
      status: error.response?.status || 500,
      timestamp: new Date().toISOString(),
    });

    return Promise.reject(error);
  }
);

// State for Demo Mode (in-memory mock store)
let demoProblems: Problem[] = [...MOCK_PROBLEMS];
let demoProgress: Record<number, any> = { ...MOCK_PROGRESS };
let demoReadiness: ReadinessReport = JSON.parse(JSON.stringify(MOCK_READINESS_REPORT));

export const isDemoModeActive = (): boolean => {
  return localStorage.getItem('demo_mode') === 'true';
};

export const setDemoModeActive = (active: boolean) => {
  localStorage.setItem('demo_mode', active ? 'true' : 'false');
};

// API Client Methods with Demo Mode Fallback
export const authService = {
  login: async (username: string, password: string): Promise<AuthToken> => {
    if (isDemoModeActive()) {
      await new Promise((res) => setTimeout(res, 250));
      const role = username.includes('admin') ? 'admin' : 'candidate';
      // Mock signed JWT-like structure
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ sub: username, role, exp: Date.now() / 1000 + 86400 }));
      const fakeToken = `${header}.${payload}.mockSignature`;
      return { access_token: fakeToken, token_type: 'bearer' };
    }

    // Format as application/x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    const res = await api.post<AuthToken>('/api/v1/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data;
  },

  register: async (payload: {
    email: string;
    password: string;
    full_name?: string;
    role?: 'candidate' | 'admin';
  }): Promise<User> => {
    if (isDemoModeActive()) {
      await new Promise((res) => setTimeout(res, 250));
      return {
        id: Math.floor(Math.random() * 1000) + 10,
        email: payload.email,
        full_name: payload.full_name || null,
        role: payload.role || 'candidate',
        created_at: new Date().toISOString(),
      };
    }
    const res = await api.post<User>('/api/v1/auth/register', payload);
    return res.data;
  },
};

export const problemsService = {
  list: async (category?: string): Promise<Problem[]> => {
    if (isDemoModeActive()) {
      await new Promise((res) => setTimeout(res, 150));
      let list = [...demoProblems];
      if (category) {
        list = list.filter((p) => p.category === category);
      }
      return list;
    }
    const params1: Record<string, any> = { skip: 0, limit: 100 };
    if (category) params1.category = category;
    const res1 = await api.get<Problem[]>('/api/v1/problems/', { params: params1 });

    if (res1.data.length === 100) {
      const params2: Record<string, any> = { skip: 100, limit: 100 };
      if (category) params2.category = category;
      const res2 = await api.get<Problem[]>('/api/v1/problems/', { params: params2 });
      return [...res1.data, ...res2.data];
    }
    return res1.data;
  },

  create: async (payload: ProblemCreatePayload): Promise<Problem> => {
    if (isDemoModeActive()) {
      await new Promise((res) => setTimeout(res, 200));
      const newProblem: Problem = {
        id: demoProblems.length + 1,
        ...payload,
      };
      demoProblems.unshift(newProblem);
      return newProblem;
    }
    const res = await api.post<Problem>('/api/v1/problems/', payload);
    return res.data;
  },
};

export const progressService = {
  log: async (payload: ProgressUpdatePayload): Promise<ProgressResponse> => {
    if (isDemoModeActive()) {
      await new Promise((res) => setTimeout(res, 150));
      const existing = demoProgress[payload.problem_id];
      const timeSpent = (existing?.time_spent_minutes || 0) + payload.time_spent_minutes;
      const updated: ProgressResponse = {
        id: existing?.id || Math.floor(Math.random() * 1000),
        problem_id: payload.problem_id,
        status: payload.status,
        time_spent_minutes: timeSpent,
        updated_at: new Date().toISOString(),
      };
      demoProgress[payload.problem_id] = updated;

      // Update mock readiness report dynamically
      const completedCount = Object.values(demoProgress).filter((p: any) => p.status === 'Completed').length;
      demoReadiness.total_solved = completedCount;
      demoReadiness.overall_score = Math.min(100, Math.round((completedCount / demoProblems.length) * 100 * 10) / 10);
      demoReadiness.retention_score = Math.min(100, Math.round(demoReadiness.overall_score * 0.88 * 10) / 10);
      demoReadiness.target_role_match_pct = Math.min(100, Math.round((completedCount / 10) * 100 * 10) / 10);

      return updated;
    }
    const res = await api.post<ProgressResponse>('/api/v1/progress/', payload);
    return res.data;
  },

  getDemoProgress: () => demoProgress,
};

export const readinessService = {
  getReport: async (): Promise<ReadinessReport> => {
    if (isDemoModeActive()) {
      await new Promise((res) => setTimeout(res, 200));
      return demoReadiness;
    }
    const res = await api.get<ReadinessReport>('/api/v1/readiness/me');
    return res.data;
  },
};

export const systemService = {
  checkHealth: async (): Promise<{ status: string }> => {
    const res = await api.get<{ status: string }>('/health');
    return res.data;
  },
};
