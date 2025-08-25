import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";

// Lazy-loaded example
const AboutPage = React.lazy(() => import("@/pages/AboutPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // Layout wrapper
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
    ],
  },
]);
