import React from "react";
import { useNavigate } from "react-router-dom";
import { LoginResponse } from "../../api/auth.api";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { AuthContext } from "./auth.context";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useLocalStorage<LoginResponse | null>(
    "authentication",
    null
  );
  const navigate = useNavigate();

  const saveUser = (data: LoginResponse) => {
    setUser(data);
    navigate("/dashboard");
  };

  const removeUser = () => {
    setUser(null);
    navigate("/login", { replace: true });
  };

  const value = React.useMemo(
    () => ({
      user,
      saveUser,
      removeUser,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
