import React, { createContext, useContext, useEffect, useState } from 'react';
import { parseJwt } from '../lib/utils';
import {
  authService,
  isDemoModeActive,
  RequestMetrics,
  setDemoModeActive,
  subscribeToMetrics,
} from '../services/api';
import { UserRole } from '../types';

interface AuthUser {
  email: string;
  role: UserRole;
  fullName?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDemo: boolean;
  metrics: RequestMetrics;
  toggleDemoMode: () => void;
  login: (username: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string, role?: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('access_token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedToken = localStorage.getItem('access_token');
    if (!savedToken) return null;
    const decoded = parseJwt(savedToken);
    if (!decoded) return null;
    return {
      email: decoded.sub || 'user@prep.dev',
      role: (decoded.role as UserRole) || 'candidate',
    };
  });
  const [isDemo, setIsDemo] = useState<boolean>(() => isDemoModeActive());
  const [metrics, setMetrics] = useState<RequestMetrics>({
    requestId: null,
    latencyMs: null,
    status: null,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    const unsubscribe = subscribeToMetrics((m) => {
      setMetrics(m);
    });
    return unsubscribe;
  }, []);

  const login = async (username: string, password: string) => {
    const res = await authService.login(username, password);
    localStorage.setItem('access_token', res.access_token);
    setToken(res.access_token);

    const decoded = parseJwt(res.access_token);
    const authUser: AuthUser = {
      email: decoded?.sub || username,
      role: (decoded?.role as UserRole) || (username.includes('admin') ? 'admin' : 'candidate'),
    };
    setUser(authUser);
  };

  const register = async (email: string, password: string, fullName?: string, role?: UserRole) => {
    await authService.register({
      email,
      password,
      full_name: fullName,
      role: role || 'candidate',
    });
    // Automatically log in after registration
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  const toggleDemoMode = () => {
    const next = !isDemo;
    setIsDemo(next);
    setDemoModeActive(next);
    if (next && !user) {
      // Set default demo user as candidate
      setUser({
        email: 'alex.river@prep.dev',
        role: 'candidate',
        fullName: 'Alex River',
      });
    }
  };

  const isAuthenticated = !!token || (isDemo && !!user);
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isDemo,
        metrics,
        toggleDemoMode,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
