import React, { useContext } from "react";
import { HStack, Heading, Box, useMediaQuery } from "@chakra-ui/react";
import { useSelectUser } from "../../context/SelectedUser";
import { useGetAllUsers } from "../../hooks/UserInfoHook";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useGetChatRoomId } from "../../hooks/ChatHook";
import SocialProfileWithImage from "../Card/Card";
import { useQueryClient } from "@tanstack/react-query";

const UserModal = () => {
  const { handleSelectUser } = useSelectUser();
  const {
    state: { user_id },
    color,
  } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const { data } = useGetAllUsers(user_id);
  const { mutate } = useGetChatRoomId();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 1025px)")[0];

  const handleClick = (newUser: any) => {
    mutate(
      { sender: user_id, receiver: newUser._id },
      {
        onSuccess: (res) => {
          const payload = {
            id: res.chatRoom._id,
            chatuser_id: newUser._id,
            name: newUser.userInfo
              ? newUser.userInfo.display_name
              : newUser.username,
            profile_picture: newUser.userInfo
              ? newUser.userInfo.profile_picture
              : "",
            type: "chatRoom",
          };
          queryClient.invalidateQueries({ queryKey: ["chatRooms", user_id] });
          handleSelectUser(payload);
          navigate("/");
        },
      }
    );
  };

  return (
    <Box mx={6}>
      <HStack justifyContent="center" my={4}>
        <Heading color={color}>Users</Heading>
      </HStack>
      <HStack gap={4} wrap="wrap" justifyContent={!isMobile ? "start" : "center"}>
        {data &&
          data.users.length > 0 &&
          data.users.map((user: any, index: number) => (
            <SocialProfileWithImage
              data={user}
              onClick={() => handleClick(user)}
              key={index}
            />
          ))}
      </HStack>
    </Box>
  );
};

export default UserModal;
