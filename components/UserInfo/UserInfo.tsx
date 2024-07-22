import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  HStack,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  useFetchUserInfo,
  usePostUserInfo,
  useUpdateUserInfo,
} from "../../hooks/UserInfoHook";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getFontColor, getHoverColor } from "../Room/Room";
import { axiosInstance } from "../../lib/Requests";
import axios from "axios";

type userInfoPorps = {
  contact: string;
  display_name: string;
  email: string;
  profile_picture: string;
};

const initialState: userInfoPorps = {
  contact: "",
  display_name: "",
  email: "",
  profile_picture: "",
};

const UserInfoPage = () => {
  const name = localStorage.getItem("username") || "";

  const { color } = useContext(AuthContext);
  const { data } = useFetchUserInfo(name, ["userInfo"]);
  const { mutate: PostUserInfo } = usePostUserInfo();
  const { mutate: UpdateUserInfo } = useUpdateUserInfo();
  const navigate = useNavigate();
  const [state, setState] = useState<userInfoPorps>(initialState);
  const [isUpdateInfo, setIsUpdateInfo] = useState<boolean>(false);
  const { contact, display_name, email, profile_picture } = state;

  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const imagData = e.target.files[0];
      const fileReader = new FileReader();
      try {
        fileReader.onload = async (e: any) => {
          const arrayBuffer = e.target.result;
          console.log("arrayBuffer", arrayBuffer);
          await axios
            .post(
              `${process.env.REACT_APP_URL}/uploadImage/${data.user.user_id}`,
              arrayBuffer,
              {
                headers: {
                  "Content-Type": imagData.type,
                  "Content-Disposition": `attachment; filename="${imagData.name}"`,
                },
                transformRequest: [(data) => data],
              }
            )
            .then((res) => {
              setState((prev) => ({
                ...prev,
                profile_picture: res.data.image,
              }));
            });
        };
        fileReader.readAsArrayBuffer(e.target.files[0]);
      } catch (error) {
        throw error;
      }
      const url = URL.createObjectURL(e.target.files[0]);
    }
  };

  const removeProfilePic = () => {
    setState((prev) => ({ ...prev, profile_picture: "" }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = () => {
    if (isUpdateInfo) {
      UpdateUserInfo(
        { ...state, username: name },
        {
          onSuccess: () => {
            navigate("/");
          },
        }
      );
    } else {
      PostUserInfo(
        { ...state, username: name },
        {
          onSuccess: () => {
            navigate("/");
          },
        }
      );
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  useEffect(() => {
    if (data) {
      if (Object.keys(data.user).length > 0) {
        const {
          user: { contact, display_name, profile_picture, email },
        } = data;
        setState((prev) => ({ contact, display_name, profile_picture, email }));
        setIsUpdateInfo(true);
      }
    }
  }, [data]);

  return (
    <Flex
      align="center"
      justify="center"
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl" color={color}>
            User Information
          </Heading>
        </Stack>
        <Box
          rounded="lg"
          bg={useColorModeValue("white", "gray.700")}
          boxShadow="lg"
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="displayName">
              <FormLabel>Display Name</FormLabel>
              <Input
                type="text"
                name="display_name"
                value={display_name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="contact">
              <FormLabel>Phone no.</FormLabel>
              <Input
                type="tel"
                value={contact}
                name="contact"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="profilePic">
              <FormLabel>Profile Picture</FormLabel>
              <Center>
                <Avatar size="xl" src={profile_picture}>
                  <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="red"
                    aria-label="remove Image"
                    icon={<SmallCloseIcon />}
                    onClick={removeProfilePic}
                  />
                </Avatar>
              </Center>
              <Center mt={4}>
                <Button
                  as="label"
                  htmlFor="file-upload"
                  cursor="pointer"
                  bg={color}
                  color={getFontColor(color)}
                  _hover={{
                    bg: getHoverColor(color),
                    color: getFontColor(color),
                  }}
                >
                  Upload Image
                </Button>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  hidden
                />
              </Center>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <HStack>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={color}
                  color={getFontColor(color)}
                  _hover={{
                    bg: getHoverColor(color),
                    color: getFontColor(color),
                  }}
                  onClick={handleSubmit}
                >
                  Save Information
                </Button>
                <Button size="lg" onClick={handleSkip}>
                  Skip for now
                </Button>
              </HStack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default UserInfoPage;
