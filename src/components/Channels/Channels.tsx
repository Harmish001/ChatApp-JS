import React, { useContext } from "react";
import {
  CardHeader,
  Card,
  CardBody,
  Image,
  HStack,
  Heading,
  Box,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useSelectUser } from "../../context/SelectedUser";
import { useGetAllUsers } from "../../hooks/UserInfoHook";
import { EMPTY_AVATAR_IMAGE } from "../../Constants";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getFontColor, getHoverColor } from "../Room/Room";
import { useAddParticipant, useGetAllChannels } from "../../hooks/ChannelHook";
import { UnlockIcon } from "@chakra-ui/icons";
import { LockIcon } from "@chakra-ui/icons";
import { useQueryClient } from "@tanstack/react-query";
import ChannelCard from "./ChannelCard";

const Channels = () => {
  const { handleSelectUser } = useSelectUser();
  const {
    state: { user_id },
    activeUsers,
    color,
  } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { data } = useGetAllChannels();
  const { mutate } = useAddParticipant();
  const navigate = useNavigate();

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
      <HStack gap={4}>
        {data &&
          data.channels.length > 0 &&
          data.channels.map((channel: any, index: number) => {
            const { channel_name, _id } = channel;
            return (
              <ChannelCard data={channel} handleClick={handleClick}/>
              // <Card
              //   key={index}
              //   minWidth={300}
              //   cursor="pointer"
              //   onClick={() => handleClick(channel)}
              //   borderRadius={12}
              //   _hover={{
              //     bgColor: getHoverColor(color),
              //     color: getFontColor(color),
              //   }}
              // >
              //   <CardBody>
              //     <HStack justifyContent="start" alignItems="center">
              //       {!channel.is_private ? (
              //         <UnlockIcon w={6} h={6} />
              //       ) : (
              //         <LockIcon w={6} h={6} />
              //       )}
              //       <VStack gap={0} alignItems="start">
              //         <CardHeader pt={0} pb={1} pl={2}>
              //           <Text
              //             fontSize="large"
              //             fontWeight={500}
              //             _hover={{ color: getFontColor(color) }}
              //           >
              //             {channel_name}
              //           </Text>
              //         </CardHeader>
              //         {/* {activeUsers.length > 0 && activeUsers.includes(_id) && (
              //           <Badge variant="solid" colorScheme="green">
              //             active
              //           </Badge>
              //         )} */}
              //       </VStack>
              //     </HStack>
              //   </CardBody>
              // </Card>
            );
          })}
      </HStack>
    </Box>
  );
};

export default Channels;
