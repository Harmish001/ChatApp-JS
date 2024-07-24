import React, { useContext } from "react";
import {
  CardHeader,
  Card,
  CardBody,
  Image,
  HStack,
  Heading,
  Box,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useSelectUser } from "../../context/SelectedUser";
import { useGetAllUsers } from "../../hooks/UserInfoHook";
import { EMPTY_AVATAR_IMAGE } from "../../Constants";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getFontColor, getHoverColor } from "../Room/Room";

const UserModal = () => {
  const { handleSelectUser } = useSelectUser();
  const {
    state: { user_id },
    activeUsers,
    color,
  } = useContext(AuthContext);
  const { data } = useGetAllUsers(user_id);
  const navigate = useNavigate();

  const handleClick = (user: any) => {
    const payload = {
      id: null,
      chautser_id: user._id,
      name: user.userInfo ? user.userInfo.display_name : user.username,
      profile_picture: user.userInfo ? user.userInfo.profile_picture : "",
    };
    handleSelectUser(payload);
    navigate("/");
  };

  return (
    <Box mx={4}>
      <HStack justifyContent="center" my={4}>
        <Heading color={color}>Users</Heading>
      </HStack>
      <HStack gap={4}>
        {data &&
          data.users.length > 0 &&
          data.users.map((user: any, index: number) => {
            const { username, _id } = user;
            return (
              <Card
                key={index}
                minWidth={300}
                cursor="pointer"
                onClick={() => handleClick(user)}
                borderRadius={12}
                _hover={{
                  bgColor: getHoverColor(color),
                  color: getFontColor(color),
                }}
              >
                <CardBody>
                  <HStack justifyContent="start" alignItems="center">
                    <Image
                      src={
                        user.userInfo
                          ? user.userInfo.profile_picture
                          : EMPTY_AVATAR_IMAGE
                      }
                      alt="image"
                      height={55}
                      width={55}
                      borderRadius={"50%"}
                    />
                    <VStack gap={0} alignItems="start">
                      <CardHeader pt={0} pb={1} pl={2}>
                        <Text
                          fontSize="large"
                          fontWeight={500}
                          _hover={{ color: getFontColor(color) }}
                        >
                          {user.userInfo
                            ? user.userInfo.display_name
                            : username}
                        </Text>
                      </CardHeader>
                      {/* {activeUsers.length > 0 && activeUsers.includes(_id) && (
                        <Badge variant="solid" colorScheme="green">
                          active
                        </Badge>
                      )} */}
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>
            );
          })}
      </HStack>
    </Box>
  );
};

export default UserModal;
