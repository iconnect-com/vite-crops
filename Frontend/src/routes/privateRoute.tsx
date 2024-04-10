import { Navigate, Route } from "react-router-dom";
import React, { lazy, useContext } from "react";
import { AuthContext } from "../context";
import { Loader } from "../components";

interface PrivateRouteProps {
  path: string;
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ path, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role as string)) {
    return <Navigate to="/unauthorized" replace />;
  }

  const LazyComponent = lazy(() =>
    user.role === "SuperAdmin"
      ? import("../modules/SuperAdmin")
      : user.role === "Admin"
      ? import("../modules/Admin")
      : import("../modules/User")
  );

  return (
    <Route
      path={path}
      element={
        <React.Suspense fallback={<Loader />}>
          <LazyComponent />
        </React.Suspense>
      }
    />
  );
};

export default PrivateRoute;
