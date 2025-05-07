import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./stores/useAuthStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) return <Navigate to="/sign-in" state={{ from: location }} replace />;
  return <>{children}</>;
}
