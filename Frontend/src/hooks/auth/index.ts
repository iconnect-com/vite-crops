import { useContext } from "react";
import { AuthContext } from "../../context";
import { getLoginToken, setLoginToken } from "../../storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userProps } from "../../interface";
import { errorAlert, successAlert, toastOptions } from "../../utils";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-Instance";
import { queryKeys } from "../../react-query/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SERVER_ERROR = "There was an error contacting the server.";

async function userLogin(formData: userProps) {
  const data = await axiosInstance({
    url: "/auth/login",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data.data;
}

export function useLogin() {
  const authCtx = useContext(AuthContext);
  return useMutation({
    mutationFn: async (formData) => {
      const data = await axiosInstance({
        url: "/auth/login",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data.data;
    },
    onSuccess: (data) => {
      successAlert("Login Successful");
      setLoginToken(data.token);
      authCtx.authenticate(data.token);
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });
}

async function userRegister(formData: any) {
  const data = await axiosInstance({
    url: "/auth/user/create",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data?.data;
}

export function useRegister() {
  const navigate = useNavigate();
  const { mutate, isError, error, isSuccess, reset } = useMutation({
    mutationFn: (formData) => userRegister(formData as any),
    onSuccess: (data) => {
      navigate(`/login`);
      successAlert("Registration Successful");
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });
  return { mutate, isError, error, isSuccess, reset };
}

async function forgotPassword(formData: any) {
  const data = await axiosInstance({
    url: "/auth/forgotpassword",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data?.data;
}

export function useForgotPassword() {
  const navigate = useNavigate();
  const { mutate, isError, error, isSuccess, reset } = useMutation({
    mutationFn: (formData) => forgotPassword(formData as any),
    onSuccess: (data) => {
      navigate(`/login`);
      successAlert("Check your Mailbox for instructions");
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });
  return { mutate, isError, error, isSuccess, reset };
}

async function registerAdmin(formData: any) {
  const data = await axiosInstance({
    url: "/auth/admin/create",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data?.data;
}

export function useRegisterAdmin() {
  const navigate = useNavigate();
  const { mutate, isError, error, isSuccess, reset } = useMutation({
    mutationFn: (formData) => registerAdmin(formData as any),
    onSuccess: (data) => {
      successAlert("Admin Registration Successful");
      navigate(`/login`);
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });
  return { mutate, isError, error, isSuccess, reset };
}

async function updateMe(formData: any) {
  const data = await axiosInstance({
    url: "/auth/me",
    method: "PUT",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });

  return data?.data;
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  const { mutate, isError, error, isSuccess, reset, data } = useMutation({
    mutationFn: (formData) => updateMe(formData as any),
    onSuccess: (data) => {
      queryClient.invalidateQueries([queryKeys.me]);
    },

    onError: (error) => {
      errorAlert(error);
    },
  });
  return { mutate, isError, error, isSuccess, reset, data };
}

async function uploadProfile(id: any, formData: any) {
  try {
    const response = await axiosInstance.put(`/auth/${id}/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getLoginToken()}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export function useUploadProfile(id: any) {
  const queryClient = useQueryClient();
  const { mutate, isError, error, isSuccess, reset, data } = useMutation({
    mutationFn: (formData) => uploadProfile(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.user]);
      successAlert("Profile picture uploaded Successful");
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });

  // Return a promise that resolves when the mutation is successful
  const uploadProfilePromise = (formData: any) => {
    return new Promise((resolve, reject) => {
      mutate(formData, {
        onSuccess: () => {
          resolve(data);
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  return {
    mutate,
    isError,
    error,
    isSuccess,
    reset,
    data,
    uploadProfilePromise,
  };
}

async function getMe() {
  const data = await axiosInstance({
    url: "/auth/me",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });

  return data?.data;
}

export function useGetMe() {
  const fallback = {};
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.user],
    queryFn: () => getMe(),
    onSuccess: () => {},
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });
  return data;
}

async function deleteUser(id: any) {
  const response = await axiosInstance({
    url: `/auth/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });

  return response?.data;
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { mutate, isError, error, isSuccess, reset } = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries([queryKeys.users]);
      successAlert("User Deleted Successfully");
      reset();
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });
  return { mutate, isError, error, isSuccess, reset };
}

async function changePassword(formData: any, id: any) {
  const data = await axiosInstance({
    url: `/auth/resetpassword/${id}`,
    method: "PUT",
    data: formData,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data?.data;
}

export function useChangePassword(id: any) {
  const { mutate, isError, error, isSuccess, reset } = useMutation({
    mutationFn: (formData) => changePassword(formData as any, id as any),
    onSuccess: (data) => {
      successAlert("Password Changed Successfully");
      reset();
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });
  return { mutate, isError, error, isSuccess, reset };
}

async function getAllUser() {
  const data = await axiosInstance({
    url: "/auth/user",
    method: "GET",
  });

  return data?.data;
}

export function useGetAllUsers() {
  const fallback = {};
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.users],
    queryFn: () => getAllUser(),
    onSuccess: () => {},
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });
  return data;
}

async function getRegUser() {
  const data = await axiosInstance({
    url: "/auth/GetRegisteredUser",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });

  return data?.data;
}

export function useGetRegisteredUsers() {
  const fallback = {};
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.usersRole],
    queryFn: () => getRegUser(),
    onSuccess: () => {},
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });
  return data;
}

async function getUserById(id: any) {
  const data = await axiosInstance({
    url: "/auth/:id",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });
  return data?.data;
}

export function useGetUserById(id: any) {
  const fallback: any[] = [];
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.user, id],
    queryFn: () => getUserById(id),
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });
  return data;
}

async function getUser() {
  const data = await axiosInstance({
    url: "/auth/user",
    method: "GET",
  });

  return data?.data;
}

export function useGetAllUser() {
  const fallback = {};
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.users],
    queryFn: () => getUser(),
    onSuccess: () => {},
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });
  return data;
}

async function DelUserById(id: any) {
  const data = await axiosInstance({
    url: `/auth/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });

  return data?.data;
}

export function useDelUserById() {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, reset, isError, error } = useMutation({
    mutationFn: (id) => DelUserById(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries([queryKeys.users]);
    },
  });
  return { mutate, isSuccess, reset, isError, error };
}

// Api for conversion rate of currency
async function getExchangeRate(currencyCode = "") {
  const response = await axios.get(
    `https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_CURRENCY_API_KEY}/latest/${currencyCode}`
  );

  return response.data;
}

export function useGetExchangeRate(currencyCode: string) {
  const fallback = {};
  const { data = fallback, error } = useQuery(
    ["exchangeRate", currencyCode],
    () => getExchangeRate(currencyCode)
  );

  if (error) {
    // Handle error here
  }

  return data;
}
