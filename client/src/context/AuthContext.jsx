import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const USER_KEY = 'northstar_user';

const saveUser = (u) => {
  if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
  else localStorage.removeItem(USER_KEY);
};

const loadUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); }
  catch { return null; }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);   // ← instantly restore from cache
  const [loading, setLoading] = useState(true);

  // Silently verify the cookie with the server on every mount
  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        setUser(res.data);
        saveUser(res.data);
      })
      .catch(() => {
        // Cookie is gone / expired — clear cache and kick to login
        setUser(null);
        saveUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data);
    saveUser(res.data);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    setUser(res.data);
    saveUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    saveUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
