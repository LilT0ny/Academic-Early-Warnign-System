/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "admin" | "teacher" | "specialist";

type Permission =
  | "user.read" | "user.create" | "user.delete"
  | "alerts.read" | "alerts.resolve"
  | "students.read"
  | "appointments.read" | "appointments.create" | "appointments.cancel"
  | "reports.read" | "reports.generate" | "reports.schedule"
  | "settings.read" | "settings.update"
  | "profile.read" | "profile.update";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const ROLE_PERMS: Record<Role, Permission[]> = {
  admin: [
    "user.read","user.create","user.delete",
    "alerts.read","alerts.resolve",
    "students.read",
    "appointments.read","appointments.create","appointments.cancel",
    "reports.read","reports.generate","reports.schedule",
    "settings.read","settings.update",
    "profile.read","profile.update",
  ],
  teacher: [
    "alerts.read",
    "students.read",
    "appointments.read","appointments.create","appointments.cancel",
    "reports.read","reports.generate",
    "profile.read","profile.update",
  ],
  specialist: [
    "alerts.read","alerts.resolve",
    "students.read",
    "appointments.read","appointments.create","appointments.cancel",
    "reports.read",
    "profile.read","profile.update",
  ],
};

interface AuthContextValue {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (perm: Permission) => boolean;
  isRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    // mock persistencia
    const raw = localStorage.getItem("mock_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login = async (email: string, _password: string) => {
    // MOCK: elige rol según email
    const role: Role =
      email.includes("admin") ? "admin" :
      email.includes("esp") || email.includes("spec") ? "specialist" :
      "teacher";
    const mock: AppUser = {
      id: crypto.randomUUID(),
      name: email.split("@")[0],
      email,
      role,
    };
    setUser(mock);
    localStorage.setItem("mock_user", JSON.stringify(mock));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("mock_user");
    window.location.href = "/login";
  };

  const hasPermission = (perm: Permission) => {
    if (!user) return false;
    return ROLE_PERMS[user.role].includes(perm);
  };

  const isRole = (...roles: Role[]) => !!user && roles.includes(user.role);

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, isRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
