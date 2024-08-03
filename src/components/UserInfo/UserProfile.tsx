import { EmailIcon } from "@chakra-ui/icons";
import { PhoneIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Icon, Image, Stack, Text } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getFontColor, getHoverColor } from "../Room/Room";
import { EditIcon } from "@chakra-ui/icons";
import EditProfile from "./EditProfile";

const UserProfile = ({ data, setData }: { data: any; setData: any }) => {
  const { color } = useContext(AuthContext);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { profile_picture, display_name, email, contact } = data;

  const hanldeEdit = () => {
    setIsEdit(true);
  };

  return (
    <React.Fragment>
      {isEdit ? (
        <EditProfile data={data} setData={setData} setIsEdit={setIsEdit}/>
      ) : (
        <Flex
          bg="#edf3f8"
          _dark={{
            bg: "#3e3e3e",
          }}
          direction="column"
          p={4}
          borderRadius={12}
          w="full"
          h={"calc(100vh - 72px)"}
          alignItems="center"
          justifyContent="center"
        >
          <Box
            w="sm"
            mx="auto"
            bg="white"
            _dark={{
              bg: "gray.800",
            }}
            shadow="lg"
            rounded="lg"
            overflow="hidden"
            borderRadius={12}
            position="relative"
          >
            <Stack
              justifyContent="end"
              position="absolute"
              right={"10px"}
              top={"10px"}
            >
              <EditIcon
                w={10}
                h={10}
                borderRadius={"12px"}
                bg={color}
                p={2}
				cursor="pointer"
                onClick={hanldeEdit}
              />
            </Stack>
            <Image
              w="full"
              h={56}
              fit="contain"
              objectPosition="center"
              src={profile_picture}
              alt="avatar"
            />
            <Flex alignItems="center" px={6} py={3} bg={color}>
              <Text
                mx={3}
                color={getFontColor(color)}
                fontWeight="bold"
                fontSize="lg"
              >
                Focusing
              </Text>
            </Flex>
            <Box py={4} px={6}>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="gray.800"
                _dark={{
                  color: "white",
                }}
              >
                {display_name}
              </Text>

              <Text
                py={2}
                color="gray.700"
                _dark={{
                  color: "gray.400",
                }}
              >
                Full Stack maker & UI / UX Designer , love hip hop music Author
                of Building UI.
              </Text>

              <Flex
                alignItems="center"
                mt={4}
                color="gray.700"
                _dark={{
                  color: "gray.200",
                }}
              >
                <PhoneIcon h={6} w={6} mr={2} />
                <Text px={2} fontSize="sm">
                  {contact}
                </Text>
              </Flex>
              <Flex
                alignItems="center"
                mt={4}
                color="gray.700"
                _dark={{
                  color: "gray.200",
                }}
              >
                <EmailIcon h={6} w={6} mr={2} />
                <Text px={2} fontSize="sm">
                  {email}
                </Text>
              </Flex>
            </Box>
          </Box>
        </Flex>
      )}
    </React.Fragment>
  );
};

export default UserProfile;
