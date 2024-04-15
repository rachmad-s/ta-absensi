import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/providers/auth/auth.hook";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};
