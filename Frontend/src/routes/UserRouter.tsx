import { Fragment, lazy, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PublicPaths } from "./path";
import { AuthContext } from "../context";

const privateRoutes = [
  {
    path: "/dashboard",
    element: lazy(() => import("../modules/User")),
  },
  {
    path: "/profile",
    element: lazy(() => import("../modules/User/profile")),
  },
  {
    path: "/market-news",
    element: lazy(() => import("../modules/User/MarketNews")),
  },
  {
    path: "/notifications",
    element: lazy(() => import("../modules/User/Notification")),
  },
  {
    path: "/*",
    element: lazy(() => import("../modules/NotFound")),
  },
];

function UserRouter() {
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

export default UserRouter;
