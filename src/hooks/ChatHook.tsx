import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/Requests";

const fetchChat = async (id: string) => {
  const response = await axiosInstance.get(`/get/chat/${id}`);
  return response.data;
};

const updateChat = async (body: any) => {
  const response = await axiosInstance.put(`/update/chat`, body);
  return response.data;
};

const postChat = async (body: any) => {
  const response = await axiosInstance.post(`/add/chat`, body);
  return response.data;
};

const addBackground = async (body: any) => {
  const response = await axiosInstance.post(`/set/backgrund`, body);
  return response.data;
};

export const useGetChat = ({ id, queryKey }: any) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: () => fetchChat(id),
    enabled: id != null,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export const useUpdateChat = () => {
  return useMutation({
    mutationFn: (payload: any) => updateChat(payload),
  });
};

export const useAddNewChat = () => {
  return useMutation({
    mutationFn: (payload: any) => postChat(payload),
  });
};

export const useAddBackground = () => {
  return useMutation({
    mutationFn: (payload: any) => addBackground(payload),
  });
};
