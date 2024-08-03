import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  Text,
  VStack,
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
import { useGetChannels } from "../../hooks/ChannelHook";
import { SmallAddIcon } from "@chakra-ui/icons";
import { SettingsIcon } from "@chakra-ui/icons";
import CreateChannel from "../Channels/CreateChannel";

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

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

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const onOpen = () => {
    setIsOpen(true);
  };

  const { data: usersData } = useGetUsers({
    id: user_id,
    queryKey: ["chatRooms", user_id],
  });

  const { data: channelData } = useGetChannels({
    id: user_id,
    queryKey: ["channels", user_id],
  });

  useEffect(() => {
    const user: any = localStorage.getItem("selected-platform");
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
    // socket.on("duplicateuser", (value) => {
    // 	toast({
    // 		title: "Duplicate Login Found",
    // 		description:
    // 			"Duplicate Login Found Please logout from previous account",
    // 		status: "warning",
    // 		duration: 3000,
    // 		isClosable: true,
    // 	});
    // 	navigate("/login");
    // });
    return () => {
      socket.off("updateOnlineUsers");
      // socket.off("duplicateuser");
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
      <VStack spacing={2} align="stretch" overflow="auto">
        <VStack overflow="auto">
          <HStack
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            onClick={onOpen}
          >
            <Text color={color} fontSize="large" fontWeight={500}>
              Add Channel
            </Text>
            <SmallAddIcon w={6} h={6} color={color} />
          </HStack>
          {channelData &&
            channelData.channels.length > 0 &&
            channelData.channels.map((channel: any, index: any) => {
              const { channel_name, _id } = channel;
              return (
                <Flex
                  key={index}
                  align="start"
                  justifyContent="start"
                  m={0}
                  py={2}
                  px={2}
                  gap={0}
                  width="100%"
                  borderRadius="12"
                  cursor="pointer"
                  _hover={{
                    bgColor: getHoverColor(color),
                    color: getFontColor(color),
                  }}
                  transition="all 0.2s"
                  onClick={() => {
                    handleSelectUser({
                      id: channel._id,
                      name: channel.channel_name,
                      isLock: channel.is_private,
                    });
                  }}
                >
                  <HStack width="100%" justifyContent="space-between">
                    <Text ml={2} mr={4} fontSize="inherit" fontWeight={500}>
                      # &nbsp;{channel_name}
                    </Text>
                  </HStack>
                </Flex>
              );
            })}
          {channelData && channelData.channels.length == 0 && (
            <Button
              borderColor={color}
              _hover={{
                bgColor: getHoverColor(color),
                color: getFontColor(color),
              }}
              variant="outline"
              borderRadius={12}
              width={"95%"}
              ml={2}
              onClick={onOpen}
            >
              <Text fontSize="small" fontWeight={500}>
                + New Channel{" "}
              </Text>
            </Button>
          )}
        </VStack>
        <VStack align="stretch" overflow="auto">
          <HStack alignItems="center" cursor="pointer" justifyContent="center" >
            <Link to={"/users"} >
              <HStack>
                <Text color={color} fontSize="large" fontWeight={500}>
                  Users
                </Text>
                <SmallAddIcon w={6} h={6} color={color} />
              </HStack>
            </Link>
          </HStack>
          {usersData &&
            usersData.chat_rooms.map((user: any, index: any) => {
              const chatuser = user.participants.find((item: any) => {
                return item._id != getuseId();
              });
              const { username, _id } = chatuser;
              const { display_name, profile_picture } =
                chatuser?.userInfo ?? {};
              return (
                <Flex
                  key={index}
                  align="center"
                  m={0}
                  py={2}
                  px={2}
                  gap={0}
                  borderRadius="12"
                  cursor="pointer"
                  _hover={{
                    bgColor: getHoverColor(color),
                    color: getFontColor(color),
                  }}
                  transition="all 0.25s"
                  onClick={() => {
                    handleSelectUser({
                      id: user._id,
                      chatuser_id: chatuser._id,
                      name: chatuser.userInfo
                        ? chatuser.userInfo.display_name
                        : chatuser.username,
                      profile_picture: chatuser.userInfo
                        ? chatuser.userInfo.profile_picture
                        : "",
                      type: "chatRoom",
                    });
                  }}
                >
                  <Avatar
                    src={
                      chatuser?.userInfo && chatuser?.userInfo?.profile_picture
                    }
                    size="sm"
                  />
                  <Text ml={4} fontSize="inherit" fontWeight={400}>
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
      </VStack>
      <CreateChannel isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default ChatSidebar;
