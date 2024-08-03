import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Select,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { getFontColor, getHoverColor } from "../Room/Room";
import { AuthContext } from "../../context/AuthContext";
import { useUpdateUserInfo } from "../../hooks/UserInfoHook";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelectUser } from "../../context/SelectedUser";

const EditProfile = ({ data, setData, setIsEdit }: any) => {
  const { color } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const { mutate: UpdateUserInfo } = useUpdateUserInfo();
  const navigate = useNavigate();

  const { contact, display_name, email, profile_picture, gender } = data;

  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const imagData = e.target.files[0];
      const fileReader = new FileReader();
      try {
        fileReader.onload = async (e: any) => {
          const arrayBuffer = e.target.result;
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
              setData((prev: any) => ({
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
    setData((prev: any) => ({ ...prev, profile_picture: "" }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = () => {
    const payload = { ...data, username: display_name, user_id: user.id };
    console.log(payload);
    UpdateUserInfo(payload, {
      onSuccess: () => {
        setIsEdit(false);
      },
    });
  };

  const handleGenderChange = (e: any) => {
    setData((prev: any) => ({ ...prev, gender: e.target.value }));
  };

  const handleSkip = () => {
    setIsEdit(false);
  };

  return (
    <React.Fragment>
      <Flex
        align="center"
        justify="center"
        bg={useColorModeValue("gray.50", "gray.800")}
        h={"calc(100vh - 72px)"}
      >
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
            <FormControl id="gender">
              <FormLabel>Gender</FormLabel>
              <Select
                placeholder="Select Gender"
                value={gender}
                onChange={handleGenderChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
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
                  Update Profile
                </Button>
                <Button size="lg" onClick={handleSkip} mx={2}>
                  Skip for now
                </Button>
              </HStack>
            </Stack>
          </Stack>
        </Box>
      </Flex>
    </React.Fragment>
  );
};

export default EditProfile;
