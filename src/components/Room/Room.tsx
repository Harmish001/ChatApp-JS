import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  FormControl,
  HStack,
  InputGroup,
  useMediaQuery,
} from "@chakra-ui/react";
import { useAddBackground, useGetChat } from "../../hooks/ChatHook";
import { getuseId } from "../Sidebar/Sidebar";
import { useSelectUser } from "../../context/SelectedUser";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import BackgroundImageModal from "./BackgroundImage";
import { socket } from "../../providers/Routes";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
import mixPlugin from "colord/plugins/mix";
import DateTag from "../CommonComponents/DateTag";
import moment from "moment";
import { SearchIcon } from "@chakra-ui/icons";
import { SettingsIcon } from "@chakra-ui/icons";
import { CloseIcon } from "@chakra-ui/icons";

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
  let lastDate: any = null;
  const isTablet = useMediaQuery("(min-width: 800px)")[0];
  const queryClient = useQueryClient();
  const roomRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const { data: ChatData } = useGetChat({
    id: selectedUser.id,
    queryKey: ["user_chat", selectedUser.id],
  });

  const { mutate: AddBackground } = useAddBackground();

  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState<any>("");
  const [isActiveRoom, setIsActiveRoom] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [filteredMsg, setFilterMsg] = useState<any>([]);
  const [openSearchBar, setOpenSearchBar] = useState(false);

  const handleSendMessage = () => {
    const payload = {
      message: newMessage,
      receiver: selectedUser.chatuser_id,
      sender: getuseId(),
      room_id: selectedUser.id,
    };
    // if (messages.length > 0) {
    socket.emit("new-message", payload);

    // UpdateChat(payload);
    // } else {
    //   socket.emit("new-message", payload);
    // AddChat(payload, {
    //   onSuccess: () => {
    //     setTimeout(() => {
    //       queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
    //     }, 500);
    //   },
    // });
    // }
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

  const handleSearchOpen = () => {
    setOpenSearchBar(true);
  };

  const handleSelectBg = (image: any) => {
    setBackgroundImage(image);
    const payload = {
      bg_image: image,
      room_id: selectedUser.id,
    };
    AddBackground(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["user_chat", selectedUser.id],
        });
      },
    });
  };

  const handleRemoveBg = () => {
    setBackgroundImage(null);
    const payload = {
      bg_image: "none",
      room_id: selectedUser.id,
    };
    AddBackground(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["user_chat", selectedUser.id],
        });
      },
    });
    setIsModalOpen(false);
  };

  const handleSearchChange = (e: any) => {
    socket.emit("filterChat", {
      message: e.target.value,
      room_id: selectedUser.id,
    });
  };

  useEffect(() => {
    if (ChatData) {
      setMessages(ChatData.chat);
      if (ChatData.chat.bg_image) {
        // setBackgroundImage(ChatData.chat.bg_image);
      } else {
        setBackgroundImage(null);
      }
      setTimeout(() => {
        if (roomRef && roomRef.current) {
          roomRef.current.scrollTo({
            top: roomRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 500);
    }
  }, [ChatData]);

  useEffect(() => {
    socket.on(`message`, (message) => {
      setMessages((prev: any) => [...prev, message]);
    });
    socket.on("filteredChatResult", (res) => {
      setFilterMsg(res);
    });
    return () => {
      socket.off("message");
    };
  }, []);

  //   useEffect(() => {
  //     socket.on("new-chat", (message) => {
  //       setMessages((prev: any) => [...prev, message]);
  //     });

  //     return () => {
  //       queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
  //       socket.off("new-chat");
  //     };
  //   }, []);

  useEffect(() => {
    socket.on("focusedRoom", (roomId: any) => {
      const map = new Map(roomId);
      setIsActiveRoom(map);
    });

    return () => {
      socket.off("focusedRoom");
    };
  }, []);

  useEffect(() => {
    socket.emit("roomId", selectedUser.id);
  }, []);

  useEffect(() => {
    if (boxRef && boxRef.current) {
      boxRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [selectedUser]);

  return (
    <Box
      w={!isTablet ? "100%" : "90%"}
      minHeight="calc(100vh - 64px)"
      maxHeight="calc(100vh - 64px)"
      p={4}
      ref={boxRef}
    >
      {selectedUser != null ? (
        <VStack spacing={4} align="stretch">
          <HStack justifyContent="space-between">
            <HStack>
              <Avatar size="sm" src={selectedUser.profile_picture} />
              <VStack gap={0} align="start">
                <Heading size="md" color={color}>
                  {selectedUser.name}
                </Heading>
                <HStack>
                  <Text color="gray">
                    {[...isActiveRoom].length > 0 &&
                      isActiveRoom.has(selectedUser.id) &&
                      isActiveRoom.get(selectedUser.id) != socket.id &&
                      "typing..."}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <HStack>
              <HStack>
                {openSearchBar && (
                  <InputGroup>
                    <Input
                      variant="flushed"
                      autoFocus
                      type="text"
                      size="sm"
                      onChange={handleSearchChange}
                    />
                  </InputGroup>
                )}
                {!openSearchBar && <SearchIcon
                  cursor="pointer"
                  onClick={() => setOpenSearchBar(!openSearchBar)}
                />}
                {openSearchBar && <CloseIcon
                  cursor="pointer"
                  onClick={() => setOpenSearchBar(!openSearchBar)}
                />}
              </HStack>
              <SettingsIcon
                cursor="pointer"
                ml={2}
                onClick={handleSettings}
              ></SettingsIcon>
            </HStack>
          </HStack>
          <Box
            height={!isTablet ? "calc(100vh - 120px)" : "calc(100vh - 200px)"}
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
            ref={roomRef}
          >
            {messages.length > 0 ? (
              messages.map((msg: any, index: any) => {
                const messageDate = moment(msg.createdAt).startOf("day");
                const showDateTag =
                  !lastDate || !messageDate.isSame(lastDate, "day");
                lastDate = messageDate;
                return (
                  <React.Fragment key={index}>
                    {showDateTag && <DateTag date={msg.createdAt} />}
                    <Flex
                      key={index}
                      justify={
                        msg.sender === getuseId() ? "flex-end" : "flex-start"
                      }
                    >
                      <Box
                        bg={msg.sender === getuseId() ? color : "gray.100"}
                        color={
                          msg.sender === getuseId()
                            ? getFontColor(color)
                            : "black"
                        }
                        px={4}
                        py={2}
                        borderRadius="12px"
                        my={1}
                      >
                        <Text
                          bg={
                            filteredMsg &&
                            filteredMsg.includes(msg.message) &&
                            "#fff9419c"
                          }
                          fontSize="medium"
                        >
                          {msg.message}
                        </Text>
                      </Box>
                    </Flex>
                  </React.Fragment>
                );
              })
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
                onFocus={() => handleFocus(selectedUser.id)}
                onBlur={() => handleBlur(selectedUser.id)}
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
