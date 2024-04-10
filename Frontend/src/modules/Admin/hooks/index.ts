import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../axios-Instance";
import { getLoginToken } from "../../../storage";
import { toast } from "react-toastify";
import { successAlert, toastOptions } from "../../../utils";
import { queryKeys } from "../../../react-query/constants";
import { IWeather } from "../../../interface";
import { useState } from "react";
import axios from "axios";

const SERVER_ERROR = "There was an error contacting the server.";

async function addCommodity(formData: any) {
  const data = await axiosInstance({
    url: "/commodity",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });

  return data?.data;
}

export function useAddCommodity() {
  const queryClient = useQueryClient();
  const { mutate, isError, error, isSuccess, reset, data } = useMutation({
    mutationFn: (formData) => addCommodity(formData),
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.commodity]);
      successAlert("Commodity Uploaded Successfully");
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });

  return { mutate, isError, error, isSuccess, reset, data };
}

async function updateCommodity(formData: any) {
  const data = await axiosInstance({
    url: "/commodity",
    method: "PUT",
    data: formData,
  });

  return data?.data;
}

export function useUpdateCommodity() {
  const queryClient = useQueryClient();
  const { mutate, isError, error, isSuccess, reset, data } = useMutation({
    mutationFn: (formData) => updateCommodity(formData),
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.commodity]);
      successAlert("Commodity Updated Successfully");
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });

  return { mutate, isError, error, isSuccess, reset, data };
}

async function deleteCommodity(id: any) {
  const response = await axiosInstance({
    url: `/commodity/${id}`,
    method: "DELETE",
  });

  return response?.data;
}

