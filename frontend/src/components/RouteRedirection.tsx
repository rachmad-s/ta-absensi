import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/providers/auth/auth.hook";

export default function RouteRedirect() {
  const auth = useAuth();
  const user = auth?.user;

  if (user) return <Navigate to={"/dashboard"} />;

  return <Navigate to={"/login"} />;
}
