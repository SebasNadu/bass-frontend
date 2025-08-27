import { Route } from "react-router-dom";
import { RoutesWithNotFound } from "./RoutesWithNotFound";
import { AppRoutes } from "@/models";

import Home from "@/pages/private/home/HomePage";
import MealPage from "@/pages/private/meal/MealPage";
import SearchPage from "@/pages/private/search/SearchPage";
import ProfilePage from "@/pages/private/profile/ProfilePage";
import CartPage from "@/pages/private/cart/CartPage";

export const PrivateRouter = () => {
  return (
    <RoutesWithNotFound>
      <Route path={AppRoutes.private.home} element={<Home />} />
      <Route path={AppRoutes.private.meal} element={<MealPage />} />
      <Route path={AppRoutes.private.search} element={<SearchPage />} />
      <Route path={AppRoutes.private.profile} element={<ProfilePage />} />
      <Route path={AppRoutes.private.cart} element={<CartPage />} />{" "}
    </RoutesWithNotFound>
  );
};
