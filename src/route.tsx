import { RouteObject, createBrowserRouter } from "react-router-dom";
import IndexPage from "./views/IndexPage";
import ErrorPage from "./views/error/ErrorPage";
import NotFound from "./views/error/NotFound";
import RegisterPage from "./views/RegisterPage";
import CapturePage from "./views/CapturePage";


const routes: RouteObject[] = [
  {
    path: '/',
    element: <IndexPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/capture',
    element: <CapturePage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/capture/:walletAddress',
    element: <CapturePage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/register',
    element: <RegisterPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '*', 
    element: <NotFound />,
  },
];

const router = createBrowserRouter(routes);

export default router;