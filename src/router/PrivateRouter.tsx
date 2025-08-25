import { Route } from "react-router-dom";
import Home from "@/pages/private/home/Home";
import { RoutesWithNotFound } from "./RoutesWithNotFound";
import { AppRoutes } from "@/models";

export const PrivateRouter = () => {
  return (
    <RoutesWithNotFound>
      <Route path={AppRoutes.private.home} element={<Home />} />
    </RoutesWithNotFound>
  );
};
