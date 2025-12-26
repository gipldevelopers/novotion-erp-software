"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // simulate auth check
    setTimeout(() => {
      setUser({
        name: "Sheshan",
        email: "sheshan@novotion.com",
        systemRole: "EMPLOYEE", // Default role
        employee: {
          firstName: "Sheshan",
          lastName: "User",
          id: "EMP001"
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 👇 THIS IS IMPORTANT
export function useAuth() {
  return useContext(AuthContext);
}
