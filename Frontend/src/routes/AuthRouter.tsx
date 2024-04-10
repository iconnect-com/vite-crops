import { lazy, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "../context";
import React from "react";
import { Loader } from "../components";

const paths = [
  {
    path: "/",
    element: lazy(() => import("../modules/Home")),
  },
  {
    path: "/create-account",
    element: lazy(() => import("../modules/Auth/User/Registration")),
  },
  {
    path: "/login",
    element: lazy(() => import("../modules/Auth/User/Login")),
  },
  {
    path: "/resetpassword",
    element: lazy(() => import("../modules/Auth/User/ResetPassword")),
  },
  {
    path: "/change-password",
    element: lazy(() => import("../modules/Auth/User/NewPassword")),
  },
  {
    path: "*",
    element: lazy(() => import("../modules/NotFound")),
  },

  // Admins
  {
    path: "/admin/login",
    element: lazy(() => import("../modules/Auth/Admin/Login")),
  },
  {
    path: "/admin/reset-password",
    element: lazy(() => import("../modules/Auth/Admin/ResetPassword")),
  },
  {
    path: "/resetpassword/:id",
    element: lazy(() => import("../modules/Auth/Admin/NewPassword")),
  },

  {
    path: "/admin/change-password",
    element: lazy(() => import("../modules/Auth/Admin/NewPassword")),
  },
];

function Auth() {
  const { user } = useContext(AuthContext);
  if (user) {
    let Dashboard;
    let navigateTo;
    if (user.role === "SuperAdmin") {
      Dashboard = lazy(() => import("../modules/SuperAdmin"));
      navigateTo = "/s-admin/dashboard";
    } else if (user.role === "Admin") {
      Dashboard = lazy(() => import("../modules/Admin"));
      navigateTo = "/app/dashboard";
    } else {
      Dashboard = lazy(() => import("../modules/User"));
      navigateTo = "/user/dashboard";
    }

    return (
      <React.Suspense fallback={<Loader />}>
        <Dashboard />
        <Navigate to={navigateTo} replace />
      </React.Suspense>
    );
  }

  return (
    <Routes>
      {paths.map(({ path, element: Element }) => (
        <Route key={path} path={path} element={<Element />} />
      ))}
    </Routes>
  );
}

export default Auth;
