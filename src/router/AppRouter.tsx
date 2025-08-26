import { Navigate, Route } from "react-router-dom";
import Login from "@/pages/public/login/Login";
import { PrivateGuard } from "./guard/PrivateGuard";
import { PrivateRouter } from "./PrivateRouter";
import PrivateTest from "@/pages/private/PrivateTest";
import { RoutesWithNotFound } from "./RoutesWithNotFound";
import { AppRoutes } from "@/models";
import ProfilePage from "@/pages/private/profile/ProfilePage";

export const AppRouter = () => {
  return (
    <RoutesWithNotFound>
      <Route
        path={AppRoutes.root}
        element={<Navigate to={AppRoutes.private.home} />}
      />
      <Route path={AppRoutes.login} element={<Login />} />
      <Route path="/test" element={<PrivateTest />} />
      <Route path={AppRoutes.private.profile} element={<ProfilePage />} />
      <Route element={<PrivateGuard />}>
        <Route path={`${AppRoutes.root}*`} element={<PrivateRouter />} />
      </Route>
    </RoutesWithNotFound>
  );
};
