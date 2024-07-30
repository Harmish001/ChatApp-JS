import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { EMPTY_AVATAR_IMAGE } from "../../Constants";
import { getFontColor, getHoverColor } from "../Room/Room";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

export default function SocialProfileWithImage({
  data,
  onClick,
}: {
  data: any;
  onClick: any;
}) {
    const { color } = useContext(AuthContext);
  const { username, _id } = data;
  return (
    // <Center py={6}>
    <Box
      maxW={"270px"}
      w={"full"}
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"2xl"}
      rounded={"md"}
      overflow={"hidden"}
      borderRadius={12}
      m={2}
    >
      <Image
        h={"120px"}
        w={"full"}
        src={
          "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
        }
        objectFit="cover"
        alt="#"
      />
      <Flex justify={"center"} mt={-12}>
        <Avatar
          size={"xl"}
          src={
            data.userInfo ? data.userInfo.profile_picture : EMPTY_AVATAR_IMAGE
          }
          css={{
            border: "2px solid white",
          }}
        />
      </Flex>

      <Box p={6}>
        <Stack spacing={0} align={"center"} mb={5}>
          <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
            {data.userInfo.display_name}
          </Heading>
          <Text color={"gray.500"}>Frontend Developer</Text>
        </Stack>

        {/* <Stack direction={"row"} justify={"center"} spacing={6}>
          <Stack spacing={0} align={"center"}>
            <Text fontWeight={600}>23k</Text>
            <Text fontSize={"sm"} color={"gray.500"}>
              Followers
            </Text>
          </Stack>
          <Stack spacing={0} align={"center"}>
            <Text fontWeight={600}>23k</Text>
            <Text fontSize={"sm"} color={"gray.500"}>
              Followers
            </Text>
          </Stack>
        </Stack> */}

        <Button
          w={"full"}
          mt={8}
          bg={color}
          color={getFontColor(color)}
          _hover={{
            color: getFontColor(color),
            bgColor: getHoverColor(color),
          }}
          borderRadius={12}
          onClick={onClick}
        >
          Start Chatting
        </Button>
      </Box>
    </Box>
    // </Center>
  );
}
