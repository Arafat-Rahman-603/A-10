'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      setUser(res.data.user);
      const redirect = redirectPath || getDashboardPath(res.data.user.role);
      setRedirectPath(null);
      router.push(redirect);
    }
    return res.data;
  };

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data.success) {
      setUser(res.data.user);
      const redirect = redirectPath || getDashboardPath(res.data.user.role);
      setRedirectPath(null);
      router.push(redirect);
    }
    return res.data;
  };

  const googleLogin = async (googleData) => {
    const res = await api.post('/auth/google', googleData);
    if (res.data.success) {
      setUser(res.data.user);
      const redirect = redirectPath || getDashboardPath(res.data.user.role);
      setRedirectPath(null);
      router.push(redirect);
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      
    }
    setUser(null);
    router.push('/login');
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'admin': return '/dashboard/admin';
      case 'founder': return '/dashboard/founder';
      case 'collaborator': return '/dashboard/collaborator';
      default: return '/';
    }
  };

  const saveRedirectPath = (path) => {
    setRedirectPath(path);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      register,
      login,
      googleLogin,
      logout,
      updateUser,
      getDashboardPath,
      saveRedirectPath,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
