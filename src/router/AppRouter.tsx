import { BrowserRouter, Navigate, Route } from "react-router-dom";
import Login from "@/pages/public/login/Login";
import { PrivateGuard } from "./guard/PrivateGuard";
import { PrivateRouter } from "./PrivateRouter";
import { RoutesWithNotFound } from "./RoutesWithNotFound";
import { AppRoutes } from "@/models";

import Home from "@/pages/private/home/HomePage";
import MealPage from "@/pages/private/meal/MealPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <RoutesWithNotFound>
        <Route path="/" element={<Navigate to={AppRoutes.private.home} />} />
        <Route path={AppRoutes.private.home} element={<Home />} />
        <Route path={AppRoutes.private.meal} element={<MealPage />} />
        <Route path={AppRoutes.login} element={<Login />} />
        <Route element={<PrivateGuard />}>
          <Route
            path={`${AppRoutes.private.home}/*`}
            element={<PrivateRouter />}
          />
        </Route>
      </RoutesWithNotFound>
    </BrowserRouter>
  );
};
