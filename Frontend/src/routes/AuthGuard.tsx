import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils";
import { useContext, useMemo } from "react";
import { AuthContext } from "../context";
import { Loader } from "../components";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  loggedInUser?: string[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  const loggedInUser = useMemo(() => {
    return user;
  }, [user]);

  if (!isAuthenticated()) {
    return <Navigate to={"/login"} replace />;
  }

  if (!loggedInUser) {
    return <Loader />;
  }

  if (
    allowedRoles &&
    loggedInUser?.role &&
    !allowedRoles.includes(loggedInUser.role)
  ) {
    return <Navigate to="*" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
