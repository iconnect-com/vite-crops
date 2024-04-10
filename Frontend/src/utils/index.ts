import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { getLoginToken } from "../storage";
import { IDecodedUser } from "../interface";
// import { AxiosError } from "axios";

const SERVER_ERROR = "There was an error contacting the server.";

export const getDecodedJWT = () => {
  try {
    const token = getLoginToken();
    const decoded = jwtDecode<IDecodedUser>(token);

    return decoded;
  } catch (e) {
    return null;
  }
};

export const isAuthenticated = () => {
  try {
    const decode = getDecodedJWT();
    if (decode) {
      const { exp } = decode;
      const currentTime = Date.now() / 1000;
      return exp > currentTime;
    }
    return false;
  } catch (e) {
    return false;
  }
};

export const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 3000,
  draggable: false,
  pauseOnHover: true,
  style: {
    zIndex: "9999",
    backgroundColor: "#fff",
    color: "#000",
  },
  hideProgressBar: true,
};

export const successAlert = (msg: string) => {
  toast.success(msg || "Successfully created", toastOptions);
};
export const errorAlert = (error: any) => {
  const err =
    error?.response?.data?.message ||
    error?.response?.data?.msg ||
    error?.response?.data?.error
      ? error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.response?.data?.error
      : error
      ? error
      : SERVER_ERROR;
  return err;
  //   toast.error(err, toastOptions);
};

export const toastClipboard = {
  position: toast.POSITION.TOP_CENTER,
  draggable: false,
  pauseOnHover: false,
  closeOnClick: true,
  autoClose: 2000,

  style: {
    backgroundColor: "#fff",
    color: "#000",
    zIndex: "success",
  },
  hideProgressBar: true,
};

export const clipBoard = (msg: string) => {
  toast.info(msg || "Link copied to clipboard!", toastClipboard);
};

export const infoAlert = (msg: string) => {
  toast.info(msg || "Info Notification !", toastOptions);
};
