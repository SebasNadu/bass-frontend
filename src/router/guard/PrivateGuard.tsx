import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AppRoutes } from "@/models";

export const PrivateGuard = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={AppRoutes.login} replace />
  );
};
