import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/endpoints";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("fitsuite_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let mounted = true;

    authApi
      .getMe()
      .then(({ data }) => {
        if (!mounted) return;
        const currentUser = data.data || data.user || data;
        setUser(currentUser);
        localStorage.setItem("fitsuite_user", JSON.stringify(currentUser));
      })
      .catch(() => {
        localStorage.removeItem("fitsuite_user");
        setUser(null);
      })
      .finally(() => mounted && setBooting(false));

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (credentials) => {
    await authApi.login(credentials);
    const { data } = await authApi.getMe();
    const currentUser = data.data || data.user || data;
    setUser(currentUser);
    localStorage.setItem("fitsuite_user", JSON.stringify(currentUser));
    return currentUser;
  };

  const updateUser = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem("fitsuite_user", JSON.stringify(nextUser));
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem("fitsuite_user");
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      booting,
      isAuthenticated: Boolean(user),
      login,
      logout,
      updateUser,
    }),
    [user, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
