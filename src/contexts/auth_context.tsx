'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { decodeJwt } from 'jose';

export interface IUserProfile {
  address: string;
  name: string | null;
  role: string;
}

interface IAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: IUserProfile | null;
  token: string | null;
  login: (dewt: string) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Info: (20251224 - Tzuhan) Initialize as true
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem('dewt');
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  const fetchUser = useCallback(
    async (currentToken: string) => {
      try {
        const res = await fetch('/api/v1/auth/me', {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });

        if (res.ok) {
          const responseData = await res.json();
          if (responseData.code === 200) {
            const userData = responseData.payload;
            setToken(currentToken);
            setUser({
              address: userData.address,
              name: userData.name || 'User',
              role: userData.role,
            });
          } else {
            logout();
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    },
    [logout]
  );

  useEffect(() => {
    const storedToken = localStorage.getItem('dewt');
    if (storedToken) {
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const login = useCallback((dewt: string) => {
    localStorage.setItem('dewt', dewt);
    setToken(dewt);
    try {
      const payload = decodeJwt(dewt) as {
        address: string;
        name: string | null;
        role: string;
      };
      setUser({
        address: payload.address,
        name: payload.name || 'User',
        role: payload.role,
      });
    } catch (e) {
      console.error('Invalid token format', e);
    }
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: !!token,
      isLoading,
      user,
      token,
      login,
      logout,
    }),
    [isLoading, token, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
