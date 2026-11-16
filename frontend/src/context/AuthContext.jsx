import React, { createContext, useContext, useState, useEffect } from 'react';
import { API } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('astrojit_token') || null);
  const [role, setRole] = useState(localStorage.getItem('astrojit_role') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const res = await API.getMe();
          setUser(res.user);
          setRole(res.user.role);
          localStorage.setItem('astrojit_role', res.user.role);
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, [token]);

  const login = async (loginRole, mobile, password) => {
    const res = await API.login({ role: loginRole, mobile, password });
    localStorage.setItem('astrojit_token', res.token);
    localStorage.setItem('astrojit_role', res.user.role);
    setToken(res.token);
    setRole(res.user.role);
    setUser(res.user);
    return res.user;
  };

  const registerClient = async (formData) => {
    const res = await API.registerClient(formData);
    localStorage.setItem('astrojit_token', res.token);
    localStorage.setItem('astrojit_role', 'client');
    setToken(res.token);
    setRole('client');
    setUser(res.user);
    return res.user;
  };

  const registerAstrologer = async (formData) => {
    const res = await API.registerAstrologer(formData);
    localStorage.setItem('astrojit_token', res.token);
    localStorage.setItem('astrojit_role', 'astrologer');
    setToken(res.token);
    setRole('astrologer');
    setUser(res.user);
    return res.user;
  };

  const registerVendor = async (formData) => {
    const res = await API.registerVendor(formData);
    localStorage.setItem('astrojit_token', res.token);
    localStorage.setItem('astrojit_role', 'vendor');
    setToken(res.token);
    setRole('vendor');
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('astrojit_token');
    localStorage.removeItem('astrojit_role');
    setToken(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        loading,
        login,
        registerClient,
        registerAstrologer,
        registerVendor,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
