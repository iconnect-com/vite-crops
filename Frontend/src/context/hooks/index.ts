import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../react-query/constants";
import { useContext } from "react";
import { AuthContext } from "../../context";
import { getLoginToken, setStoredUser } from "../../storage";
import { errorAlert, isAuthenticated } from "../../utils";
import { axiosInstance } from "../../axios-Instance";

// const SERVER_ERROR = "There was an error contacting the server.";

const userProfile = async () => {
  const data = await axiosInstance({
    url: "/auth/me",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });
  return data?.data?.data;
};

export function useAuthenticatedUser() {
  const authCtx = useContext(AuthContext);
  const fallback = undefined;
  const { data = fallback } = useQuery({
    enabled: isAuthenticated(),
    queryKey: [queryKeys.user],
    queryFn: () => userProfile(),
    onSuccess: (data: any) => {
      authCtx.updateUser(data);
      setStoredUser(data);
    },
    onError: (error: any) => {
      authCtx.logout();
      // const err = error?.response?.data?.error
      //   ? error?.response?.data?.error
      //   : SERVER_ERROR;

      // errorAlert(err);
    },
  });
  return data;
}
