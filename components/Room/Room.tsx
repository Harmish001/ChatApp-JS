import React, { useContext, useEffect, useRef, useState } from "react";
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
  FormControl,
  HStack,
  useToast,
} from "@chakra-ui/react";
import {
  useAddBackground,
  useAddNewChat,
  useGetChat,
  useUpdateChat,
} from "../../hooks/ChatHook";
import { getuseId } from "../Sidebar/Sidebar";
import { useSelectUser } from "../../context/SelectedUser";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import BackgroundImageModal from "./BackgroundImage";
import { socket } from "../../providers/Routes";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { HamburgerIcon } from "@chakra-ui/icons";
import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
import mixPlugin from "colord/plugins/mix";

extend([a11yPlugin]);
extend([mixPlugin]);

export const getFontColor = (bgColor: string) => {
  const hexColor = colord(bgColor).toHex();
  const invertColor = colord(hexColor).invert().toHex();
  const isReadable = colord(hexColor).isReadable(invertColor);
  if (isReadable) {
    return colord(invertColor).toRgbString();
  } else {
    const isDarkColor = colord(hexColor).isDark();
    if (isDarkColor) {
      return colord("#ffffff").toRgbString();
    } else {
      return colord("#000000").toRgbString();
    }
  }
};

export const getHoverColor = (bgColor: string) => {
  const hexColor = colord(bgColor).toHex();
  return colord(hexColor).darken(0.1).toRgbString();
};

export const ChatRoom = () => {
  const { selectedUser, handleSelectUser } = useSelectUser();
  const {
    state: { user_id },
    color,
  } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: ChatData } = useGetChat({
    id: selectedUser.room_id,
    queryKey: ["user_chat", selectedUser.room_id],
  });
  const { mutate: AddBackground } = useAddBackground();
  // const { mutate: UpdateChat } = useUpdateChat();
  // const { mutate: AddChat } = useAddNewChat();

  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState<any>("");
  const [isActiveRoom, setIsActiveRoom] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);

  const handleSendMessage = () => {
    const payload = {
      message: newMessage,
      receiver: selectedUser.chauser_id,
      sender: getuseId(),
      ...(messages.length > 0 && { room_id: selectedUser.room_id }),
    };
    if (messages.length > 0) {
      socket.emit(`send-message`, payload);
      // UpdateChat(payload);
    } else {
      socket.emit("new-message", payload);
      // AddChat(payload, {
      //   onSuccess: () => {
      //     setTimeout(() => {
      //       queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      //     }, 500);
      //   },
      // });
    }
    setNewMessage("");
  };

  const handleChange = (e: any) => {
    setNewMessage(e.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key == "Enter") {
      handleSendMessage();
    }
  };

  const handleFocus = (roomId: string) => {
    socket.emit("focus", roomId);
  };

  const handleBlur = (roomId: string) => {
    socket.emit("unFocus", roomId);
  };

  const handleSettings = () => {
    setIsModalOpen(true);
  };

  const handleSelectBg = (image: any) => {
    setBackgroundImage(image);
    const payload = {
      bg_image: image,
      room_id: selectedUser.room_id,
    };
    AddBackground(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["user_chat", selectedUser.room_id],
        });
      },
    });
  };

  const handleRemoveBg = () => {
    setBackgroundImage(null);
    const payload = {
      bg_image: "none",
      room_id: selectedUser.room_id,
    };
    AddBackground(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["user_chat", selectedUser.room_id],
        });
      },
    });
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (ChatData) {
      setMessages(ChatData.chat.messages);
      if (ChatData.chat.bg_image) {
        setBackgroundImage(ChatData.chat.bg_image);
      } else {
        setBackgroundImage(null);
      }
    }
  }, [ChatData]);

  useEffect(() => {
    socket.on(`message`, (message) => {
      if (selectedUser.room_id == message.room_id) {
        setMessages((prev: any) => [...prev, message]);
      }
    });
    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    socket.on("new-chat", (message) => {
      setMessages((prev: any) => [message]);
    });

    return () => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      socket.off("new-chat");
    };
  }, []);

  useEffect(() => {
    socket.on("focusedRoom", (roomId: any) => {
      const map = new Map(roomId);
      setIsActiveRoom(map);
    });

    return () => {
      socket.off("focusedRoom");
    };
  }, []);

  return (
    <Box
      w="90%"
      minHeight="calc(100vh - 64px)"
      p={4}
      // bg={useColorModeValue("gray.50", "gray.800")}
    >
      {selectedUser != null ? (
        <VStack spacing={4} align="stretch">
          <HStack justifyContent="space-between">
            <HStack>
              <Avatar size="md" src={selectedUser.profile_picture} />
              <VStack gap={0} align="start">
                <Heading size="md" color={color}>
                  {selectedUser.chatUsername}
                </Heading>
                <HStack>
                  <Text color="gray">
                    {[...isActiveRoom].length > 0 &&
                      isActiveRoom.has(selectedUser.room_id) &&
                      isActiveRoom.get(selectedUser.room_id) != socket.id &&
                      "typing..."}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <HStack>
              <HamburgerIcon
                cursor="pointer"
                onClick={handleSettings}
              ></HamburgerIcon>
            </HStack>
          </HStack>
          <Box
            h="76vh"
            p={4}
            border="1px"
            borderColor={"gray.200"}
            borderRadius="12"
            bg={"white"}
            overflowY="auto"
            backgroundImage={backgroundImage != null ? backgroundImage : ""}
            bgSize="cover"
            bgRepeat="no-repeat"
            bgPosition="center center"
          >
            {messages.length > 0 ? (
              messages.map((msg: any, index: any) => (
                <Flex
                  key={index}
                  justify={
                    msg.sender === getuseId() ? "flex-end" : "flex-start"
                  }
                >
                  <Box
                    bg={msg.sender === getuseId() ? color : "gray.300"}
                    color={
                      msg.sender === getuseId() ? getFontColor(color) : "black"
                    }
                    px={4}
                    py={2}
                    borderRadius="12px"
                    mb={2}
                  >
                    {msg.message}
                  </Box>
                </Flex>
              ))
            ) : (
              <Text>No messages yet.</Text>
            )}
          </Box>
          <Flex gap={2} my={0}>
            <FormControl onSubmit={handleSendMessage}>
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                bg={"white"}
                color={"black"}
                borderRadius="12"
                mr={2}
                onFocus={() => handleFocus(selectedUser.room_id)}
                onBlur={() => handleBlur(selectedUser.room_id)}
              />
            </FormControl>

            <Button
              rightIcon={<ArrowForwardIcon />}
              borderRadius={12}
              width={100}
              bgColor={color}
              color={getFontColor(color)}
              onClick={handleSendMessage}
              _hover={{
                bgColor: getHoverColor(color),
                color: getFontColor(color),
              }}
            >
              Send
            </Button>
          </Flex>
        </VStack>
      ) : (
        <Text>Select a user to start chatting</Text>
      )}
      <BackgroundImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectBg}
        onRemove={handleRemoveBg}
      />
    </Box>
  );
};
