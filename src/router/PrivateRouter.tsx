import { Route } from "react-router-dom";
import { RoutesWithNotFound } from "./RoutesWithNotFound";
import { AppRoutes } from "@/models";

import Home from "@/pages/private/home/HomePage";
import MealPage from "@/pages/private/meal/MealPage";

export const PrivateRouter = () => {
  return (
    <RoutesWithNotFound>
      <Route path={AppRoutes.private.home} element={<Home />} />
      <Route path={AppRoutes.private.meal} element={<MealPage />} />
    </RoutesWithNotFound>
  );
};
