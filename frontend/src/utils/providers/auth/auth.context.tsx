import React from "react";
import { LoginResponse } from "../../api/auth.api";

export interface AuthCtx {
  user: LoginResponse | null;
  saveUser: (data: LoginResponse) => void;
  removeUser: () => void;
}

export const AuthContext = React.createContext<AuthCtx>({
  user: null,
  saveUser: () => {},
  removeUser: () => {},
});
