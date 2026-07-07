import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loginRequest, registerRequest } from '../services/authService';
import {
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  storeAuth,
} from '../services/tokenStorage';
import type { AuthUser, LoginCredentials, RegisterCredentials } from '../types/auth.types';
import { AuthContext } from './AuthContext';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    setToken(getStoredToken());
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const result = await loginRequest(credentials);

    storeAuth(result.accessToken, result.user);
    setUser(result.user);
    setToken(result.accessToken);
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    const result = await registerRequest(credentials);

    storeAuth(result.accessToken, result.user);
    setUser(result.user);
    setToken(result.accessToken);
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
    }),
    [login, logout, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
