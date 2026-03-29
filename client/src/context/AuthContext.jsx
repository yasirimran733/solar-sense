/* eslint-disable react-refresh/only-export-components -- context + hook pattern */
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(readStoredUser);

  const isAuthenticated = Boolean(token);

  const login = useCallback((nextToken, nextUser) => {
    const safe =
      nextUser && typeof nextUser === "object"
        ? { username: nextUser.username }
        : { username: nextUser };
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(safe));
    setToken(nextToken);
    setUser(safe);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      login,
      logout,
    }),
    [token, user, isAuthenticated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
