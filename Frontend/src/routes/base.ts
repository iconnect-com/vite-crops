import { lazy } from "react";

const BaseRoutes = [
  {
    path: "/*",
    component: lazy(() => import("./AuthRouter")),
    useAuth: false,
  },
  {
    path: "/s-admin/*",
    component: lazy(() => import("./SuperAdminRouter")),
    useAuth: true,
    allowedRoles: ["SuperAdmin"],
    exact: true,
  },
  {
    path: "/app/*",
    component: lazy(() => import("./AdminRouter")),
    useAuth: true,
    allowedRoles: ["Admin"],
    exact: true,
  },
  {
    path: "/user/*",
    component: lazy(() => import("./UserRouter")),
    useAuth: true,
    allowedRoles: ["User"],
    exact: true,
  },
  {
    path: "/not-authorized/*",
    component: lazy(() => import("../modules/NotAuthorized")),
    useAuth: false,
    allowedRoles: ["Admin", "User", "SuperAdmin"],
  },
  {
    path: "*",
    component: lazy(() => import("../modules/NotFound")),
    useAuth: false,
  },
];

export default BaseRoutes;
