import { Fragment, lazy, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "../context";
import { PublicPaths } from "./path";

const privateRoutes = [
  {
    path: "/dashboard",
    element: lazy(() => import("../modules/Admin/")),
  },
  {
    path: "/profile",
    element: lazy(() => import("../modules/Admin/Profile")),
  },
  {
    path: "/configuration",
    element: lazy(() => import("../modules/Admin/Configuration")),
  },
  {
    path: "/users",
    element: lazy(() => import("../modules/Admin/Users")),
  },
  {
    path: "/reporting",
    element: lazy(() => import("../modules/Admin/Reporting")),
  },
  {
    path: "/configuration/price-history",
    element: lazy(
      () => import("../modules/Admin/Configuration/screens/AllPricing")
    ),
  },
  {
    path: "/configuration/market-news",
    element: lazy(
      () => import("../modules/Admin/Configuration/screens/AllNews")
    ),
  },
  {
    path: "/configuration/market-news/:id",
    element: lazy(
      () => import("../modules/Admin/Configuration/forms/EditNews")
    ),
  },
  {
    path: "/configuration/commodity",
    element: lazy(
      () => import("../modules/Admin/Configuration/screens/AllCommodity")
    ),
  },
  {
    path: "*",
    element: lazy(() => import("../modules/NotFound")),
  },
];

function AdminRouter() {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to={`${PublicPaths.LOGIN}`} replace />;
  }

  return (
    <Routes>
      {privateRoutes.map(({ path, element: Element }) => (
        <Fragment key={path}>
          <Route key={path} path={path} element={<Element />}></Route>
        </Fragment>
      ))}
    </Routes>
  );
}

export default AdminRouter;
