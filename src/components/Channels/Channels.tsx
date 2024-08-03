import React, { useContext } from "react";
import { HStack, Heading, Box, useMediaQuery } from "@chakra-ui/react";
import { useSelectUser } from "../../context/SelectedUser";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useAddParticipant, useGetAllChannels } from "../../hooks/ChannelHook";
import { useQueryClient } from "@tanstack/react-query";
import ChannelCard from "./ChannelCard";

const Channels = () => {
  const { handleSelectUser } = useSelectUser();
  const {
    state: { user_id },
    color,
  } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { data } = useGetAllChannels();
  const { mutate } = useAddParticipant();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 1025px)")[0];

  const handleClick = (channel: any) => {
    const payload = {
      channel_id: channel._id,
      participants: [user_id],
    };
    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["channels", user_id] });
        const data = {
          id: channel._id,
          name: channel.channel_name,
          isLock: channel.is_private,
        };
        handleSelectUser(data);
        navigate("/");
      },
    });
  };

  return (
    <Box mx={4}>
      <HStack justifyContent="center" my={4}>
        <Heading color={color}>Channels</Heading>
      </HStack>
      <HStack
        gap={4}
        wrap="wrap"
        justifyContent={!isMobile ? "start" : "center"}
      >
        {data &&
          data.channels.length > 0 &&
          data.channels.map((channel: any, index: number) => {
            return (
              <ChannelCard
                data={channel}
                handleClick={handleClick}
                key={index}
              />
            );
          })}
      </HStack>
    </Box>
  );
};

export default Channels;
