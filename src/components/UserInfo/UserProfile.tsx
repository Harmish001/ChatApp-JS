import { EmailIcon } from "@chakra-ui/icons";
import { PhoneIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Stack,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getFontColor, getHoverColor } from "../Room/Room";
import { EditIcon } from "@chakra-ui/icons";
import EditProfile from "./EditProfile";

const UserProfile = ({ data, setData }: { data: any; setData: any }) => {
  const { color } = useContext(AuthContext);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { profile_picture, display_name, email, contact, bio, tag } = data;

  const hanldeEdit = () => {
    setIsEdit(true);
  };

  const checkForInfo = (stateValue: string, stateName: string) => {
    if (stateValue == null || stateValue.length == 0) {
      return `Add your ${stateName}`;
    } else {
      return stateValue;
    }
  };

  return (
    <React.Fragment>
      {isEdit ? (
        <EditProfile data={data} setData={setData} setIsEdit={setIsEdit} />
      ) : (
        <Flex
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
                color={getFontColor(color)}
                _hover={{ bg: getHoverColor(color) }}
              />
            </Stack>
            <Image
              w="full"
              h={56}
              fit="cover"
              objectPosition="center"
              src={profile_picture}
              alt="avatar"
            />
            <Flex alignItems="center" px={6} py={2} bg={color}>
              <Tag
                size="md"
                py={1}
				pr={3}
				pl={1}
                bg={getFontColor(color)}
                borderRadius="full"
              >
                <Tag borderRadius={"50%"} mr={2} size="sm" bg={color} />
                <TagLabel color={color}>{checkForInfo(tag, "Tag")}</TagLabel>
              </Tag>
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
                {checkForInfo(bio,"Bio")}
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
                  {checkForInfo(contact,"Contact")}
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
                  {checkForInfo(email,"Email")}
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
