'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, logout as apiLogout } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    try {
      const res = await getMe();
      setUser(res.data);
    } catch {
      localStorage.removeItem('token');
      document.cookie = 'token=; Max-Age=0; path=/';
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const loginSuccess = (token, userData) => {
    localStorage.setItem('token', token);
    // Also store in cookie for middleware
    document.cookie = `token=${token}; path=/; SameSite=Lax`;
    setUser(userData);
    router.push('/');
  };

  const logout = async () => {
    try { await apiLogout(); } catch {}
    localStorage.removeItem('token');
    document.cookie = 'token=; Max-Age=0; path=/';
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
