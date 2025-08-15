import React, { createContext, useContext, useEffect, useState } from "react";

type User = { email: string; name: string };
type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthContext = createContext<AuthContextType>({} as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Cargar sesión al montar
  useEffect(() => {
    const raw = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  async function login(email: string, password: string, remember = true) {
    // Aquí iría tu llamada real a API. Por ahora aceptamos cualquier par no vacío:
    if (!email || !password) throw new Error("Correo y contraseña requeridos");

    const mockUser: User = { email, name: "Coordinación Académica" };
    // Persistencia: localStorage si “Recordarme”, si no sessionStorage
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("authUser", JSON.stringify(mockUser));
    // Borra del otro storage por si venía de una sesión previa
    (remember ? sessionStorage : localStorage).removeItem("authUser");

    setUser(mockUser);
  }

  function logout() {
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authUser");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
