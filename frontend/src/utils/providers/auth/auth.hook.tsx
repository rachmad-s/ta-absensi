import React from "react";
import { AuthContext } from "./auth.context";

export const useAuth = () => {
  return React.useContext(AuthContext);
};
