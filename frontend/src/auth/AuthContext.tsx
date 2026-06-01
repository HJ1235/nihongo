import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ACCESS_TOKEN_KEY } from '../api/client';
import { login as loginApi, logout as logoutApi, me as meApi } from '../api/authApi';
import type { UserMeResponse } from '../api/types';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

type AuthContextValue = {
  user: UserMeResponse | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!accessToken) {
      setStatus('anonymous');
      return;
    }

    meApi()
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message ?? '로그인이 필요합니다.');
        }

        setUser(response.data);
        setStatus('authenticated');
      })
      .catch(() => {
        logoutApi();
        setUser(null);
        setStatus('anonymous');
      });
  }, []);

  const login = async (email: string, password: string) => {
    const loginResponse = await loginApi({ email, password });

    if (!loginResponse.success) {
      throw new Error(loginResponse.message ?? '로그인에 실패했습니다.');
    }

    const meResponse = await meApi();

    if (!meResponse.success) {
      logoutApi();
      throw new Error(meResponse.message ?? '사용자 정보를 불러오지 못했습니다.');
    }

    setUser(meResponse.data);
    setStatus('authenticated');
  };

  const logout = () => {
    logoutApi();
    setUser(null);
    setStatus('anonymous');
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      login,
      logout,
    }),
    [status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
