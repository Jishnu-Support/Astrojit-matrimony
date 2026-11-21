import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API } from '../api';

const AuthContext = createContext();

// 30 minutes of inactivity in milliseconds
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
const LAST_ACTIVE_KEY = 'astrojit_last_active';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('astrojit_token') || null);
  const [role, setRole] = useState(localStorage.getItem('astrojit_role') || null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(null);

  const logout = useCallback((isAutoTimeout = false) => {
    localStorage.removeItem('astrojit_token');
    localStorage.removeItem('astrojit_role');
    localStorage.removeItem(LAST_ACTIVE_KEY);
    setToken(null);
    setRole(null);
    setUser(null);
    if (isAutoTimeout) {
      setSessionExpiredNotice(
        '30 நிமிடங்கள் செயல்படாததால் தங்களின் அமர்வு முடிவடைந்தது / Your session expired due to 30 minutes of inactivity. Please sign in again.'
      );
    } else {
      setSessionExpiredNotice(null);
    }
  }, []);

  const clearSessionExpiredNotice = useCallback(() => {
    setSessionExpiredNotice(null);
  }, []);

  const recordActivity = useCallback(() => {
    const now = Date.now();
    localStorage.setItem(LAST_ACTIVE_KEY, now.toString());
  }, []);

  // Check auth and initial inactivity on startup
  useEffect(() => {
    async function checkAuth() {
      if (token) {
        const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
        // If last active was recorded and is older than 30 mins, logout immediately
        if (lastActive && Date.now() - Number(lastActive) >= INACTIVITY_TIMEOUT_MS) {
          logout(true);
          setLoading(false);
          return;
        }

        try {
          const res = await API.getMe();
          setUser(res.user);
          setRole(res.user.role);
          localStorage.setItem('astrojit_role', res.user.role);
          if (!lastActive) {
            recordActivity();
          }
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout(false);
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, [token, logout, recordActivity]);

  // Inactivity auto-logout tracker when authenticated
  useEffect(() => {
    if (!token || !user) return;

    let lastThrottledTime = Date.now();
    recordActivity();

    const handleUserActivity = () => {
      const now = Date.now();
      // Throttle localStorage writes to once every 3 seconds to avoid performance overhead
      if (now - lastThrottledTime > 3000) {
        lastThrottledTime = now;
        recordActivity();
      }
    };

    const checkInactivity = () => {
      const storedLast = localStorage.getItem(LAST_ACTIVE_KEY);
      const lastTime = storedLast ? Number(storedLast) : lastThrottledTime;
      if (Date.now() - lastTime >= INACTIVITY_TIMEOUT_MS) {
        console.warn('Auto-logging out due to 30 minutes of inactivity');
        logout(true);
      }
    };

    const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, handleUserActivity, { passive: true }));

    // Periodic check every 10 seconds
    const intervalId = setInterval(checkInactivity, 10000);

    // Immediate check on tab focus or visibility change (e.g. waking up computer or switching back from another tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkInactivity();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', checkInactivity);

    return () => {
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, handleUserActivity));
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', checkInactivity);
    };
  }, [token, user, logout, recordActivity]);

  const login = async (loginRole, mobile, password) => {
    const res = await API.login({ role: loginRole, mobile, password });
    localStorage.setItem('astrojit_token', res.token);
    localStorage.setItem('astrojit_role', res.user.role);
    recordActivity();
    setSessionExpiredNotice(null);
    setToken(res.token);
    setRole(res.user.role);
    setUser(res.user);
    return res.user;
  };

  const loginWithOtp = async (loginRole, mobile, otp) => {
    const res = await API.loginWithOtp({ role: loginRole, mobile, otp });
    localStorage.setItem('astrojit_token', res.token);
    localStorage.setItem('astrojit_role', res.user.role);
    recordActivity();
    setSessionExpiredNotice(null);
    setToken(res.token);
    setRole(res.user.role);
    setUser(res.user);
    return res.user;
  };

  const registerClient = async (formData) => {
    const res = await API.registerClient(formData);
    localStorage.setItem('astrojit_token', res.token);
    localStorage.setItem('astrojit_role', 'client');
    recordActivity();
    setSessionExpiredNotice(null);
    setToken(res.token);
    setRole('client');
    setUser(res.user);
    return res.user;
  };

  const registerAstrologer = async (formData) => {
    const res = await API.registerAstrologer(formData);
    localStorage.setItem('astrojit_token', res.token);
    localStorage.setItem('astrojit_role', 'astrologer');
    recordActivity();
    setSessionExpiredNotice(null);
    setToken(res.token);
    setRole('astrologer');
    setUser(res.user);
    return res.user;
  };

  const registerVendor = async (formData) => {
    const res = await API.registerVendor(formData);
    localStorage.setItem('astrojit_token', res.token);
    localStorage.setItem('astrojit_role', 'vendor');
    recordActivity();
    setSessionExpiredNotice(null);
    setToken(res.token);
    setRole('vendor');
    setUser(res.user);
    return res.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        loading,
        sessionExpiredNotice,
        clearSessionExpiredNotice,
        login,
        loginWithOtp,
        registerClient,
        registerAstrologer,
        registerVendor,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
