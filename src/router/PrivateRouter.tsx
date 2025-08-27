import { Route } from "react-router-dom";
import { RoutesWithNotFound } from "./RoutesWithNotFound";
import { AppRoutes } from "@/models";

import Home from "@/pages/private/home/HomePage";
import MealPage from "@/pages/private/meal/MealPage";
import SearchPage from "@/pages/private/search/SearchPage";
import OrderHistoryPage from "@/pages/private/order-history/OrderHistoryPage";

export const PrivateRouter = () => {
  return (
    <RoutesWithNotFound>
      <Route path={AppRoutes.private.home} element={<Home />} />
      <Route path={AppRoutes.private.meal} element={<MealPage />} />
      <Route path={AppRoutes.private.search} element={<SearchPage />} />
      <Route
        path={AppRoutes.private.orders_history}
        element={<OrderHistoryPage />}
      />
    </RoutesWithNotFound>
  );
};
