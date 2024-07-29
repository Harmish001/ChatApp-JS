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
} from "@chakra-ui/react";
import { useSelectUser } from "../../context/SelectedUser";
import { HamburgerIcon } from "@chakra-ui/icons";
import { AuthContext } from "../../context/AuthContext";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { getFontColor, getHoverColor } from "./Room";
import { LockIcon } from "@chakra-ui/icons";
import { UnlockIcon } from "@chakra-ui/icons";
import {
  useGetChannelMessages,
  usePostChannelMessage,
} from "../../hooks/ChannelHook";
import { getuseId } from "../Sidebar/Sidebar";
import { socket } from "../../providers/Routes";
import moment from "moment";
import DateTag from "../CommonComponents/DateTag";

const ChannelRoom = () => {
  const { selectedUser } = useSelectUser();
  const {
    state: { user_id },
    color,
  } = useContext(AuthContext);
  const { data: ChannelData } = useGetChannelMessages({
    id: selectedUser.id,
    queryKey: ["channelMessages", selectedUser.id],
  });
  const { mutate } = usePostChannelMessage();

  const [backgroundImage, setBackgroundImage] = useState(null);
  const [message, setMessages] = useState("");
  const [channelMessges, setChannelMessages] = useState<any>([]);
  const [filteredMsg, setFilterMsg] = useState([]);

  const handleSendMessage = () => {
    const payload = {
      message,
      sender: getuseId(),
      channel_id: selectedUser.id,
    };
    socket.emit("sendChannelMessage", payload);
    // mutate(payload);
    setMessages("");
  };

  const handleChange = (e: any) => {
    setMessages(e.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key == "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (ChannelData) {
      setChannelMessages(ChannelData.messages);
    }
  }, [ChannelData]);

  useEffect(() => {
    socket.emit("joinChannel", selectedUser.id);
    socket.on("channelMessage", (newMessage) => {
      setChannelMessages((prev: any) => [...prev, newMessage]);
    });
    socket.on("filteredResult", (res) => {
      setFilterMsg(res);
      console.log("res", res);
    });
    return () => {
      socket.off("channelMessage");
    };
  }, []);
  useEffect(() => {
    socket.emit("filter", { message: "hi", channel_id: selectedUser.id });
  }, []);
  let lastDate: any = null;
  const compareArrays = (array1: any, array2: any) => {
    return array1
      .filter((obj1: any) => array2.some((obj2: any) => obj1._id === obj2._id))
      .map((obj: any) => obj._id); // Return an array of matching IDs
  };

  const matchingIds = compareArrays(channelMessges, filteredMsg);

  return (
    <Box w="90%" minHeight="calc(100vh - 64px)" p={4}>
      {selectedUser != null ? (
        <VStack spacing={4} align="stretch">
          <HStack justifyContent="space-between">
            <HStack alignItems="center">
              {selectedUser.isLock ? (
                <LockIcon w={6} h={6} />
              ) : (
                <UnlockIcon w={6} h={6} />
              )}
              <VStack align="center">
                <Heading size="md" color={color}>
                  {selectedUser.name}
                </Heading>
              </VStack>
            </HStack>
            {/* <HStack>
              <HamburgerIcon
                cursor="pointer"
                // onClick={handleSettings}
              ></HamburgerIcon>
            </HStack> */}
          </HStack>
          <Box
            h="72vh"
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
            {channelMessges && channelMessges.length > 0 ? (
              channelMessges.map((msg: any, index: any) => {
                const messageDate = moment(msg.createdAt);
                const showDateTag =
                  !lastDate || !messageDate.isSame(lastDate, "day");
                lastDate = messageDate;
                const isMatching = matchingIds.includes(msg._id);
                return (
                  <React.Fragment key={index}>
                    {showDateTag && <DateTag date={messageDate} />}
                    <Flex key={index} justify={"flex-start"} mb={3}>
                      <Avatar
                        size="md"
                        src={msg.sender.userInfo.profile_picture}
                      />
                      <VStack gap={0} pl={2} alignItems="start">
                        <HStack>
                          <Text
                            fontSize="large"
                            fontWeight={500}
                            color={getuseId() == msg.sender._id && color}
                          >
                            {msg.sender.userInfo.display_name}
                          </Text>
                          <Text fontSize="small" color="gray">
                            {moment(msg.createdAt).format("LT")}
                          </Text>
                        </HStack>
                        <Box
                          color={
                            msg.sender === getuseId()
                              ? getFontColor(color)
                              : "black"
                          }
                          bg={isMatching && "yellow.100"}
                        >
                          {msg.message}
                        </Box>
                      </VStack>
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
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                bg={"white"}
                color={"black"}
                borderRadius="12"
                mr={2}
                // onFocus={() => handleFocus(selectedUser.room_id)}
                // onBlur={() => handleBlur(selectedUser.room_id)}
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
    </Box>
  );
};

export default ChannelRoom;