export function useDeleteCommodity() {
  const queryClient = useQueryClient();
  const { mutate, isError, error, isSuccess, reset } = useMutation({
    mutationFn: (id) => deleteCommodity(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries([queryKeys.commodity]);
      successAlert("Commodity Deleted Successfully");
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

async function getAllCommodity() {
  const data = await axiosInstance({
    url: "/commodity",
    method: "GET",
  });

  return data?.data;
}

export function useGetAllCommodity() {
  const fallback: any[] = [];
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.commodity],
    queryFn: () => getAllCommodity(),
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

async function getCommodityById(id: any) {
  const data = await axiosInstance({
    url: "/commodity/:id",
    method: "GET",
  });

  return data?.data;
}

export function useGetCommodityById(id: any) {
  const fallback = {};
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.commodity],
    queryFn: () => getCommodityById(id),
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

// Endpoints for Market News
async function addNews(formData: any) {
  const data = await axiosInstance({
    url: "/marketnews",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });

  return data?.data;
}

export function useAddNews() {
  const queryClient = useQueryClient();
  const { mutate, isError, error, isSuccess, reset, data } = useMutation({
    mutationFn: (formData) => addNews(formData),
    onSuccess: () => {
      successAlert("Market News Uploaded Successfully");
      queryClient.invalidateQueries([queryKeys.marketnews]);
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });

  return { mutate, isError, error, isSuccess, reset, data };
}

async function updateNews(formData: any, id: any) {
  const data = await axiosInstance({
    url: `/marketnews/${id}`,
    method: "PUT",
    data: formData,
  });

  return data?.data;
}

export function useUpdateNews(id: any) {
  const queryClient = useQueryClient();
  const { mutate, isError, error, isSuccess, reset, data } = useMutation({
    mutationFn: (formData) => updateNews(formData, id),
    onSuccess: () => {
      successAlert("Market News Updated Successfully");
      queryClient.invalidateQueries([queryKeys.marketnews]);
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });

  return { mutate, isError, error, isSuccess, reset, data };
}

async function getAllNews() {
  const data = await axiosInstance({
    url: "/marketnews",
    method: "GET",
  });

  return data?.data;
}

export function useGetAllNews() {
  const fallback = {};
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.marketnews],
    queryFn: () => getAllNews(),
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

async function deleteNews(id: any) {
  const response = await axiosInstance({
    url: `/marketnews/${id}`,
    method: "DELETE",
  });

  return response?.data;
}

export function useDeleteNews() {
  const queryClient = useQueryClient();
  const { mutate, isError, error, isSuccess, reset } = useMutation({
    mutationFn: (id) => deleteNews(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries([queryKeys.marketnews]);
      successAlert("Market News Deleted Successfully");
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

async function getNewsById(id: any) {
  const data = await axiosInstance({
    url: "/market_news/:id",
    method: "GET",
  });

  return data?.data;
}

export function useGetNewsById(id: any) {
  const fallback = {};
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.marketnews],
    queryFn: () => getNewsById(id),
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });
  return data;
}

// Endpoints for Commodity Confiduration
async function addConfiguration(formData: any) {
  const data = await axiosInstance({
    url: "/configuration",
    method: "POST",
    data: formData,
  });

  return data?.data;
}

export function useAddConfiguration() {
  const QueryClient = useQueryClient();
  const { mutate, isError, error, isSuccess, reset, data } = useMutation({
    mutationFn: (formData) => addConfiguration(formData),
    onSuccess: () => {
      QueryClient.invalidateQueries([queryKeys.configuration]);
      successAlert("Configuration Added Successfully");
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });

  return { mutate, isError, error, isSuccess, reset, data };
}

async function updateConfiguration(formData: any) {
  const data = await axiosInstance({
    url: "/configuration",
    method: "PUT",
    data: formData,
  });

  return data?.data;
}

export function useUpdateConfiguration() {
  const QueryClient = useQueryClient();
  const { mutate, isError, error, isSuccess, reset, data } = useMutation({
    mutationFn: (formData) => updateConfiguration(formData),
    onSuccess: () => {
      QueryClient.invalidateQueries([queryKeys.configuration]);
      successAlert("Configuration Updated Successfully");
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });

  return { mutate, isError, error, isSuccess, reset, data };
}
async function deleteConfiguration(id: any) {
  const data = await axiosInstance({
    url: `/configuration/${id}`,
    method: "DELETE",
  });

  return data?.data;
}

export function useDeleteConfiguration() {
  const queryClient = useQueryClient();
  const { mutate, isError, error, isSuccess, reset, data } = useMutation({
    mutationFn: (id) => deleteConfiguration(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries([queryKeys.configuration]);
      successAlert("Configuration Deleted Successfully");
      reset();
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });

  return { mutate, isError, error, isSuccess, reset, data };
}

async function getConfiguration() {
  const data = await axiosInstance({
    url: "/configuration/reporting/config",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });

  return data?.data;
}

export function useGetConfiguration() {
  const fallback = {};
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.configuration],
    queryFn: () => getConfiguration(),
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

// Endpoints for Alerts
async function addAlerts(formData: any, id: any) {
  const data = await axiosInstance({
    url: `/auth/${id}`,
    method: "PATCH",
    data: formData,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });

  return data?.data;
}

export function useAddAlerts(id: any) {
  const QueryClient = useQueryClient();
  const { mutate, isError, error, isSuccess, reset, data } = useMutation({
    mutationFn: (formData) => addAlerts(formData, id),
    onSuccess: () => {
      QueryClient.invalidateQueries([queryKeys.alert]);
      successAlert("Alert Added Successfully");
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });

  return { mutate, isError, error, isSuccess, reset, data };
}

// Endpoints for Notification

async function getAllNotification() {
  const data = await axiosInstance({
    url: "/configuration/get/alert",
    method: "GET",
  });

  return data?.data;
}

export function useGetAllNotification() {
  const fallback = {};
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.notification],
    queryFn: () => getAllNotification(),
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

async function deleteNotification(id: any) {
  const response = await axiosInstance({
    url: `/configuration/get/alert/${id}`,
    method: "DELETE",
  });

  return response?.data;
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const { mutate, isError, error, isSuccess, reset } = useMutation({
    mutationFn: (id) => deleteNotification(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries([queryKeys.notification]);
      successAlert("Notification Deleted Successfully");
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

async function getNotificationById(id: any) {
  const data = await axiosInstance({
    url: `/notification/${id}`,
    method: "GET",
  });

  return data?.data;
}

export function useGetNotificationById(id: any) {
  const fallback = {};
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.notification],
    queryFn: () => getNotificationById(id),
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

async function updateCommodityPrice(formData: any, id: any) {
  const data = await axiosInstance({
    url: `/configuration/${id}`,
    method: "PUT",
    data: formData,
  });

  return data?.data;
}

export function useUpdateCommodityPrice(id: any) {
  const QueryClient = useQueryClient();
  const { mutate, isError, error, isSuccess, reset, data } = useMutation({
    mutationFn: (formData) => updateCommodityPrice(formData, id),
    onSuccess: () => {
      QueryClient.invalidateQueries([queryKeys.configuration]);
      // successAlert("commodity Updated Successfully");
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });

  return { mutate, isError, error, isSuccess, reset, data };
}

async function getWeatherData(position: any) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${position.lat}&lon=${position.long}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function useGetWeatherData(position: any) {
  const fallback = {};
  const [weather, setWeather] = useState();
  const { data = fallback } = useQuery({
    queryKey: ["weather", position],
    queryFn: () => getWeatherData(position),
    onSuccess: (data) => {
      setWeather(data);
    },
    onError: (error: any) => {
      toast.error(SERVER_ERROR, toastOptions);
    },
  });

  return weather;
}

// MArketnewsComment

async function addMarketnewsComment(formData: any) {
  const data = await axiosInstance({
    url: "/marketnews/comment",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });

  return data?.data;
}

export function useAddMarketnewsComment() {
  const queryClient = useQueryClient();
  const { mutate, isError, error, isSuccess, reset, data } = useMutation({
    mutationFn: (formData) => addMarketnewsComment(formData),
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.commodity]);
      successAlert("Comment Added");
    },
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });

  return { mutate, isError, error, isSuccess, reset, data };
}

async function getAllNewsComment(id: string) {
  const data = await axiosInstance({
    url: `/marketnews/${id}/comment`,
    method: "GET",
  });

  return data?.data;
}

export function useGetAllNewsComment(id: any) {
  const fallback: any[] = [];
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.comments],
    queryFn: () => getAllNewsComment(id as any),
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
