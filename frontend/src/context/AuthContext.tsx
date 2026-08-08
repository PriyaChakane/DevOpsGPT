import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authService from '@/services/authService';
import type { AuthContextValue, LoginCredentials, SignupPayload, User } from '@/types/auth';

const USER_STORAGE_KEY = 'devopsgpt_user';
const TOKEN_STORAGE_KEY = 'devopsgpt_token';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored) as User);
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setUser(response.user);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    const response = await authService.signup(payload);
    setUser(response.user);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, isLoading, login, signup, logout }),
    [user, isLoading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
