import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  continueAsGuest,
  getAuthSession,
  loginUser,
  logoutUser,
  registerUser,
  setAuthSession,
} from '../services/auth';
import type { AuthSession } from '../types';

interface AuthContextValue {
  session: AuthSession | null;
  authReady: boolean;
  register: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  guest: () => Promise<void>;
  logout: () => Promise<void>;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    getAuthSession().then((s) => {
      setSession(s);
      setAuthReady(true);
    });
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const result = await registerUser(email, password);
    if (result.ok) {
      setSession(result.session);
      return { ok: true };
    }
    return { ok: false, error: result.error };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginUser(email, password);
    if (result.ok) {
      setSession(result.session);
      return { ok: true };
    }
    return { ok: false, error: result.error };
  }, []);

  const guest = useCallback(async () => {
    const s = await continueAsGuest();
    setSession(s);
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        authReady,
        register,
        login,
        guest,
        logout,
        isGuest: session?.isGuest ?? false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
