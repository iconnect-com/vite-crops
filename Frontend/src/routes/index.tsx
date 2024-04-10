import { Routes, Route, BrowserRouter } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import BaseRoutes from "./base";
import { Fragment, Suspense, useContext } from "react";
import { Loader } from "../components";
import NotFound from "../modules/NotFound";
import { AuthContext } from "../context";

interface RouteConfig {
  path: string;
  exact?: boolean;
  component: React.ComponentType;
  useAuth: boolean;
  allowedRoles?: string[];
}

const RoutesWrapper = () => {
  // const { role } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Routes>
        {(BaseRoutes as RouteConfig[]).map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Fragment>
                <Suspense fallback={<Loader />}>
                  {route.useAuth ? (
                    <AuthGuard allowedRoles={route.allowedRoles}>
                      <route.component />
                    </AuthGuard>
                  ) : (
                    <route.component />
                  )}
                </Suspense>
              </Fragment>
            }
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesWrapper;
