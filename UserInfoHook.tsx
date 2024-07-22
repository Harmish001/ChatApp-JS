import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/Requests";

type UserInfoProps = {
  display_name?: string;
  contact?: string;
  email?: string;
  profile_picture?: string;
  username: string;
};

const getAllUsers = async (user_id: string) => {
  const response = await axiosInstance.get(`users/${user_id}`);
  return response.data;
};

const postUserInfo = async (body: UserInfoProps) => {
  const response = await axiosInstance.post("addUserInfo", body);
  return response.data;
};

const updateUserInfo = async (body: UserInfoProps) => {
  const response = await axiosInstance.put("updateUserInfo", body);
  return response.data;
};

const fetchUserInfo = async (username: string) => {
  const response = await axiosInstance.get(`getUserInfo/${username}`);
  return response.data;
};

const fetchUsers = async (id: string) => {
  const response = await axiosInstance.get(`/get/chat/rooms/${id}`);
  return response.data;
};

export const useGetAllUsers = (user_id: string) => {
  return useQuery({
    queryKey: ["allusers"],
    queryFn: () => getAllUsers(user_id),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useFetchUserInfo = (username: string, queryKey: any) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: () => fetchUserInfo(username),
  });
};

export const usePostUserInfo = () => {
  return useMutation({
    mutationFn: (payload: UserInfoProps) => postUserInfo(payload),
  });
};

export const useUpdateUserInfo = () => {
  return useMutation({
    mutationFn: (payload: UserInfoProps) => updateUserInfo(payload),
  });
};

export const useGetUsers = ({ id, queryKey }: any) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: () => fetchUsers(id),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: id && id.length > 0,
  });
};
