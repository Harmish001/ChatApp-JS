import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/Requests";

type SignupProps = {
  username: string;
  password: string;
};

const getLoggedInUser = async (userid: string) => {
  const response = await axiosInstance.get(`isUserLoggedin/${userid}`);
  return response.data;
};

const postSignup = async (body: SignupProps) => {
  const response = await axiosInstance.post("signup", body);
  return response.data;
};

const postLogin = async (body: SignupProps) => {
  const response = await axiosInstance.post("login", body);
  return response.data;
};

const changeTheme = async (payload: { id: string; color: string }) => {
  const response = await axiosInstance.get(
    `color/change/${payload.id}/${payload.color}`
  );
  return response.data;
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (payload: SignupProps) => postSignup(payload),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: SignupProps) => postLogin(payload),
  });
};

export const useUserLoggedIn = (userId: string, onError: any) => {
  return useQuery({
    queryKey: ["isUserLoggedin"],
    queryFn: () => getLoggedInUser(userId),
    staleTime: Infinity,
    gcTime: Infinity,
    throwOnError: onError,
    retry: false,
    enabled: userId.length > 0,
  });
};

export const useUpdateTheme = () => {
  return useMutation({
    mutationFn: (payload: { id: string; color: string }) =>
      changeTheme(payload),
  });
};
