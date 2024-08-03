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

  return (
    <Box
      maxW={270}
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
        src={data.userInfo.profile_picture}
        blur={1}
        sx={{ filter: "blur(1px)" }}
        opacity={0.7}
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
  );
}
