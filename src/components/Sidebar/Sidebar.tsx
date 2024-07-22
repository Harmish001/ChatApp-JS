import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
  Input,
  Button,
  useColorModeValue,
  Badge,
  useToast,
  keyframes,
  HStack,
} from "@chakra-ui/react";
import { useGetUsers } from "../../hooks/UserInfoHook";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useSelectUser } from "../../context/SelectedUser";
import { socket } from "../../providers/Routes";
import { getFontColor, getHoverColor } from "../Room/Room";

// const pulseAnimation = keyframes`
//   0% { transform: scale(1); }
//   50% { transform: scale(1.05); }
//   100% { transform: scale(1); }
// `;

// export const fadeIn = keyframes`
//   0% { opacity: 0.5; }
//   50% { opacity: 0.75; }
//   100% { opacity: 1; }
// `;

export const getuseId = () => {
  return localStorage.getItem("user_id") || "";
};

const ChatSidebar = () => {
  const {
    state: { user_id },
    activeUsers,
    color,
  } = useContext(AuthContext);
  const { state, setActiveUsers } = useContext(AuthContext);
  const { handleSelectUser } = useSelectUser();
  const toast = useToast();
  const navigate = useNavigate();

  const { data: usersData } = useGetUsers({
    id: user_id,
    queryKey: ["chatRooms", user_id],
  });

  useEffect(() => {
    const user: any = localStorage.getItem("selected-user");
    if (user != null) {
      const data = JSON.parse(user);
      handleSelectUser(data);
    }
  }, []);

  useEffect(() => {
    socket.emit("login", state.user_id);
    socket.on("updateOnlineUsers", (users: any) => {
      setActiveUsers(users);
    });
    socket.on("duplicateuser", (value) => {
      toast({
        title: "Duplicate Login Found",
        description:
          "Duplicate Login Found Please logout from previous account",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    });
    return () => {
      socket.off("updateOnlineUsers");
      socket.off("duplicateuser");
    };
  }, []);

  return (
    <Box
      w="20%"
      p={4}
      bg={useColorModeValue("gray.100", "gray.900")}
      borderRight="12"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      minHeight={"calc(100vh - 64px)"}
      maxHeight={"calc(100vh - 64px)"}
    >
      <Heading size="md" mb={4} color={color}>
        Users
      </Heading>
      <VStack spacing={4} align="stretch" overflow="auto">
        <HStack alignItems="center" justifyContent="center">
          <Button
            // borderColor={color}
            bgColor={color}
            _hover={{
              bgColor: getHoverColor(color),
              color: getFontColor(color),
            }}
            variant="outline"
            borderRadius={12}
            color={getFontColor(color)}
            width={"95%"}
            // height={"100%"}
            // transition="all 0.2s"
          >
            <Link to={"/users"}>+ New Chat</Link>
          </Button>
        </HStack>
        {usersData &&
          usersData.chat_rooms.map((user: any, index: any) => {
            const chatuser = user.participants.find((item: any) => {
              return item._id != getuseId();
            });
            const { username, _id } = chatuser;
            const { display_name, profile_picture } = chatuser?.userInfo ?? {};
            return (
              <Flex
                key={index}
                align="center"
                p={2}
                borderRadius="12"
                cursor="pointer"
                _hover={{
                  bgColor: getHoverColor(color),
                  color: getFontColor(color),
                }}
                transition="all 0.2s"
                onClick={() => {
                  handleSelectUser({
                    room_id: user._id,
                    chauser_id: chatuser._id,
                    chatUsername: chatuser.userInfo
                      ? chatuser.userInfo.display_name
                      : chatuser.username,
                    profile_picture: chatuser.userInfo
                      ? chatuser.userInfo.profile_picture
                      : "",
                  });
                }}
              >
                <Avatar
                  src={
                    chatuser?.userInfo && chatuser?.userInfo?.profile_picture
                  }
                  size="sm"
                />
                <Text ml={4} fontSize="medium" fontWeight={500}>
                  {display_name || username}
                </Text>
                <Text ml={4} color="green">
                  {activeUsers.length > 0 && activeUsers.includes(_id) && (
                    <Badge variant="solid" colorScheme="green">
                      active
                    </Badge>
                  )}
                </Text>
              </Flex>
            );
          })}
      </VStack>
    </Box>
  );
};

export default ChatSidebar;
