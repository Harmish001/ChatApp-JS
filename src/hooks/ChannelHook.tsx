import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/Requests";

const fetchChannels = async (id: string) => {
  const response = await axiosInstance.get(`/get/channels/${id}`);
  return response.data;
};

const fetchChannelMessages = async (id: string) => {
  const response = await axiosInstance.get(`/channel/messages/${id}`);
  return response.data;
};

const postChannelMessage = async (body: any) => {
  const response = await axiosInstance.post(`/channel/message`, body);
  return response.data;
};

export const useGetChannels = ({ id, queryKey }: any) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: () => fetchChannels(id),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: id && id.length > 0,
  });
};

export const useGetChannelMessages = ({ id, queryKey }: any) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: () => fetchChannelMessages(id),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: id && id.length > 0,
  });
};

export const usePostChannelMessage = () => {
  return useMutation({
    mutationFn: (payload: any) => postChannelMessage(payload),
  });
};
