import React, { createContext, useContext, useEffect, useState } from "react";
import { MOCK_USERS } from "../mocks/mockUsers";

type User = { id: string; email: string; name?: string; role?: string } | null;

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "ews_user";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión desde localStorage (si existe)
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { localStorage.removeItem(STORAGE_KEY); }
    }
    setLoading(false);
  }, []);

  // LOGIN con mock
  const login = async (email: string, password: string) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500)); // delay fake

    const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found || found.password !== password) {
      setLoading(false);
      throw new Error("Credenciales inválidas");
    }

    const sessionUser = { id: found.id, email: found.email, name: found.name, role: found.role };
    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 200));
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
